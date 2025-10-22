# Team Synergy - Deployment Guide

This guide covers deploying Team Synergy to various platforms.

---

## Option 1: Azure Static Web Apps (Recommended)

### Why Azure Static Web Apps?
- Free tier available
- Automatic HTTPS
- Global CDN
- Built-in authentication
- Perfect for Microsoft Teams integration

### Deployment Steps

#### 1. Prerequisites
```bash
# Install Azure CLI
# Windows: Download from https://aka.ms/installazurecliwindows
# Mac: brew install azure-cli
# Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login
```

#### 2. Create Resource Group
```bash
az group create \
  --name team-synergy-rg \
  --location "westeurope"
```

#### 3. Create Static Web App
```bash
az staticwebapp create \
  --name team-synergy \
  --resource-group team-synergy-rg \
  --source https://github.com/YOUR_ORGANIZATION/YOUR_REPO \
  --location "westeurope" \
  --branch main \
  --app-location "/diversity-game" \
  --output-location "" \
  --login-with-github
```

#### 4. Get Your URL
```bash
az staticwebapp show \
  --name team-synergy \
  --resource-group team-synergy-rg \
  --query "defaultHostname" \
  --output tsv
```

Your URL will be: `https://team-synergy.azurestaticapps.net`

#### 5. Configure Custom Domain (Optional)
```bash
az staticwebapp hostname set \
  --name team-synergy \
  --resource-group team-synergy-rg \
  --hostname "teamsynergy.renault.com"
```

---

## Option 2: Azure App Service

### Deployment Steps

#### 1. Create App Service Plan
```bash
az appservice plan create \
  --name team-synergy-plan \
  --resource-group team-synergy-rg \
  --sku F1 \
  --is-linux
```

#### 2. Create Web App
```bash
az webapp create \
  --name team-synergy \
  --resource-group team-synergy-rg \
  --plan team-synergy-plan \
  --runtime "NODE:18-lts"
```

#### 3. Deploy Files
```bash
# Create zip file
cd diversity-game
zip -r ../team-synergy.zip .

# Deploy
az webapp deployment source config-zip \
  --name team-synergy \
  --resource-group team-synergy-rg \
  --src ../team-synergy.zip
```

---

## Option 3: GitHub Pages

### Deployment Steps

#### 1. Enable GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages"
3. Select source: "Deploy from a branch"
4. Select branch: `main`
5. Select folder: `/diversity-game`
6. Click "Save"

#### 2. Access Your Site
Your URL will be: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

#### 3. Custom Domain (Optional)
1. Add a CNAME file with your domain
2. Configure DNS settings
3. Enable HTTPS in GitHub Pages settings

---

## Option 4: Internal Renault Server

### Requirements
- Web server (Apache, Nginx, IIS)
- HTTPS enabled (required for Teams)
- Access to internal DNS

### Apache Configuration
```apache
<VirtualHost *:443>
    ServerName teamsynergy.renault.internal
    DocumentRoot /var/www/team-synergy

    <Directory /var/www/team-synergy>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</VirtualHost>
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name teamsynergy.renault.internal;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/team-synergy;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

---

## Microsoft Teams Configuration

### After Deploying

#### 1. Register Azure AD App

1. **Azure Portal** → Azure Active Directory → App registrations → New registration

2. **Basic Information**
   - Name: Team Synergy
   - Supported account types: Accounts in this organizational directory only
   - Redirect URI: Web → `https://YOUR_DOMAIN/auth-end`

3. **API Permissions**
   - Add permission → Microsoft Graph → Delegated → User.Read
   - Grant admin consent

4. **Expose an API**
   - Application ID URI: `api://YOUR_DOMAIN/YOUR_APP_ID`
   - Add scope: `access_as_user`

5. **Note your Application (client) ID**

#### 2. Update Teams Manifest

Edit `teams/manifest.json`:

```json
{
  "id": "GENERATE_A_NEW_GUID",
  "validDomains": ["your-deployed-domain.com"],
  "webApplicationInfo": {
    "id": "YOUR_AAD_APP_ID",
    "resource": "api://your-deployed-domain.com/YOUR_AAD_APP_ID"
  }
}
```

