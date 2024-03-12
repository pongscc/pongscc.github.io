const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speedX: 3,
  speedY: 3
};

const originalBall = { ...ball };

const paddleHeight = 100;
const paddleWidth = 10;
const paddleSpeed = 5;

let paddleLeftY = (canvas.height - paddleHeight) / 2;
let paddleRightY = (canvas.height - paddleHeight) / 2;

let upPressed = false;
let downPressed = false;

let wPressed = false;
let sPressed = false;

let singlePlayer = false;
let score = 0;
let highScore = 0;
let player1Score = 0;
let player2Score = 0;
let player1Wins = 0;
let player2Wins = 0;
let gameEnded = false;

const speedIncreasePercentage = 5;
const speedIncreaseFactor = 1 + speedIncreasePercentage / 100;

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = 'white';
  context.fill();
  context.closePath();
}

function drawPaddles() {
  context.fillStyle = 'white';
  context.fillRect(0, paddleLeftY, paddleWidth, paddleHeight);
  context.fillRect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight);
}

function drawScores() {
  context.fillStyle = 'white';
  context.font = '16px Arial';
  context.fillText('Player 1: ' + player1Score + ' (Wins: ' + player1Wins + ')', 20, 20);
  context.fillText('Player 2: ' + player2Score + ' (Wins: ' + player2Wins + ')', canvas.width - 200, 20);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddles();
  drawScores();

  if (gameEnded) {
    context.fillStyle = 'white';
    context.font = '30px Arial';
    context.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
    context.fillText('Press SPACE to restart', canvas.width / 2 - 150, canvas.height / 2 + 40);
    return;
  }

  if (wPressed && paddleLeftY > 0) {
    paddleLeftY -= paddleSpeed;
  } else if (sPressed && paddleLeftY < canvas.height - paddleHeight) {
    paddleLeftY += paddleSpeed;
  }

  if (upPressed && paddleRightY > 0) {
    paddleRightY -= paddleSpeed;
  } else if (downPressed && paddleRightY < canvas.height - paddleHeight) {
    paddleRightY += paddleSpeed;
  }

  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY * (Math.random() * 0.4 + 0.8);
  }

  if (ball.x - ball.radius < paddleWidth && ball.y > paddleLeftY && ball.y < paddleLeftY + paddleHeight) {
    ball.speedX = -ball.speedX;
    score++;
  } else if (ball.x + ball.radius > canvas.width - paddleWidth && ball.y > paddleRightY && ball.y < paddleRightY + paddleHeight) {
    ball.speedX = -ball.speedX;
    score++;
  } else if (ball.x - ball.radius < 0) {
    player2Score++;
    checkWinner();
  } else if (ball.x + ball.radius > canvas.width) {
    player1Score++;
    checkWinner();
  }

  if (score > highScore) {
    highScore = score;
  }

  requestAnimationFrame(draw);
}

// Update the checkWinner function to correctly update the victory counters
// Update the checkWinner function to correctly update the victory counters
// Update the checkWinner function to correctly update the victory counters
function checkWinner() {
  if (player1Score >= 5) {
    if (ball.x < canvas.width / 2) {
      player2Wins++; // Invert winners
    } else {
      player1Wins++; // Invert winners
    }
    endGame();
  } else if (player2Score >= 5) {
    if (ball.x > canvas.width / 2) {
      player1Wins++; // Invert winners
    } else {
      player2Wins++; // Invert winners
    }
    endGame();
  }
}


function endGame() {
  gameEnded = true;
}

function resetGame() {
  ball = { ...originalBall };
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  paddleLeftY = (canvas.height - paddleHeight) / 2;
  paddleRightY = (canvas.height - paddleHeight) / 2;
  score = 0;
  gameEnded = false;
}

function keyDownHandler(e) {
  if (e.key === 'w' || e.key === 'W') {
    wPressed = true;
  } else if (e.key === 's' || e.key === 'S') {
    sPressed = true;
  } else if (e.key === 'Up' || e.key === 'ArrowUp') {
    upPressed = true;
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    downPressed = true;
  } else if (e.key === ' ' && gameEnded) {
    resetGame();
    draw();
  }
}

function keyUpHandler(e) {
  if (e.key === 'w' || e.key === 'W') {
    wPressed = false;
  } else if (e.key === 's' || e.key === 'S') {
    sPressed = false;
  } else if (e.key === 'Up' || e.key === 'ArrowUp') {
    upPressed = false;
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    downPressed = false;
  }
}

function startGame() {
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  draw();
}

startGame();

setInterval(function() {
  ball.speedX *= speedIncreaseFactor;
  ball.speedY *= speedIncreaseFactor;
}, 1000);
