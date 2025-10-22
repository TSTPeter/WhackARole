// Team Synergy - Diversity Card Game
// Game State
const gameState = {
    players: [],
    currentPlayer: 0,
    round: 1,
    totalRounds: 10,
    deck: [],
    currentTrick: [],
    leadSuit: null,
    scores: [],
    challenges: [
        "Autonomous Vehicle Safety System",
        "Smart City Traffic Management",
        "Electric Vehicle Battery Optimization",
        "Connected Car Cybersecurity",
        "Sustainable Manufacturing Process",
        "User Experience Design Innovation",
        "Supply Chain Optimization",
        "AI-Powered Quality Control",
        "Green Energy Integration",
        "Next-Gen Infotainment System"
    ],
    currentChallenge: 0
};

// Card Configuration
const SUITS = {
    SKILLS: { name: 'skills', icon: '★', color: '#4CAF50', label: 'Skills' },
    PERSPECTIVES: { name: 'perspectives', icon: '◆', color: '#2196F3', label: 'Perspectives' },
    EXPERIENCE: { name: 'experience', icon: '●', color: '#FF9800', label: 'Experience' },
    BACKGROUND: { name: 'background', icon: '■', color: '#9C27B0', label: 'Background' }
};

const CARD_ROLES = {
    skills: ['Software Engineer', 'Hardware Engineer', 'UX Designer', 'Quality Tester', 'DevOps', 'Security Expert', 'Data Scientist', 'System Architect', 'Frontend Dev', 'Backend Dev', 'Mobile Dev', 'Cloud Architect', 'Product Manager'],
    perspectives: ['Analytical Thinker', 'Creative Innovator', 'Strategic Planner', 'Practical Builder', 'Detail Oriented', 'Big Picture', 'Risk Taker', 'Methodical', 'Visionary', 'Process Driven', 'Customer Focused', 'Tech Enthusiast', 'Business Minded'],
    experience: ['Junior (1-3y)', 'Mid-level (3-5y)', 'Senior (5-10y)', 'Expert (10+y)', 'Team Lead', 'Tech Lead', 'Architect', 'Consultant', 'Mentor', 'Specialist', 'Generalist', 'Manager', 'Director'],
    background: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania', 'Startup', 'Corporate', 'Academic', 'Multilingual', 'Cross-industry', 'Research', 'Operations', 'International']
};

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    showScreen('welcome-screen');
});

function initializeEventListeners() {
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('how-to-play-btn').addEventListener('click', () => showScreen('how-to-play-screen'));
    document.getElementById('back-to-menu-btn').addEventListener('click', () => showScreen('welcome-screen'));
    document.getElementById('continue-btn').addEventListener('click', continueToNextRound);
    document.getElementById('play-again-btn').addEventListener('click', resetGame);
    document.getElementById('main-menu-btn').addEventListener('click', () => showScreen('welcome-screen'));
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Create Deck
function createDeck() {
    const deck = [];
    const suitKeys = Object.keys(SUITS);

    suitKeys.forEach(suitKey => {
        const suit = SUITS[suitKey];
        const roles = CARD_ROLES[suit.name];

        for (let value = 1; value <= 13; value++) {
            deck.push({
                suit: suit.name,
                value: value,
                role: roles[value - 1] || roles[0],
                icon: suit.icon,
                color: suit.color
            });
        }
    });

    return shuffleDeck(deck);
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Start Game
function startGame() {
    const playerName = document.getElementById('player-name').value || 'You';
    const numPlayers = parseInt(document.getElementById('num-players').value);

    // Initialize players
    gameState.players = [
        { name: playerName, hand: [], score: 0, isHuman: true, tricksWon: 0 }
    ];

    for (let i = 1; i < numPlayers; i++) {
        gameState.players.push({
            name: `Player ${i + 1}`,
            hand: [],
            score: 0,
            isHuman: false,
            tricksWon: 0
        });
    }

    gameState.currentPlayer = 0;
    gameState.round = 1;
    gameState.currentTrick = [];
    gameState.leadSuit = null;
    gameState.currentChallenge = 0;

    // Create and deal deck
    gameState.deck = createDeck();
    dealCards();

    // Update UI
    document.getElementById('player-name-display').textContent = playerName;
    updateScoreboard();
    updateChallenge();
    renderPlayerHand();
    renderOpponents();

    showScreen('game-screen');

    // Start first turn
    if (!gameState.players[gameState.currentPlayer].isHuman) {
        setTimeout(aiPlayCard, 1500);
    }
}

function dealCards() {
    const cardsPerPlayer = 10;
    let cardIndex = 0;

    for (let i = 0; i < cardsPerPlayer; i++) {
        gameState.players.forEach(player => {
            if (cardIndex < gameState.deck.length) {
                player.hand.push(gameState.deck[cardIndex]);
                cardIndex++;
            }
        });
    }

    // Sort hands by suit and value
    gameState.players.forEach(player => {
        player.hand.sort((a, b) => {
            if (a.suit !== b.suit) {
                return Object.keys(SUITS).indexOf(a.suit.toUpperCase()) - Object.keys(SUITS).indexOf(b.suit.toUpperCase());
            }
            return b.value - a.value;
        });
    });
}

// Render Functions
function renderPlayerHand() {
    const handContainer = document.getElementById('player-hand');
    handContainer.innerHTML = '';

    const player = gameState.players[0];
    player.hand.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardElement.addEventListener('click', () => playCard(0, index));

        // Check if card is playable
        if (gameState.currentPlayer === 0) {
            if (gameState.leadSuit === null || card.suit === gameState.leadSuit || !hasCardOfSuit(player.hand, gameState.leadSuit)) {
                cardElement.classList.add('playable');
            }
        }

        handContainer.appendChild(cardElement);
    });
}