Update URLs:
```json
{
  "configurableTabs": [{
    "configurationUrl": "https://your-deployed-domain.com/teams/teams-config.html"
  }],
  "staticTabs": [{
    "contentUrl": "https://your-deployed-domain.com/index.html"
  }]
}
```

#### 3. Create App Icons

Required sizes:
- `color.png`: 192x192 pixels, color icon
- `outline.png`: 32x32 pixels, transparent outline

#### 4. Package and Upload

```bash
cd teams
zip -r team-synergy-app.zip manifest.json color.png outline.png
```

Upload to Microsoft Teams:
1. Teams → Apps → Manage your apps
2. Upload an app to your org's app catalog
3. Select `team-synergy-app.zip`
4. Approve and publish

---

## Environment-Specific Configuration

### Production
```javascript
// No changes needed - all client-side
```

### Development
```javascript
// Use local server
// Update teams/manifest.json with ngrok URL for testing
```

### Staging
```javascript
// Deploy to separate Azure Static Web App
// Use different Teams app package
```

---

## Security Checklist

Before deploying to production:

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Azure AD authentication configured (for Teams)
- [ ] Domain validated in Teams manifest
- [ ] Content Security Policy set
- [ ] CORS configured correctly
- [ ] No sensitive data in client code
- [ ] Error messages don't expose system details

---

## Monitoring and Analytics

### Azure Application Insights

1. **Create Application Insights**
```bash
az monitor app-insights component create \
  --app team-synergy \
  --location westeurope \
  --resource-group team-synergy-rg
```

2. **Get Instrumentation Key**
```bash
az monitor app-insights component show \
  --app team-synergy \
  --resource-group team-synergy-rg \
  --query instrumentationKey
```

3. **Add to HTML** (optional)
```html
<script>
  var appInsights = window.appInsights || function(config) {
    // Application Insights snippet
  }({
    instrumentationKey: "YOUR_KEY"
  });
  appInsights.trackPageView();
</script>
```

---

## Troubleshooting

### Common Issues

**Issue**: Teams app won't load
- **Solution**: Verify HTTPS is enabled and domain is in validDomains

**Issue**: Authentication fails
- **Solution**: Check Azure AD app configuration and scopes

**Issue**: Cards not displaying
- **Solution**: Check browser console, verify all assets are loading

**Issue**: Slow loading
- **Solution**: Enable CDN, optimize images, minify CSS/JS

---

## Rollback Procedure

### Azure Static Web Apps
```bash
# List deployments
az staticwebapp environment list \
  --name team-synergy \
  --resource-group team-synergy-rg

# Delete problematic deployment (will revert to previous)
az staticwebapp environment delete \
  --name team-synergy \
  --resource-group team-synergy-rg \
  --environment-name ENVIRONMENT_NAME
```

### Manual Deployment
1. Keep backup of previous version
2. Replace files with backup
3. Clear cache
4. Test functionality

---

## Performance Optimization

### Enable Compression
```apache
# Apache
AddOutputFilterByType DEFLATE text/html text/css application/javascript
```

```nginx
# Nginx
gzip on;
gzip_types text/html text/css application/javascript;
```

### Cache Headers
```apache
# Apache
<FilesMatch "\.(html|css|js)$">
  Header set Cache-Control "max-age=3600, public"
</FilesMatch>
```

```nginx
# Nginx
location ~* \.(html|css|js)$ {
  expires 1h;
  add_header Cache-Control "public";
}
```

---

## Maintenance

### Regular Tasks

**Weekly**
- Check error logs
- Monitor usage statistics
- Verify all features working

**Monthly**
- Update dependencies (if any)
- Review security advisories
- Backup configuration

**Quarterly**
- Performance review
- User feedback analysis
- Consider feature updates

---

## Support Contacts

**Azure Issues**: [Azure Support Portal](https://portal.azure.com)
**Teams Issues**: [Microsoft Teams Admin Center](https://admin.teams.microsoft.com)
**Internal Support**: [Your IT Contact]

---

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Microsoft Teams App Development](https://docs.microsoft.com/microsoftteams/platform/)
- [Azure AD App Registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)

---

**Last Updated**: 2024
**Maintained By**: [Your Team]
