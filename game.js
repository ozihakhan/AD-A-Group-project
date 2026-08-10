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
}
// Collision Detection Logic
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Background & Environment Drawing
function drawWorld() {
    ctx.fillStyle = "#75c9ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#49a94d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawCloud(42, 85 - (sceneryOffset * 0.15) % 180);
    drawCloud(285, 185 - (sceneryOffset * 0.12) % 220);

    ctx.fillStyle = "#e8d9ac";
    ctx.fillRect(trackLeft - 8, 0, trackRight - trackLeft + 16, canvas.height);

    ctx.fillStyle = "#4b5059";
    ctx.fillRect(trackLeft, 0, trackRight - trackLeft, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(trackLeft + 4, 0, 4, canvas.height);
    ctx.fillRect(trackRight - 8, 0, 4, canvas.height);

    ctx.fillStyle = "#ffd84a";
    for (let y = -50; y < canvas.height; y += 90) {
        let lineY = y + (roadOffset % 90);
        ctx.fillRect(canvas.width / 2 - 4, lineY, 8, 42);
    }

    drawScenery();
}

function drawCloud(x, y) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.arc(x + 18, y - 8, 18, 0, Math.PI * 2);
    ctx.arc(x + 38, y, 14, 0, Math.PI * 2);
    ctx.fill();
}

function drawScenery() {
    for (let y = -180; y < canvas.height + 120; y += 180) {
        const itemY = y + (sceneryOffset % 180);
        drawTree(22, itemY + 25, 0.85);
        drawTree(375, itemY + 80, 0.8);
        drawHouse(8, itemY + 110, "#f7a24d", "#d85d5d");
        drawHouse(347, itemY + 145, "#84b6e8", "#d85d5d");
    }
}

function drawTree(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#704221";
    ctx.fillRect(-4, 15, 8, 24);
    ctx.fillStyle = "#18733a";
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.arc(-12, 11, 14, 0, Math.PI * 2);
    ctx.arc(12, 11, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#31984e";
    ctx.beginPath();
    ctx.arc(-6, -5, 9, 0, Math.PI * 2);
    ctx.arc(8, 4, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawHouse(x, y, wallColor, roofColor) {
    ctx.fillStyle = wallColor;
    ctx.fillRect(x, y, 40, 35);
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x + 20, y - 22);
    ctx.lineTo(x + 45, y);
    ctx.fill();
    ctx.fillStyle = "#744229";
    ctx.fillRect(x + 15, y + 18, 10, 17);
    ctx.fillStyle = "#c7f4ff";
    ctx.fillRect(x + 4, y + 10, 8, 8);
    ctx.fillRect(x + 28, y + 10, 8, 8);
}

// Vehicle & Rider Drawing Logic
function drawBike(vehicle, isPlayer) {
    const x = vehicle.x, y = vehicle.y, w = vehicle.width, h = vehicle.height;
    ctx.save();

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 5, w / 2, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#151515";
    ctx.beginPath();
    ctx.arc(x + 9, y + h - 10, 9, 0, Math.PI * 2);
    ctx.arc(x + w - 9, y + h - 10, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#b7c2cc";
    ctx.beginPath();
    ctx.arc(x + 9, y + h - 10, 3, 0, Math.PI * 2);
    ctx.arc(x + w - 9, y + h - 10, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = vehicle.color;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + h - 18);
    ctx.lineTo(x + w - 8, y + h - 18);
    ctx.lineTo(x + w - 13, y + 27);
    ctx.lineTo(x + 12, y + 27);
    ctx.fill();

    ctx.fillStyle = "#181818";
    ctx.fillRect(x + 9, y + 27, w - 18, 8);

    ctx.fillStyle = isPlayer ? "#214c8d" : "#6b235e";
    ctx.fillRect(x + 12, y + 14, w - 24, 18);

    ctx.fillStyle = isPlayer ? "#f2f6ff" : "#ffe34c";
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 10, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#243447";
    ctx.fillRect(x + w / 2, y + 8, 9, 4);

    ctx.strokeStyle = "#1b1b1b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + w - 11, y + 32);
    ctx.lineTo(x + w + 3, y + 24);
    ctx.stroke();

    if (isPlayer) {
        ctx.fillStyle = "#fff4a5";
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h - 23, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}