function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.index = index;

    const valueDiv = document.createElement('div');
    valueDiv.className = 'card-value';
    valueDiv.textContent = card.value;

    const suitDiv = document.createElement('div');
    suitDiv.className = `card-suit ${card.suit}`;
    suitDiv.textContent = card.icon;
    suitDiv.style.color = card.color;

    const roleDiv = document.createElement('div');
    roleDiv.className = 'card-role';
    roleDiv.textContent = card.role;

    cardDiv.appendChild(valueDiv);
    cardDiv.appendChild(suitDiv);
    cardDiv.appendChild(roleDiv);

    return cardDiv;
}

function renderOpponents() {
    gameState.players.slice(1).forEach((player, index) => {
        const opponentDiv = document.getElementById(`player-${index + 1}`);
        if (opponentDiv) {
            opponentDiv.querySelector('.player-name').textContent = player.name;
            opponentDiv.querySelector('.player-score').textContent = player.score;

            const handDiv = opponentDiv.querySelector('.player-hand');
            handDiv.innerHTML = '';

            // Show only 3 card backs for visual representation
            const cardsToShow = Math.min(3, player.hand.length);
            for (let i = 0; i < cardsToShow; i++) {
                const cardBack = document.createElement('div');
                cardBack.className = 'card-back';
                handDiv.appendChild(cardBack);
            }
        }
    });
}

function renderTrickCards() {
    const trickContainer = document.getElementById('trick-cards');
    trickContainer.innerHTML = '';

    gameState.currentTrick.forEach(trick => {
        const trickCardDiv = document.createElement('div');
        trickCardDiv.className = 'trick-card';

        const playerLabel = document.createElement('div');
        playerLabel.className = 'player-label';
        playerLabel.textContent = gameState.players[trick.playerIndex].name;

        const cardElement = createCardElement(trick.card, -1);
        cardElement.style.pointerEvents = 'none';

        trickCardDiv.appendChild(playerLabel);
        trickCardDiv.appendChild(cardElement);
        trickContainer.appendChild(trickCardDiv);
    });

    updateDiversityIndicator();
}

function updateDiversityIndicator() {
    const suits = new Set(gameState.currentTrick.map(t => t.card.suit));
    const diversityContainer = document.getElementById('diversity-suits');
    diversityContainer.innerHTML = '';

    Object.values(SUITS).forEach(suit => {
        const suitDiv = document.createElement('div');
        suitDiv.className = 'suit';
        suitDiv.textContent = suit.icon;
        suitDiv.style.color = suit.color;

        if (suits.has(suit.name)) {
            suitDiv.classList.add('active');
        }

        diversityContainer.appendChild(suitDiv);
    });

    // Update diversity bonus text
    const bonusDiv = document.getElementById('diversity-bonus');
    const numSuits = suits.size;

    if (numSuits === 4) {
        bonusDiv.textContent = '🌟 Full Diversity: +10 Points!';
    } else if (numSuits === 3) {
        bonusDiv.textContent = '✨ Good Synergy: +5 Points';
    } else {
        bonusDiv.textContent = '';
    }
}

