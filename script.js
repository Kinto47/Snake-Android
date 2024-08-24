// Seleziona gli elementi HTML
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dimensioni della griglia e del canvas
const box = 32;
const canvasSize = 512; // 16x16 griglia
canvas.width = canvasSize;
canvas.height = canvasSize;

// Inizializzazione del serpente e dello stato del gioco
let snake = [];
snake[0] = { x: 8 * box, y: 8 * box };

let direction = null;
let food = spawnFood();

let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let toshiBalance = parseInt(localStorage.getItem("toshiBalance")) || 0;
let communityJoined = localStorage.getItem("communityJoined") === "true";

// Aggiorna i valori della UI con i dati salvati
document.getElementById("highScore").innerText = highScore;
document.getElementById("toshiBalance").innerText = toshiBalance;

// Event listener per il controllo del movimento del serpente
document.addEventListener("keydown", setDirection);
document.getElementById("leftBtn").addEventListener("click", () => direction = "LEFT");
document.getElementById("upBtn").addEventListener("click", () => direction = "UP");
document.getElementById("downBtn").addEventListener("click", () => direction = "DOWN");
document.getElementById("rightBtn").addEventListener("click", () => direction = "RIGHT");

// Funzione per impostare la direzione del serpente
function setDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    if (key === 38 && direction !== "DOWN") direction = "UP";
    if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Funzione per generare una nuova posizione per il cibo
function spawnFood() {
    return {
        x: Math.floor(Math.random() * 16) * box,
        y: Math.floor(Math.random() * 16) * box
    };
}

// Funzione per disegnare il serpente
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00ff00" : "#ffffff";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}

// Funzione per disegnare il cibo
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

// Funzione per controllare le collisioni del serpente
function checkCollision(newHead) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    return newHead.x < 0 || newHead.x >= canvasSize || newHead.y < 0 || newHead.y >= canvasSize;
}

// Funzione di aggiornamento del gioco
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    const newHead = { x: snakeX, y: snakeY };

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = spawnFood();
    } else {
        snake.pop();
    }

    if (checkCollision(newHead)) {
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

// Funzione per aggiornare il pulsante "Join Community"
function updateJoinCommunityButton() {
    const joinCommunityBtn = document.getElementById("joinCommunityBtn");
    if (communityJoined) {
        joinCommunityBtn.disabled = true;
        joinCommunityBtn.innerText = "You have already joined the community";
    } else {
        joinCommunityBtn.disabled = false;
        joinCommunityBtn.innerText = "Join the Community and Earn 10 TOSHI";
    }
}

// Aggiorna il pulsante al caricamento della pagina
updateJoinCommunityButton();

// Event listener per la task "Join Community"
document.getElementById("joinCommunityBtn").addEventListener("click", () => {
    if (!communityJoined && confirm("Do you want to join the community and earn 10 TOSHI?")) {
        // Simula l'azione di unire la community
        window.open("https://t.me/thesatoshicircle", "_blank");

        // Aumenta il saldo TOSHI
        toshiBalance += 10;
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

// Gestione della navigazione tra le sezioni
const playBtn = document.getElementById("playBtn");
const taskBtn = document.getElementById("taskBtn");

playBtn.addEventListener("click", () => {
    document.getElementById("play-section").style.display = "flex";
    document.getElementById("task-section").style.display = "none";
    playBtn.classList.add("active");
    taskBtn.classList.remove("active");
});

taskBtn.addEventListener("click", () => {
    document.getElementById("play-section").style.display = "none";
    document.getElementById("task-section").style.display = "flex";
    taskBtn.classList.add("active");
    playBtn.classList.remove("active");
});

// Avvia l'aggiornamento del gioco a intervalli regolari
setInterval(update, 100);

// Verifica che window.Telegram.WebApp sia disponibile
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();

};
