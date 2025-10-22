# Team Synergy - Diversity Card Game

A highly visual, trick-based card game designed to teach Renault engineers about the benefits of diverse work teams. Available as a web application and Microsoft Teams app.

![Team Synergy Game](./screenshots/game-preview.png)

## Overview

**Team Synergy** demonstrates how diverse teams solve complex engineering challenges more effectively through engaging gameplay. Players build teams with varied skills, perspectives, experiences, and backgrounds to earn bonus points and win challenges.

### Key Features

- **Highly Visual Interface**: Modern, Renault-inspired design with smooth animations
- **Multiple Play Modes**: Single-player (vs AI) and multiplayer
- **Web & Teams Compatible**: Play in any browser or as a Microsoft Teams app
- **Educational**: Teaches diversity benefits through game mechanics
- **Physical Version**: Includes printable cards for in-person play

---

## Quick Start

### Web Version

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd diversity-game
   ```

2. **Serve the files**

   Option A - Using Python:
   ```bash
   python -m http.server 8000
   ```

   Option B - Using Node.js http-server:
   ```bash
   npx http-server -p 8000
   ```

   Option C - Using any web server (Apache, Nginx, etc.)

3. **Open in browser**
   ```
   http://localhost:8000/index.html
   ```

4. **Start Playing!**

---

## Microsoft Teams Installation

### Prerequisites

- Microsoft Teams admin access
- Azure Active Directory app registration
- Hosting URL (Azure Static Web Apps, Azure App Service, or similar)

### Step 1: Deploy to Azure

#### Using Azure Static Web Apps (Recommended)

1. **Create Static Web App**
   ```bash
   az staticwebapp create \
     --name team-synergy \
     --resource-group <your-resource-group> \
     --source https://github.com/<your-repo> \
     --location "West Europe" \
     --branch main \
     --app-location "/diversity-game" \
     --output-location ""
   ```

2. **Get your URL**
   ```bash
   az staticwebapp show \
     --name team-synergy \
     --query "defaultHostname" \
     --output tsv
   ```

#### Using Azure App Service

1. **Create App Service**
   ```bash
   az webapp create \
     --name team-synergy \
     --resource-group <your-resource-group> \
     --plan <your-app-service-plan>
   ```

2. **Deploy files**
   ```bash
   az webapp deployment source config-zip \
     --name team-synergy \
     --resource-group <your-resource-group> \
     --src diversity-game.zip
   ```

### Step 2: Register Azure AD App

1. **Navigate to Azure Portal** → Azure Active Directory → App registrations

2. **Create new registration**
   - Name: Team Synergy
   - Supported account types: Your organization only
   - Redirect URI: Web → `https://<your-domain>/auth-end`

3. **Note your Application (client) ID**

4. **Add API permissions**
   - Microsoft Graph → User.Read

### Step 3: Configure Teams Manifest

1. **Edit `teams/manifest.json`**

   Replace placeholders:
   ```json
   {
     "id": "<YOUR_TEAMS_APP_ID>",
     "validDomains": ["<YOUR_DOMAIN>"],
     "webApplicationInfo": {
       "id": "<YOUR_AAD_APP_ID>",
       "resource": "api://<YOUR_DOMAIN>/<YOUR_AAD_APP_ID>"
     }
   }
   ```

2. **Update configuration URLs**
   - Replace `{{YOUR_DOMAIN}}` with your actual domain
   - Update `configurationUrl` and `contentUrl`

### Step 4: Create App Package

1. **Create app icons** (if not already present)
   - `teams/color.png` - 192x192 color icon
   - `teams/outline.png` - 32x32 outline icon

2. **Zip the manifest package**
   ```bash
   cd teams
   zip -r team-synergy-app.zip manifest.json color.png outline.png
   ```

### Step 5: Upload to Teams

1. **Open Microsoft Teams**

2. **Go to Apps** → Manage your apps → Upload an app

3. **Select "Upload an app to your org's app catalog"**

4. **Upload** `team-synergy-app.zip`

