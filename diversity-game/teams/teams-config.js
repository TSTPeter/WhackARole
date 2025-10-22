// Microsoft Teams Configuration Script
(function() {
    'use strict';

    // Initialize Teams SDK
    microsoftTeams.app.initialize().then(() => {
        console.log('Teams SDK initialized');

        // Enable the save button
        microsoftTeams.pages.config.registerOnSaveHandler((saveEvent) => {
            const gameMode = document.getElementById('game-mode').value;
            const numPlayers = document.getElementById('num-players').value;

            // Set configuration
            microsoftTeams.pages.config.setConfig({
                contentUrl: `https://{{YOUR_DOMAIN}}/diversity-game/index.html?mode=${gameMode}&players=${numPlayers}&teams=true`,
                websiteUrl: `https://{{YOUR_DOMAIN}}/diversity-game/index.html`,
                entityId: 'teamsynergy',
                suggestedDisplayName: 'Team Synergy'
            }).then(() => {
                saveEvent.notifySuccess();
            }).catch((error) => {
                saveEvent.notifyFailure(error);
            });
        });

        // Set valid settings
        microsoftTeams.pages.config.setValidityState(true);
    }).catch((error) => {
        console.error('Error initializing Teams SDK:', error);
    });

    // Update validity when options change
    document.getElementById('game-mode').addEventListener('change', () => {
        microsoftTeams.pages.config.setValidityState(true);
    });

    document.getElementById('num-players').addEventListener('change', () => {
        microsoftTeams.pages.config.setValidityState(true);
    });
})();
