// round1.js

// Function to transition to Round 2
function goToRound2() {
    const player1Score = score.player1 + bonusPoints.player1;
    window.location.href = `round2.html?player1Score=${player1Score}`;
}

// Button and sound element references
const buttons = {
    player1: {
        green: document.getElementById('player1-green'),
        white: document.getElementById('player1-white'),
        blue: document.getElementById('player1-blue'),
        red: document.getElementById('player1-red'),
        yellow: document.getElementById('player1-yellow')
    }
};

const sounds = {
    green: document.getElementById('sound-green'),
    white: document.getElementById('sound-white'),
    blue: document.getElementById('sound-blue'),
    red: document.getElementById('sound-red'),
    yellow: document.getElementById('sound-yellow')
};

// Global variables for game state
const buttonColors = ['green', 'white', 'blue', 'red', 'yellow'];

let gameState = {
    player1: 'waiting'
};

let sequence = {
    player1: []
};

let playerSequence = {
    player1: []
};

let round = {
    player1: 1
};

let score = {
    player1: 0
};

let bonusPoints = {
    player1: 100
};

let countdownIntervals = {
    player1: null
};

// Update scoreboard function
const updateScoreBoard = (player) => {
    document.getElementById(`${player}-round`).innerText = `Round: ${round[player]}`;
    document.getElementById(`${player}-score`).innerText = `Score: ${score[player]}`;
};

// Start countdown timers for bonus points
const startBonusCountdown = (player, intervalDuration = 500) => {
    const bonusDisplay = document.getElementById(`${player}-bonus-points`);
    bonusPoints[player] = 100;
    bonusDisplay.innerText = bonusPoints[player];

    if (countdownIntervals[player]) {
        clearInterval(countdownIntervals[player]);
    }

    countdownIntervals[player] = setInterval(() => {
        if (bonusPoints[player] > 0) {
            bonusPoints[player] -= 1;
            bonusDisplay.innerText = bonusPoints[player];
        } else {
            clearInterval(countdownIntervals[player]);
        }
    }, intervalDuration);
};

// Utility function to capitalize the first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Sound playback for players
const playerSounds = {
    player1: document.getElementById('sound-player1')
};

const colorPlaybackRates = {
    green: 1,
    white: 1,
    blue: 1,
    red: 1,
    yellow: 1
};

const playSound = (player, color) => {
    const sound = playerSounds[player];
    if (sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.playbackRate = colorPlaybackRates[color];
        sound.play().catch(error => console.error('Error playing sound:', error));
    }
};

const stopSound = (color) => {
    const sound = sounds[color];
    sound.pause();
    sound.currentTime = 0;
};

const stopAllSounds = () => {
    buttonColors.forEach(color => {
        stopSound(color);
    });
};

// Function to flash a button
const flashButton = (player, color, duration = 600) => {
    const button = buttons[player][color];
    button.classList.add('active');
    button.style.filter = 'none'; // Make the button fully visible
    playSound(player, color);

    setTimeout(() => {
        button.classList.remove('active');
        button.style.filter = 'grayscale(100%) brightness(30%)'; // Return to normal state
    }, duration);
};

// Play sequence function
const playSequence = async (player) => {
    gameState[player] = 'waiting';
    console.log(`Playing sequence for ${player}: `, sequence[player]);
    for (let color of sequence[player]) {
        flashButton(player, color, 600);
        await new Promise(resolve => setTimeout(resolve, 800)); // Add a delay between flashes
    }
    gameState[player] = 'input';
    console.log(`${player} sequence played. Waiting for input.`);
};