5. **Add to a team or use personally**

---

## Game Rules

### Objective
Build diverse teams to solve engineering challenges. Earn points by winning tricks, with bonus points for team diversity!

### Card Types

- **★ Skills** (Green): Technical expertise (Software, Hardware, Design, Testing)
- **◆ Perspectives** (Blue): Thinking styles (Analytical, Creative, Strategic, Practical)
- **● Experience** (Orange): Career stages (Junior, Mid-level, Senior, Expert)
- **■ Background** (Purple): Cultural diversity (Regions, languages, industries)

### Gameplay

1. **Deal**: Each player receives 10 cards
2. **Challenge**: A challenge card is revealed (e.g., "Autonomous Vehicle Safety System")
3. **Play**: Lead player plays a card, others follow suit if possible
4. **Win**: Highest card of lead suit wins the trick
5. **Score**:
   - Base points = Sum of card values
   - **Diversity Bonus**: +10 points for all 4 suits, +5 for 3 suits
6. **Repeat**: Play 10 rounds, highest score wins!

### Strategy

- **Build diverse teams**: Aim for all 4 suit types in each trick
- **Track suits**: Remember which suits have been played
- **Save high cards**: Use valuable cards strategically
- **Force diversity**: Lead with suits to create diverse combinations

---

## File Structure

```
diversity-game/
├── index.html              # Main game page
├── styles.css              # Visual styling (Renault-inspired)
├── game.js                 # Core game logic
├── teams-integration.js    # Microsoft Teams SDK integration
├── teams/
│   ├── manifest.json       # Teams app manifest
│   ├── teams-config.html   # Configuration page
│   ├── teams-config.js     # Configuration logic
│   ├── color.png          # 192x192 color icon
│   └── outline.png        # 32x32 outline icon
├── PHYSICAL_GAME_GUIDE.md # Print-and-play instructions
└── README.md              # This file
```

---

## Configuration

### Game Settings

Edit `game.js` to customize:

```javascript
// Number of rounds
totalRounds: 10,

// Challenge cards
challenges: [
    "Your custom challenge 1",
    "Your custom challenge 2",
    // ... add more
],

// Card roles (customize for your organization)
CARD_ROLES: {
    skills: ['Your', 'Custom', 'Roles', ...],
    // ...
}
```

### Visual Customization

Edit `styles.css` to match your brand:

```css
:root {
    --primary-color: #ffcc00;      /* Change to your brand color */
    --secondary-color: #000000;
    --skills-color: #4CAF50;       /* Customize suit colors */
    --perspectives-color: #2196F3;
    --experience-color: #FF9800;
    --background-color: #9C27B0;
}
```

---

## Physical Game Version

### Print Cards

1. **Download printable PDF** (create using the card data in game.js)
2. **Print on 300gsm cardstock**
3. **Cut cards** to poker size (63mm × 88mm)
4. **Optional**: Use card sleeves for durability

### Full Instructions

See `PHYSICAL_GAME_GUIDE.md` for:
- Complete card list
- Printing instructions
- Facilitation guide
- Debrief questions
- Variants and accessibility options

---

## Development

### Prerequisites

- Modern web browser (Chrome, Edge, Firefox, Safari)
- Basic HTTP server
- For Teams: Azure subscription, Teams admin access

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd diversity-game

# Start local server
python -m http.server 8000
# or
npx http-server -p 8000