function updateScoreboard() {
    document.getElementById('current-round').textContent = gameState.round;
    document.getElementById('total-rounds').textContent = gameState.totalRounds;
    document.getElementById('player-score').textContent = gameState.players[0].score;

    gameState.players.slice(1).forEach((player, index) => {
        const opponentDiv = document.getElementById(`player-${index + 1}`);
        if (opponentDiv) {
            opponentDiv.querySelector('.player-score').textContent = player.score;
        }
    });
}

function updateChallenge() {
    const challengeText = document.getElementById('challenge-text');
    challengeText.textContent = gameState.challenges[gameState.currentChallenge];
}

// Game Logic
function playCard(playerIndex, cardIndex) {
    const player = gameState.players[playerIndex];

    // Validate it's the player's turn
    if (playerIndex !== gameState.currentPlayer) {
        return;
    }

    const card = player.hand[cardIndex];

    // Validate card can be played
    if (gameState.leadSuit !== null) {
        if (card.suit !== gameState.leadSuit && hasCardOfSuit(player.hand, gameState.leadSuit)) {
            // Must follow suit if possible
            return;
        }
    }

    // Set lead suit if first card
    if (gameState.currentTrick.length === 0) {
        gameState.leadSuit = card.suit;
    }

    // Play the card
    player.hand.splice(cardIndex, 1);
    gameState.currentTrick.push({
        playerIndex: playerIndex,
        card: card
    });

    // Update UI
    renderPlayerHand();
    renderOpponents();
    renderTrickCards();

    // Move to next player
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;

    // Check if trick is complete
    if (gameState.currentTrick.length === gameState.players.length) {
        setTimeout(evaluateTrick, 1500);
    } else {
        // AI player's turn
        if (!gameState.players[gameState.currentPlayer].isHuman) {
            setTimeout(aiPlayCard, 1000);
        }
    }
}

function hasCardOfSuit(hand, suit) {
    return hand.some(card => card.suit === suit);
}

function aiPlayCard() {
    const player = gameState.players[gameState.currentPlayer];
    let cardIndex = 0;

    // Simple AI: Try to follow suit, play highest card
    if (gameState.leadSuit !== null) {
        const suitCards = player.hand.map((card, idx) => ({ card, idx }))
            .filter(item => item.card.suit === gameState.leadSuit);

        if (suitCards.length > 0) {
            // Play highest card of suit
            suitCards.sort((a, b) => b.card.value - a.card.value);
            cardIndex = suitCards[0].idx;
        } else {
            // Play lowest card of any suit
            const sorted = player.hand.map((card, idx) => ({ card, idx }))
                .sort((a, b) => a.card.value - b.card.value);
            cardIndex = sorted[0].idx;
        }
    } else {
        // Lead with a random card
        cardIndex = Math.floor(Math.random() * player.hand.length);
    }

    playCard(gameState.currentPlayer, cardIndex);
}

function evaluateTrick() {
    // Find winner (highest card of lead suit)
    let winningPlay = gameState.currentTrick[0];

    gameState.currentTrick.forEach(play => {
        if (play.card.suit === gameState.leadSuit && play.card.value > winningPlay.card.value) {
            winningPlay = play;
        }
    });

    // Calculate points
    let points = gameState.currentTrick.reduce((sum, play) => sum + play.card.value, 0);

    // Diversity bonus
    const suits = new Set(gameState.currentTrick.map(t => t.card.suit));
    let diversityBonus = 0;
    if (suits.size === 4) {
        diversityBonus = 10;
    } else if (suits.size === 3) {
        diversityBonus = 5;
    }

    points += diversityBonus;

    // Award points to winner
    const winner = gameState.players[winningPlay.playerIndex];
    winner.score += points;
    winner.tricksWon++;

    // Show score summary
    showScoreSummary(winningPlay.playerIndex, points, diversityBonus);
}

