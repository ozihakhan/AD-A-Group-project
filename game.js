// Setup Canvas & UI Elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startMenu = document.getElementById("startMenu");
const gameOverMenu = document.getElementById("gameOverMenu");
const scoreVal = document.getElementById("scoreVal");
const speedVal = document.getElementById("speedVal");
const finalScore = document.getElementById("finalScore");

const trackLeft = 60;
const trackRight = canvas.width - 60;

// Game Variables
let gameActive = false;
let score = 0;
let gameSpeed = 5;
let keys = {};
let roadOffset = 0;
let sceneryOffset = 0;

let bike = {
    x: canvas.width / 2 - 18,
    y: canvas.height - 110,
    width: 36,
    height: 70,
    color: "#18d9ff"
};

let enemies = [];

// Event Listeners for Controls
window.addEventListener("keydown", (event) => { keys[event.key] = true; });
window.addEventListener("keyup", (event) => { keys[event.key] = false; });

// Start & Reset Game
function startGame() {
    startMenu.classList.add("hidden");
    gameOverMenu.classList.add("hidden");

    score = 0;
    gameSpeed = 5;
    roadOffset = 0;
    sceneryOffset = 0;
    bike.x = canvas.width / 2 - 18;

    enemies = [
        createEnemy(-120, "#ff3b3b"),
        createEnemy(-430, "#ff9d00")
    ];

    gameActive = true;
    updateScoreUI();
    requestAnimationFrame(gameLoop);
}

function createEnemy(y, color) {
    return {
        x: getRandomX(),
        y: y,
        width: 36,
        height: 70,
        color: color
    };
}

function getRandomX() {
    return trackLeft + 10 + Math.random() * (trackRight - trackLeft - 56);
}

function updateScoreUI() {
    scoreVal.innerText = score;
    speedVal.innerText = (gameSpeed / 5).toFixed(1) + "x";
}

function moveBike() {
    if ((keys["a"] || keys["A"] || keys["ArrowLeft"]) && bike.x > trackLeft + 5) {
        bike.x -= 6;
    }
    if ((keys["d"] || keys["D"] || keys["ArrowRight"]) && bike.x < trackRight - bike.width - 5) {
        bike.x += 6;
    }
}

// Main Game Loop Logic
function gameLoop() {
    if (!gameActive) return;

    roadOffset += gameSpeed;
    sceneryOffset += gameSpeed * 0.45;

    drawWorld();
    moveBike();
    drawBike(bike, true);

    enemies.forEach((enemy) => {
        enemy.y += gameSpeed;

        if (enemy.y > canvas.height + 80) {
            enemy.y = -100 - Math.random() * 200;
            enemy.x = getRandomX();
            score++;

            if (score % 5 === 0) gameSpeed += 0.5;

            updateScoreUI();
        }

        drawBike(enemy, false);

        if (checkCollision(bike, enemy)) {
            triggerGameOver();
        }
    });

    requestAnimationFrame(gameLoop);
}

function triggerGameOver() {
    gameActive = false;
    finalScore.innerText = "Final Score: " + score;
    gameOverMenu.classList.remove("hidden");
}git