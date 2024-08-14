let score = {
    player1: 0
};

let reactionCounter = {
    player1: 0
};

let totalCardsResponded = 0;

const buttons = {
    player1: {
        green: document.getElementById('player1-green'),
        white: document.getElementById('player1-white'),
        blue: document.getElementById('player1-blue'),
        red: document.getElementById('player1-red'),
        yellow: document.getElementById('player1-yellow')
    }
};

const BONUS_INTERVAL = 500; // 500 milliseconds for a faster countdown

// Define the sounds associated with each button color
const sounds = {
    green: document.getElementById('sound-green'),
    white: document.getElementById('sound-white'),
    blue: document.getElementById('sound-blue'),
    red: document.getElementById('sound-red'),
    yellow: document.getElementById('sound-yellow'),
    error: document.getElementById('sound-error')
};

const buttonColors = ['green', 'white', 'blue', 'red', 'yellow'];

let gameState = {
    player1: 'waiting'
};

let round = {
    player1: 2
};

let bonusPoints = {
    player1: 100
};

let countdownIntervals = {
    player1: null
};

// Function to update the scoreboard
const updateScoreBoard = (player) => {
    document.getElementById(`${player}-score`).innerText = `Score: ${score[player]}`;
    checkWinCondition(player);
};

// Function to check if the win condition is met
const checkWinCondition = () => {
    if (totalCardsResponded >= 40) {
        endGame();
    }
};

// Function to start the round
const startRound = (player) => {
    gameState[player] = 'input';
    reactionCounter[player] = 0;
    nextColor(player);
};

// Function to move to the next color
const nextColor = (player) => {
    if (gameState[player] === 'input') {
        const color = buttonColors[Math.floor(Math.random() * buttonColors.length)];
        flashButton(player, color);
    }
};

// Function to highlight the button and play sound
const flashButton = (player, color) => {
    buttons[player][color].classList.add('active');
    buttons[player][color].style.filter = 'none'; // Make the button fully visible
    playSound([color]); // Play the corresponding sound
};

// Function to play the sound associated with a color
const playSound = (color) => {
    const sound = sounds[color];
    if (sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.play().catch(error => console.error('Error playing sound:', error));
    } else {
        console.error(`Sound for color ${color} not found`);
    }
};

// Function to handle button press
const handleButtonPress = (player, color) => {
    if (gameState[player] === 'input') {
        // Correct button press
        if (buttons[player][color].classList.contains('active')) {
            score[player] += 2; // Increment score by 2 points for correct response
            reactionCounter[player] += 1;
            buttons[player][color].classList.remove('active'); // Deactivate button
            buttons[player][color].style.filter = 'grayscale(100%) brightness(30%)'; // Grey out button

            totalCardsResponded += 1; // Increment total cards responded
            updateScoreBoard(player);
            nextColor(player); // Move to the next color
        } else {
            // Incorrect button press
            score[player] -= 10; // Decrement score by 10 points for incorrect response
            totalCardsResponded += 1; // Increment total cards responded
            updateScoreBoard(player);
            sounds.error.play().catch(error => console.error('Error playing error sound:', error)); // Play error sound
        }
    }
};

// Function to start the bonus countdown
const startBonusCountdown = (player) => {
    const bonusDisplay = document.getElementById(`${player}-bonus-points`);
    bonusPoints[player] = 100; // Reset bonus points at the start of the round
    bonusDisplay.innerText = bonusPoints[player];

    // Clear any existing interval for the player
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
    }, BONUS_INTERVAL);
};

// Function to finish the round
const finishRound = (player) => {
    gameState[player] = 'finished';
    if (gameState['player1'] === 'finished') {
        goToRound3();
    }
};

// Function to end the game
const endGame = () => {
    gameState.player1 = 'finished';

    // Transition to Round 3 after 2 seconds
    setTimeout(() => {
        goToRound3();
    }, 1000);
};

// Function to go to Round 3
const goToRound3 = () => {
    const player1Score = score.player1;
    window.location.href = `round3.html?player1Score=${player1Score}`;
};

// Attach event listeners for button press
Object.keys(buttons.player1).forEach(color => {
    buttons.player1[color].addEventListener('mousedown', () => handleButtonPress('player1', color));
    buttons.player1[color].addEventListener('touchstart', () => handleButtonPress('player1', color)); // For mobile devices
});

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const player1Score = parseInt(params.get('player1Score'), 10) || 0;

    score.player1 = player1Score;

    updateScoreBoard('player1');

    startBonusCountdown('player1');

    showGlobalOverlay('ROUND 2: A NUMBERS GAME\n\nThis year we ran 150 interviews.\n\n150 is a big number.\nYOU now face 150 applicants.\nTwo points for a correct hit.\nBut an error costs you 10 points.\nReady? Hit a key.', () => {
        startRound('player1');
    });
});

// Function to show a global overlay message
const showGlobalOverlay = (message, callback) => {
    const overlay = document.getElementById('global-overlay');
    const overlayText = document.getElementById('global-overlay-text');
    overlayText.innerText = message;
    overlay.classList.remove('hidden');

    // Define the event handler for starting the game
    const startGame = () => {
        overlay.classList.add('hidden');
        window.removeEventListener('click', startGame);
        window.removeEventListener('touchstart', startGame);

        // Play background music
        const backgroundMusic = document.getElementById('background-music');
        backgroundMusic.volume = 0.25; // Set volume to 25%
        backgroundMusic.play();

        callback(); // Call the callback to start the game logic
    };

    window.addEventListener('click', startGame);
    window.addEventListener('touchstart', startGame);
};
