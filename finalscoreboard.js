let scores = JSON.parse(localStorage.getItem('highscores')) || [
    { initials: "KAM", score: 219 },
    { initials: "NAM", score: 190 },
    { initials: "CCC", score: 100 },
    { initials: "DDD", score: 75 },
    { initials: "EEE", score: 50 }
];

let player1Score = parseInt(new URLSearchParams(window.location.search).get('player1Score'), 10);
let newScores = [{ initials: "", score: player1Score, player: "Player" }];
let currentPlayerIndex = 0;

// Initialize the scoreboard
document.addEventListener('DOMContentLoaded', () => {
    scores = scores.concat(newScores).sort((a, b) => b.score - a.score).slice(0, 5);
    displayScores();
    saveScoresToLocalStorage();

    currentPlayerIndex = scores.findIndex(score => score.initials === "" && score.score === newScores[0].score);
    if (currentPlayerIndex !== -1) {
        document.getElementById('initials-input').classList.remove('hidden');
        document.getElementById('initials-prompt').innerText = "Enter your initials:";
    } else {
        showRestartOverlay();
    }

    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.volume = 0.5;
    backgroundMusic.play().catch(error => console.error('Error playing background music:', error));
});

const displayScores = () => {
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = "";
    scores.forEach((entry, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'score-list-item';
        listItem.innerHTML = `${index + 1}. ${entry.initials || "___"} - ${entry.score}`;
        scoreList.appendChild(listItem);
    });
};

const submitInitials = () => {
    const initials = document.getElementById('player-initials').value.toUpperCase();
    if (initials.length === 3) {
        scores[currentPlayerIndex].initials = initials;
        displayScores();
        saveScoresToLocalStorage();
        document.getElementById('initials-input').classList.add('hidden');
        showRestartOverlay();
    }
};

const showRestartOverlay = () => {
    document.getElementById('restart-overlay').classList.remove('hidden');
    window.addEventListener('keydown', restartGame);
    window.addEventListener('click', restartGame);
    window.addEventListener('touchstart', restartGame);
};

const restartGame = () => {
    window.location.href = "index.html";
};

const saveScoresToLocalStorage = () => {
    localStorage.setItem('highscores', JSON.stringify(scores));
};
