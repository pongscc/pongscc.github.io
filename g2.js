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

let touchStartLeftY = 0;
let touchStartRightY = 0;
let touchCurrentLeftY = 0;
let touchCurrentRightY = 0;

let touchMoveLeft = false;
let touchMoveRight = false;

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

// Function to draw the ball
function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = 'white';
  context.fill();
  context.closePath();
}

// Function to draw the paddles
function drawPaddles() {
  context.fillStyle = 'white';
  context.fillRect(0, paddleLeftY, paddleWidth, paddleHeight);
  context.fillRect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight);
}

// Function to draw the scores
function drawScores() {
  context.fillStyle = 'white';
  context.font = '16px Arial';
  context.fillText('Player 1: ' + player1Score + ' (Wins: ' + player1Wins + ')', 20, 20);
  context.fillText('Player 2: ' + player2Score + ' (Wins: ' + player2Wins + ')', canvas.width - 200, 20);
}

// Function to draw the game elements
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddles();
  drawScores();

  if (gameEnded) {
    context.fillStyle = 'white';
    context.font = '30px Arial';
    context.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
    context.fillText('Click anywhere to restart', canvas.width / 2 - 150, canvas.height / 2 + 40);
    return;
  }

  // Moving the paddles based on touch events
  if (touchMoveLeft) {
    if (touchCurrentLeftY >= 0 && touchCurrentLeftY <= canvas.height - paddleHeight) {
      paddleLeftY = touchCurrentLeftY;
    }
  }

  if (touchMoveRight) {
    if (touchCurrentRightY >= 0 && touchCurrentRightY <= canvas.height - paddleHeight) {
      paddleRightY = touchCurrentRightY;
    }
  }

  // Moving the ball
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Bouncing off the top and bottom walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY * (Math.random() * 0.4 + 0.8);
  }

  // Paddle collisions and scoring
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

  // Updating the high score
  if (score > highScore) {
    highScore = score;
  }

  // Requesting animation frame for continuous rendering
  requestAnimationFrame(draw);
}

// Checking for winner and ending the game
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

// Ending the game
function endGame() {
  gameEnded = true;
}

// Resetting the game
function resetGame() {
  ball = { ...originalBall };
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  paddleLeftY = (canvas.height - paddleHeight) / 2;
  paddleRightY = (canvas.height - paddleHeight) / 2;
  score = 0;
  gameEnded = false;
}

// Starting the game and adding event listeners
function startGame() {
  draw();
}

// Handling touch events for paddle movement
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  if (e.targetTouches.length === 1) {
    const touchPositionLeft = e.targetTouches[0].clientY - canvas.getBoundingClientRect().top;
    const touchPositionRight = e.targetTouches[0].clientY - canvas.getBoundingClientRect().top;
    touchStartLeftY = touchPositionLeft - paddleLeftY;
    touchStartRightY = touchPositionRight - paddleRightY;
    if (e.targetTouches[0].clientX < canvas.width / 2) {
      touchMoveLeft = true;
    } else {
      touchMoveRight = true;
    }
  }
});

canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  if (e.targetTouches.length === 1) {
    const touchPositionLeft = e.targetTouches[0].clientY - canvas.getBoundingClientRect().top;
    const touchPositionRight = e.targetTouches[0].clientY - canvas.getBoundingClientRect().top;
    touchCurrentLeftY = touchPositionLeft - touchStartLeftY;
    touchCurrentRightY = touchPositionRight - touchStartRightY;
    if (touchMoveLeft) {
      if (touchCurrentLeftY >= 0 && touchCurrentLeftY <= canvas.height - paddleHeight) {
        paddleLeftY = touchCurrentLeftY;
      }
    }
    if (touchMoveRight) {
      if (touchCurrentRightY >= 0 && touchCurrentRightY <= canvas.height - paddleHeight) {
        paddleRightY = touchCurrentRightY;
      }
    }
  }
});

canvas.addEventListener('touchend', function(e) {
  e.preventDefault();
  touchStartLeftY = 0;
  touchStartRightY = 0;
  touchCurrentLeftY = 0;
  touchCurrentRightY = 0;
  touchMoveLeft = false;
  touchMoveRight = false;
});

// Adding click event listener for restarting the game
canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  if (gameEnded && mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
    resetGame();
    draw();
  }
});

startGame();

// Increasing ball speed periodically
setInterval(function() {
  ball.speedX *= speedIncreaseFactor;
  ball.speedY *= speedIncreaseFactor;
}, 1000);