// Handle button press by the player
const handleButtonPress = (player, color) => {
    if (gameState[player] === 'input' || gameState[player] === 'pressed') {
        buttons[player][color].classList.add('active');
        buttons[player][color].style.filter = 'none';
        playSound(player, color);

        if (gameState[player] === 'input') {
            playerSequence[player].push(color);

            if (playerSequence[player][playerSequence[player].length - 1] !== sequence[player][playerSequence[player].length - 1]) {
                showLoseMessage(player);
            } else if (playerSequence[player].length === sequence[player].length) {
                score[player] += 10;  // Increment score by 10 points for correct response
                updateScoreBoard(player); // Update the score display

                if (sequence[player].length < 7) {  // Continue to next sequence
                    setTimeout(() => startRound(player), 1000);
                } else {
                    score[player] += bonusPoints[player];
                    showEndMessage(player);
                }
            }
        }
        gameState[player] = 'pressed';
    }
};

// Function to show WINNER message
const showEndMessage = (player) => {
    const playerOverlay = document.getElementById(`${player}-overlay`);
    const playerText = document.getElementById(`${player}-overlay-text`);

    playerText.innerText = 'WINNER';

    playerOverlay.classList.remove('hidden');

    setTimeout(() => {
        goToRound2();
    }, 2000);
};

const handleButtonRelease = (player, color) => {
    if (gameState[player] === 'pressed') {
        buttons[player][color].classList.remove('active');
        buttons[player][color].style.filter = 'grayscale(100%) brightness(30%)';
        stopSound(color);
        gameState[player] = 'input';
    }
};

const resetButtons = (player) => {
    Object.keys(buttons[player]).forEach(color => {
        buttons[player][color].classList.remove('active');
        buttons[player][color].style.filter = 'grayscale(100%) brightness(30%)';
    });
};

const resetGame = (player) => {
    sequence[player] = [];
    playerSequence[player] = [];
    round[player] = 1;
    score[player] = 0;
    stopAllSounds();
    resetButtons(player);
    updateScoreBoard(player);
    setTimeout(() => startRound(player), 3000);
};

const showLoseMessage = (player) => {
    const overlay = document.getElementById(`${player}-overlay`);
    const overlayText = document.getElementById(`${player}-overlay-text`);
    overlayText.innerText = 'START AGAIN';
    overlay.classList.remove('hidden');
    
    const errorSound = document.getElementById('sound-error');
    if (errorSound) {
        errorSound.play().catch(error => console.error('Error playing error sound:', error));
    }

    let countdown = 3;
    const interval = setInterval(() => {
        overlayText.innerText = `START AGAIN\nRestarting in ${countdown}...`;
        countdown -= 1;
        if (countdown < 0) {
            clearInterval(interval);
            overlay.classList.add('hidden');
            resetGame(player);
        }
    }, 500);
};

const startRound = (player) => {
    playerSequence[player] = [];
    sequence[player].push(buttonColors[Math.floor(Math.random() * 5)]);
    playSequence(player);
};

// Attach event listeners for button press and release
Object.keys(buttons.player1).forEach(color => {
    buttons.player1[color].addEventListener('mousedown', () => handleButtonPress('player1', color));
    buttons.player1[color].addEventListener('mouseup', () => handleButtonRelease('player1', color));
    buttons.player1[color].addEventListener('touchstart', () => handleButtonPress('player1', color));
    buttons.player1[color].addEventListener('touchend', () => handleButtonRelease('player1', color));
});

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    startBonusCountdown('player1');
    showGlobalOverlay('ROUND 1: MEMORY\n\nThis year 762 applicants were received.\nIn Round 1, work against the clock to respond to the sequence of events!\nThey get increasingly complex with each round.\nPress any button to Start', () => startRound('player1'));
});

// Show overlay and start game on click or touch
const showGlobalOverlay = (message, callback) => {
    const overlay = document.getElementById('global-overlay');
    const overlayText = document.getElementById('global-overlay-text');
    overlayText.innerText = message;
    overlay.classList.remove('hidden');

    const startGame = () => {
        overlay.classList.add('hidden');
        window.removeEventListener('click', startGame);
        window.removeEventListener('touchstart', startGame);

        const backgroundMusic = document.getElementById('background-music');
        backgroundMusic.volume = 0.25;
        backgroundMusic.play();

        callback();
    };

    window.addEventListener('click', startGame);
    window.addEventListener('touchstart', startGame);
};