function showScoreSummary(winnerIndex, points, diversityBonus) {
    const summary = document.getElementById('score-summary');
    const winner = gameState.players[winnerIndex];

    document.getElementById('winner-name').textContent = winner.name;
    document.getElementById('points-value').textContent = points;

    // Show team composition
    const composition = document.getElementById('team-composition');
    composition.innerHTML = '';

    const suits = new Set();
    gameState.currentTrick.forEach(play => {
        suits.add(play.card.suit);
        const suitIcon = document.createElement('span');
        suitIcon.textContent = play.card.icon;
        suitIcon.style.color = play.card.color;
        suitIcon.style.margin = '0 5px';
        composition.appendChild(suitIcon);
    });

    summary.classList.add('active');
}

function continueToNextRound() {
    // Hide score summary
    document.getElementById('score-summary').classList.remove('active');

    // Reset trick
    gameState.currentTrick = [];
    gameState.leadSuit = null;

    // Update scoreboard
    updateScoreboard();

    // Check if round is complete
    if (gameState.players[0].hand.length === 0) {
        gameState.round++;
        gameState.currentChallenge = (gameState.currentChallenge + 1) % gameState.challenges.length;

        if (gameState.round <= gameState.totalRounds) {
            // Deal new cards
            gameState.deck = createDeck();
            dealCards();
            renderPlayerHand();
            renderOpponents();
            updateChallenge();
            updateScoreboard();
        } else {
            // Game over
            showFinalScore();
            return;
        }
    }

    // Clear trick display
    document.getElementById('trick-cards').innerHTML = '';
    document.getElementById('diversity-suits').innerHTML = '';
    document.getElementById('diversity-bonus').textContent = '';

    // Continue with next player's turn
    if (!gameState.players[gameState.currentPlayer].isHuman) {
        setTimeout(aiPlayCard, 1000);
    }
}

function showFinalScore() {
    showScreen('final-score-screen');

    // Sort players by score
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

    // Show winner
    document.getElementById('winner-announcement').textContent = `${sortedPlayers[0].name} Wins!`;

    // Show all scores
    const scoresContainer = document.getElementById('final-scores');
    scoresContainer.innerHTML = '';

    sortedPlayers.forEach((player, index) => {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'player-final-score';
        if (index === 0) scoreDiv.classList.add('winner');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${index + 1}. ${player.name}`;

        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = `${player.score} points`;

        scoreDiv.appendChild(nameSpan);
        scoreDiv.appendChild(scoreSpan);
        scoresContainer.appendChild(scoreDiv);
    });

    // Show diversity insights
    showDiversityInsights();
}

function showDiversityInsights() {
    const insightsContainer = document.getElementById('diversity-insights');
    insightsContainer.innerHTML = '';

    const insights = [
        {
            title: "Diverse Teams Win More",
            text: `Teams with all 4 diversity dimensions earned +10 bonus points, demonstrating how comprehensive diversity leads to better outcomes.`
        },
        {
            title: "Synergy Creates Value",
            text: `Teams with 3 different perspectives still gained +5 points, showing that even partial diversity provides benefits.`
        },
        {
            title: "Real-World Application",
            text: `In engineering, diverse teams bring varied problem-solving approaches, reducing blind spots and improving innovation.`
        },
        {
            title: "Complementary Strengths",
            text: `Just as in the game, real teams benefit when members have different skills, experiences, and perspectives that complement each other.`
        }
    ];

    insights.forEach(insight => {
        const insightDiv = document.createElement('div');
        insightDiv.className = 'insight-item';

        const title = document.createElement('strong');
        title.textContent = insight.title + ': ';

        const text = document.createTextNode(insight.text);

        insightDiv.appendChild(title);
        insightDiv.appendChild(text);
        insightsContainer.appendChild(insightDiv);
    });
}

function resetGame() {
    gameState.players = [];
    gameState.currentPlayer = 0;
    gameState.round = 1;
    gameState.deck = [];
    gameState.currentTrick = [];
    gameState.leadSuit = null;
    gameState.currentChallenge = 0;

    showScreen('welcome-screen');
}

// Utility Functions
function formatCardName(card) {
    const suitData = Object.values(SUITS).find(s => s.name === card.suit);
    return `${card.value} of ${suitData.label}`;
}

// Export for Teams integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameState, startGame, playCard };
}
