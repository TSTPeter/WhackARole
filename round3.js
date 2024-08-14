let score = {
    player1: 0
};

let gameState = {
    player1: 'input'
};

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
    error: document.getElementById('sound-error')
};

const playerSounds = {
    player1: document.getElementById('sound-player1')
};

const buttonColors = ['green', 'white', 'blue', 'red', 'yellow'];

let countdownIntervals = {
    player1: null
};

let timers = {
    player1: 30
};

const updateScoreBoard = (player) => {
    document.getElementById(`${player}-score`).innerText = `Score: ${score[player]}`;
};

const startRound = (player) => {
    gameState[player] = 'input';
    startCountdown(player);
    lightUpButtonsRandomly(player);
};

const startCountdown = (player) => {
    const timerDisplay = document.getElementById(`${player}-timer`);
    timers[player] = 30; // 30 seconds countdown
    timerDisplay.innerText = timers[player];

    countdownIntervals[player] = setInterval(() => {
        if (timers[player] > 0) {
            timers[player] -= 1;
            timerDisplay.innerText = timers[player];
        } else {
            clearInterval(countdownIntervals[player]);
            endGame();
        }
    }, 1000);
};

const lightUpButtonsRandomly = (player) => {
    if (gameState[player] !== 'input') return;

    // Random interval between 200ms and 800ms for the next light-up
    const interval = Math.random() * 400 + 100;
    setTimeout(() => {
        if (gameState[player] !== 'input') return;

        const color = buttonColors[Math.floor(Math.random() * buttonColors.length)];
        flashButton(player, color);

        // Recursively call to light up the next button
        lightUpButtonsRandomly(player);
    }, interval);
};

const flashButton = (player, color) => {
    buttons[player][color].classList.add('active');
    buttons[player][color].style.filter = 'none';

    // Ensure the button remains active until clicked
};

const handleButtonPress = (player, color) => {
    if (gameState[player] === 'input') {
        if (buttons[player][color].classList.contains('active')) {
            // Correct button press
            score[player] += 1;
            buttons[player][color].classList.remove('active');
            buttons[player][color].style.filter = 'grayscale(100%) brightness(30%)';

            // Play player-specific sound
            const sound = playerSounds[player];
            if (sound) {
                sound.pause();
                sound.currentTime = 0;
                sound.play().catch(error => console.error('Error playing sound:', error));
            }
        } else {
            // Incorrect button press
            score[player] -= 20;
            sounds.error.play();
        }
        updateScoreBoard(player);
    }
};

const endGame = () => {
    gameState.player1 = 'finished';

    // Stop all timers
    clearInterval(countdownIntervals.player1);

    // Determine final scores and declare winner
    goToFinalScoreboard();
};

const goToFinalScoreboard = () => {
    const player1Score = score.player1;
    window.location.href = `finalScoreboard.html?player1Score=${player1Score}`;
};

// Attach event listeners for button press
Object.keys(buttons.player1).forEach(color => {
    buttons.player1[color].addEventListener('mousedown', () => handleButtonPress('player1', color));
    buttons.player1[color].addEventListener('touchstart', () => handleButtonPress('player1', color)); // For mobile devices
});

let gamepadIndices = { player1: undefined };
let previousButtonStates = { player1: [] };

// Gamepad connection event
window.addEventListener('gamepadconnected', (event) => {
    console.log('Gamepad connected:', event.gamepad);
    if (gamepadIndices.player1 === undefined) {
        gamepadIndices.player1 = event.gamepad.index;
        previousButtonStates.player1 = new Array(event.gamepad.buttons.length).fill(false);
    }
    pollGamepad();
});

// Gamepad disconnection event
window.addEventListener('gamepaddisconnected', (event) => {
    console.log('Gamepad disconnected:', event.gamepad);
    if (gamepadIndices.player1 === event.gamepad.index) {
        gamepadIndices.player1 = undefined;
    }
});

// Poll gamepad states
const pollGamepad = () => {
    const gamepads = navigator.getGamepads();
    const gamepadIndex = gamepadIndices.player1;
    if (gamepadIndex !== undefined && gamepads[gamepadIndex]) {
        const gamepad = gamepads[gamepadIndex];
        gamepad.buttons.forEach((button, index) => {
            if (index < buttonColors.length) {
                const color = buttonColors[index];
                if (button.pressed && !previousButtonStates.player1[index]) {
                    handleButtonPress('player1', color); // Implement your button press logic here
                }
                previousButtonStates.player1[index] = button.pressed;
            }
        });
    }
    requestAnimationFrame(pollGamepad);
};

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve scores from Round 2
    const params = new URLSearchParams(window.location.search);
    score.player1 = parseInt(params.get('player1Score'), 10) || 0;

    updateScoreBoard('player1');

    // Start the game overlay and initialization
    showGlobalOverlay('ROUND 3: WHACK-A-JOB\n\nIt can get a bit crazy out there.\n\nSometimes it all comes fast and furious.\nLike this final, TIMED round.\n1 point for a hit.\nBut mistakes cost 20.\n\nBecause ya know, people matter.\nClick a key to get 30 furious seconds.', () => 
    {
        startRound('player1');
    });
});

const showGlobalOverlay = (message, callback) => {
    const overlay = document.getElementById('global-overlay');
    const overlayText = document.getElementById('global-overlay-text');
    overlayText.innerText = message;
    overlay.classList.remove('hidden');

    const startGame = () => {
        overlay.classList.add('hidden');
        window.removeEventListener('keydown', startGame);
        window.removeEventListener('click', startGame);
        window.removeEventListener('touchstart', startGame);

        // Play background music
        const backgroundMusic = document.getElementById('background-music');
        backgroundMusic.volume = 0.25;
        backgroundMusic.play();

        callback();
    };

    window.addEventListener('keydown', startGame);
    window.addEventListener('click', startGame);
    window.addEventListener('touchstart', startGame);
};