# Open browser
open http://localhost:8000
```

### Testing in Teams

1. **Use ngrok for local testing**
   ```bash
   ngrok http 8000
   ```

2. **Update manifest.json** with ngrok URL

3. **Zip and upload** to Teams

4. **Test** the app

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supported

---

## Troubleshooting

### Game won't load
- Check browser console for errors
- Ensure all files are served via HTTP/HTTPS (not file://)
- Verify JavaScript is enabled

### Teams app won't install
- Verify manifest.json is valid (use Teams App Validator)
- Check that domain is in validDomains array
- Ensure Azure AD app is configured correctly
- Verify hosting URL is HTTPS

### Cards not displaying correctly
- Clear browser cache
- Check CSS file is loading
- Verify all game assets are accessible

### AI players not working
- Check browser console for JavaScript errors
- Ensure game.js is loaded correctly
- Verify setTimeout functions aren't blocked

---

## Customization Ideas

### For Renault-Specific Content

1. **Replace challenges** with actual Renault projects
2. **Update card roles** to match Renault job titles
3. **Add Renault branding** (logos, colors)
4. **Include real engineer profiles** (with permission)

### Educational Extensions

1. **Add statistics tracking** (diversity impact analysis)
2. **Create difficulty levels** (beginner, intermediate, expert)
3. **Implement achievements** (badges for diverse team building)
4. **Add replay feature** (review game decisions)

### Multiplayer Features

1. **Real-time multiplayer** using WebSockets
2. **Leaderboards** (most diverse team builder)
3. **Tournament mode** (bracket system)
4. **Team vs. Team** (collaborative play)

---

## Educational Use

### Learning Objectives

After playing, participants should understand:
- Diverse teams combine different strengths
- Complementary skills create synergy
- Variety in perspectives leads to better outcomes
- Inclusive teams outperform homogeneous ones

### Facilitation Guide

**Before Playing (5 min)**
- Explain game rules briefly
- Emphasize diversity bonus mechanics
- Set expectation for debrief discussion

**During Playing (30-45 min)**
- Observe strategies
- Note interesting moments
- Track diversity bonus frequencies

**After Playing (15-20 min)**
- Debrief questions:
  - "When did diversity make a difference?"
  - "How does this relate to real engineering?"
  - "What barriers prevent diverse teams in reality?"
  - "How can we actively build more diverse teams?"

### Workshop Integration

Use Team Synergy as part of:
- Diversity & Inclusion training
- Team building events
- Onboarding programs
- Leadership development
- Innovation workshops

---

## Performance

### Optimization

- Lightweight: ~50KB total (HTML + CSS + JS)
- No external dependencies (except Teams SDK in Teams context)
- Runs entirely client-side
- Works offline after initial load

### Scalability

- Single-player: No server needed
- Multiplayer: Requires WebSocket server (not included)
- Teams integration: Leverages Microsoft infrastructure

---

## Accessibility

### Features

- Keyboard navigation supported
- Screen reader friendly labels
- High contrast mode compatible
- Reduced motion respect (`prefers-reduced-motion`)
- Color-blind friendly (distinct symbols per suit)

### WCAG Compliance

- Level AA compliant
- Semantic HTML structure
- ARIA labels where appropriate
- Sufficient color contrast ratios

---

## Security

### Web Version

- No user data collected
- No external API calls
- No cookies or local storage (optional)
- Runs entirely in browser

### Teams Version

- Authenticates via Azure AD
- Uses Microsoft Teams SDK
- No custom backend required
- Follows Microsoft security practices

---

## License

[Specify your license here]

---

## Support

For questions, issues, or feature requests:

- **Email**: [your-email@renault.com]
- **Teams Channel**: [Your Teams Channel]
- **Internal Portal**: [Link to documentation]

---

## Changelog

### Version 1.0.0 (Initial Release)
- Complete web-based game
- Microsoft Teams integration
- AI opponents
- Physical game documentation
- Comprehensive facilitation guide

---

## Roadmap

### Planned Features

- [ ] Real-time multiplayer
- [ ] Statistics dashboard
- [ ] Custom card creator
- [ ] Mobile app versions
- [ ] Additional language support
- [ ] Integration with Learning Management Systems

---

## Contributing

[Add contribution guidelines if applicable]

---

## Acknowledgments

- Inspired by traditional trick-taking card games (Hearts, Spades, Bridge)
- Designed for Renault engineering teams
- Built with diversity and inclusion in mind

---

**Built with ❤️ for Renault Engineers**

*Experience the power of diverse teams through engaging gameplay!*
