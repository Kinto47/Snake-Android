// Gestione della navigazione tra sezioni
const playSection = document.getElementById("play-section");
const taskSection = document.getElementById("task-section");
const playBtn = document.getElementById("playBtn");
const taskBtn = document.getElementById("taskBtn");

function showSection(section) {
    if (section === "play") {
        playSection.style.display = "flex";
        taskSection.style.display = "none";
        playBtn.classList.add("active");
        taskBtn.classList.remove("active");
    } else if (section === "task") {
        playSection.style.display = "none";
        taskSection.style.display = "flex";
        playBtn.classList.remove("active");
        taskBtn.classList.add("active");
    }
}

playBtn.addEventListener("click", () => showSection("play"));
taskBtn.addEventListener("click", () => showSection("task"));

// Inizia mostrando la sezione "Play"
showSection("play");

// Logica del gioco Snake
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let canvasSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
canvasSize = Math.floor(canvasSize / box) * box; // Arrotonda per adattarsi alla griglia

canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let direction;
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
};

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let toshiBalance = localStorage.getItem("toshiBalance") || 0;
let communityJoined = localStorage.getItem("communityJoined") === "true";

document.getElementById("highScore").innerText = highScore;
document.getElementById("toshiBalance").innerText = toshiBalance;

document.addEventListener("keydown", directionControl);
document.getElementById("leftBtn").addEventListener("click", () => direction = "LEFT");
document.getElementById("upBtn").addEventListener("click", () => direction = "UP");
document.getElementById("downBtn").addEventListener("click", () => direction = "DOWN");
document.getElementById("rightBtn").addEventListener("click", () => direction = "RIGHT");

function directionControl(event) {
    if (event.keyCode == 37 && direction != "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction != "DOWN") {
        direction = "UP";
    } else if (event.keyCode == 39 && direction != "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction != "UP") {
        direction = "DOWN";
    }
}

function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x == snake[i].x && newHead.y == snake[i].y) {
            return true;
        }
    }
    return newHead.x < 0 || newHead.x >= canvasSize || newHead.y < 0 || newHead.y >= canvasSize;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } else {
        snake.pop();
    }

    const newHead = {
        x: snakeX,
        y: snakeY
    };

    if (collision(newHead, snake)) {
        clearInterval(game);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        alert(`Game Over! Score: ${score}`);
        location.reload();
    }

    snake.unshift(newHead);

    document.getElementById("score").innerText = score;
}

const game = setInterval(draw, 100);

// Gestione delle ricompense
const joinCommunityBtn = document.getElementById("joinCommunityBtn");

function updateJoinCommunityButton() {
    if (communityJoined) {
        joinCommunityBtn.disabled = true;
        joinCommunityBtn.innerText = "You have already joined the community";
    } else {
        joinCommunityBtn.disabled = false;
        joinCommunityBtn.innerText = "Join the Community and Earn 10 TOSHI";
    }
}

joinCommunityBtn.addEventListener("click", () => {
    if (!communityJoined && confirm("Do you want to join the community and earn 10 TOSHI?")) {
        // Simula l'azione di unire la community
        window.open("https://t.me/thesatoshicircle", "_blank");

        // Aumenta il saldo TOSHI
        toshiBalance = parseInt(toshiBalance) + 10;
        localStorage.setItem("toshiBalance", toshiBalance);
        document.getElementById("toshiBalance").innerText = toshiBalance;

        // Segna la task come completata
        communityJoined = true;
        localStorage.setItem("communityJoined", "true");

        // Disabilita il pulsante
        updateJoinCommunityButton();

        alert("You have earned 10 TOSHI!");
    }
});

// Aggiorna lo stato del pulsante alla caricamento della pagina
updateJoinCommunityButton();
