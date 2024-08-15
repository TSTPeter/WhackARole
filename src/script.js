let playerReady = false;
let isMusicPlaying = false;

window.onload = () => {
    // Show the pop-up message on load
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.addEventListener('click', handleFirstClick);
};

function handleFirstClick() {
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.style.display = 'none'; // Hide the pop-up message

    // Start the background music
    playBackgroundMusic();

    // Prepare for the second click to start the game
    document.addEventListener('click', startGame);
    document.addEventListener('keydown', startGame);
    document.addEventListener('touchstart', startGame);
}

function startGame() {
    if (!playerReady) {
        playerReady = true;
        playButtonSound();
        countdownAndStart();

        // Remove the event listeners after the game starts
        document.removeEventListener('click', startGame);
        document.removeEventListener('keydown', startGame);
        document.removeEventListener('touchstart', startGame);
    }
}

function playBackgroundMusic() {
    if (!isMusicPlaying) {
        const backgroundMusic = document.getElementById('background-music');
        if (backgroundMusic) {
            backgroundMusic.play().then(() => {
                isMusicPlaying = true;
                console.log('Background music started');
            }).catch((error) => {
                console.error('Error playing background music:', error);
            });
        } else {
            console.error('Background music element not found');
        }
    }
}

function countdownAndStart() {
    let countdown = 3;
    const countdownElement = document.createElement('div');
    countdownElement.style.position = 'absolute';
    countdownElement.style.top = '50%';
    countdownElement.style.left = '50%';
    countdownElement.style.transform = 'translate(-50%, -50%)';
    countdownElement.style.fontSize = '4rem';
    countdownElement.style.color = 'white';
    countdownElement.style.backgroundColor = 'black';
    countdownElement.style.padding = '20px';
    countdownElement.style.border = '2px solid white';
    countdownElement.style.borderRadius = '10px';
    countdownElement.style.zIndex = '1000';
    countdownElement.id = 'countdown';
    document.body.appendChild(countdownElement);

    const interval = setInterval(() => {
        countdownElement.innerText = countdown;
        countdown -= 1;

        if (countdown < 0) {
            clearInterval(interval);
            document.body.removeChild(countdownElement);
            window.location.href = 'ROUND1.HTML';
        }
    }, 1000);
}

function playButtonSound() {
    const buttonSound = document.getElementById('button-sound');
    if (buttonSound) {
        buttonSound.currentTime = 0;
        buttonSound.play().then(() => {
            console.log('Button sound played');
        }).catch((error) => {
            console.error('Error playing button sound:', error);
        });
    } else {
        console.error('Button sound element not found');
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
}

gameLoop();
