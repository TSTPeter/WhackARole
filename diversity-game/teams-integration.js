// Microsoft Teams Integration for Team Synergy Game

class TeamsIntegration {
    constructor() {
        this.isTeamsContext = false;
        this.teamsContext = null;
        this.isMultiplayer = false;
    }

    // Initialize Teams SDK
    async initialize() {
        try {
            // Check if running in Teams
            if (typeof microsoftTeams !== 'undefined') {
                await microsoftTeams.app.initialize();
                this.isTeamsContext = true;

                // Get context
                this.teamsContext = await microsoftTeams.app.getContext();

                console.log('Teams context:', this.teamsContext);

                // Parse URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                this.isMultiplayer = urlParams.get('mode') === 'multiplayer';

                // Apply Teams theme
                this.applyTeamsTheme();

                return true;
            }
            return false;
        } catch (error) {
            console.error('Error initializing Teams:', error);
            return false;
        }
    }

    // Apply Teams theme
    applyTeamsTheme() {
        if (!this.teamsContext) return;

        const theme = this.teamsContext.app.theme;
        const root = document.documentElement;

        switch (theme) {
            case 'dark':
                root.style.setProperty('--bg-gradient-start', '#1f1f1f');
                root.style.setProperty('--bg-gradient-end', '#2d2d2d');
                root.style.setProperty('--text-light', '#ffffff');
                break;
            case 'contrast':
                root.style.setProperty('--bg-gradient-start', '#000000');
                root.style.setProperty('--bg-gradient-end', '#1f1f1f');
                root.style.setProperty('--text-light', '#ffffff');
                root.style.setProperty('--primary-color', '#ffff00');
                break;
            default: // default theme
                // Keep existing theme
                break;
        }
    }

    // Get team members for multiplayer
    async getTeamMembers() {
        if (!this.isTeamsContext || !this.teamsContext.team) {
            return null;
        }

        try {
            // This would require a backend service to get team members
            // For now, return mock data
            return [
                { id: this.teamsContext.user.id, name: this.teamsContext.user.userPrincipalName }
            ];
        } catch (error) {
            console.error('Error getting team members:', error);
            return null;
        }
    }

    // Send notification to Teams channel
    async sendGameNotification(message) {
        if (!this.isTeamsContext) return;

        try {
            // This would require a bot/connector to send messages
            // For demo purposes, we'll use the SDK notification
            console.log('Game notification:', message);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    // Share game results
    async shareResults(results) {
        if (!this.isTeamsContext) return;

        try {
            const shareMessage = {
                title: 'Team Synergy Game Results',
                text: this.formatResults(results)
            };

            // In a full implementation, this would post to the channel
            console.log('Sharing results:', shareMessage);
        } catch (error) {
            console.error('Error sharing results:', error);
        }
    }

    formatResults(results) {
        let message = `Game completed!\n\n`;
        results.players.forEach((player, index) => {
            message += `${index + 1}. ${player.name}: ${player.score} points\n`;
        });
        return message;
    }

    // Get user display name
    getUserName() {
        if (this.isTeamsContext && this.teamsContext.user) {
            return this.teamsContext.user.userPrincipalName.split('@')[0];
        }
        return null;
    }

    // Check if in Teams context
    inTeams() {
        return this.isTeamsContext;
    }

    // Multiplayer mode check
    isMultiplayerMode() {
        return this.isMultiplayer;
    }
}

// Initialize Teams integration when DOM is loaded
let teamsIntegration;

document.addEventListener('DOMContentLoaded', async () => {
    teamsIntegration = new TeamsIntegration();
    const initialized = await teamsIntegration.initialize();

    if (initialized) {
        console.log('Running in Teams context');

        // Auto-fill player name from Teams
        const userName = teamsIntegration.getUserName();
        if (userName) {
            const nameInput = document.getElementById('player-name');
            if (nameInput) {
                nameInput.value = userName;
            }
        }

        // Add Teams-specific UI elements
        addTeamsFeatures();
    }
});

function addTeamsFeatures() {
    // Add share button to final score screen
    const finalButtons = document.querySelector('.final-buttons');
    if (finalButtons && !document.getElementById('share-results-btn')) {
        const shareButton = document.createElement('button');
        shareButton.id = 'share-results-btn';
        shareButton.className = 'btn-secondary';
        shareButton.textContent = 'Share Results';
        shareButton.addEventListener('click', shareResultsToTeams);
        finalButtons.insertBefore(shareButton, finalButtons.firstChild);
    }
}

function shareResultsToTeams() {
    if (teamsIntegration && teamsIntegration.inTeams()) {
        const results = {
            players: gameState.players.map(p => ({ name: p.name, score: p.score }))
        };
        teamsIntegration.shareResults(results);

        // Show confirmation
        alert('Results shared to Teams channel!');
    }
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamsIntegration;
}
