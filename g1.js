const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

const paddleHeight = 100;
const paddleWidth = 10;
const maxPaddleSpeed = 5;
let paddleSpeed = maxPaddleSpeed; // Initialize paddle speed

let paddleLeftY = (canvas.height - paddleHeight) / 2;
let paddleRightY = (canvas.height - paddleHeight) / 2;

let upPressed = false;
let downPressed = false;

let gameEnded = false;

let player1Wins = 0; // Track player 1 wins
let botWins = 0; // Track bot wins

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speedX: 3,
  speedY: 3
};

const originalBall = { ...ball };

let player1Score = 0;
let botScore = 0;

let speedIncreaseInterval; // Track the speed increase interval

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
  context.fillText('Player Wins: ' + player1Wins, 20, 20); // Display player 1 wins
  context.fillText('Bot Wins: ' + botWins, canvas.width - 150, 20); // Display bot wins
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
    clearInterval(speedIncreaseInterval); // Stop the speed increase interval
    return;
  }

  if (upPressed && paddleLeftY > 0) {
    paddleLeftY -= maxPaddleSpeed;
  } else if (downPressed && paddleLeftY < canvas.height - paddleHeight) {
    paddleLeftY += maxPaddleSpeed;
  }

  updateBotPaddle();

  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY * (Math.random() * 0.4 + 0.8);
  }

  if (ball.x - ball.radius < paddleWidth && ball.y > paddleLeftY && ball.y < paddleLeftY + paddleHeight) {
    ball.speedX = -ball.speedX;
    player1Score++;
  } else if (ball.x + ball.radius > canvas.width - paddleWidth && ball.y > paddleRightY && ball.y < paddleRightY + paddleHeight) {
    ball.speedX = -ball.speedX;
    botScore++;
  } else if (ball.x - ball.radius < 0) {
    endGame();
    botWins++; // Increment bot wins
  } else if (ball.x + ball.radius > canvas.width) {
    endGame();
    player1Wins++; // Increment player 1 wins
  }

  requestAnimationFrame(draw);
}

function endGame() {
  gameEnded = true;
  player1Score = 0; // Reset player 1 score
  botScore = 0; // Reset bot score
  ball.speedX = originalBall.speedX; // Reset ball speed
  ball.speedY = originalBall.speedY; // Reset ball speed
}

function resetGame() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  player1Score = 0;
  botScore = 0;
  paddleLeftY = (canvas.height - paddleHeight) / 2;
  paddleRightY = (canvas.height - paddleHeight) / 2;
  gameEnded = false;
  clearInterval(speedIncreaseInterval); // Reset speed increase interval
}

function keyDownHandler(e) {
  if (e.key === 'w') {
    upPressed = true;
  } else if (e.key === 's') {
    downPressed = true;
  } else if (e.key === ' ' && gameEnded) {
    resetGame();
    draw();
    ball.speedX = originalBall.speedX; // Reset ball speed
    ball.speedY = originalBall.speedY; // Reset ball speed
    speedIncreaseInterval = setInterval(function() { // Start the speed increase interval
      ball.speedX *= speedIncreaseFactor;
      ball.speedY *= speedIncreaseFactor;
    }, 1000);
  }
}

function keyUpHandler(e) {
  if (e.key === 'w') {
    upPressed = false;
  } else if (e.key === 's') {
    downPressed = false;
  }
}

function startGame() {
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  draw();
}

function updateBotPaddle() {
  // Move bot paddle to align with the ball's y-coordinate
  if (ball.y < paddleRightY + paddleHeight / 2) {
    paddleRightY -= maxPaddleSpeed;
  } else if (ball.y > paddleRightY + paddleHeight / 2) {
    paddleRightY += maxPaddleSpeed;
  }
}

startGame();
