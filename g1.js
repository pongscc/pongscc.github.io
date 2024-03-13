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

let touchStartY = 0;
let touchMoveY = 0;
let touchDragThreshold = 10; // Threshold for touch drag movement

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

let countdownInProgress = false; // Track if countdown animation is in progress
let countdownValue = 0; // Track the countdown value

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
    context.fillText('Click anywhere to restart', canvas.width / 2 - 150, canvas.height / 2 + 40);
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

  // Draw countdown animation
  if (countdownInProgress) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '100px Arial';
    context.fillText(countdownValue, canvas.width / 2 - 50, canvas.height / 2 + 50);
  } else {
    requestAnimationFrame(draw);
  }
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
  canvas.addEventListener('click', function(e) { // Add click event listener to canvas
    if (gameEnded) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
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
  });
  canvas.addEventListener('touchstart', function(e) { // Add touchstart event listener to canvas
    const touchY = e.touches[0].clientY; // Get the y-coordinate of the touch
    if (touchY >= paddleLeftY && touchY <= paddleLeftY + paddleHeight) { // Check if touch is within the bounds of the left paddle
      touchStartY = touchY; // Store the initial touch position
    }
  });
  canvas.addEventListener('touchmove', function(e) { // Add touchmove event listener to canvas
    const touchY = e.touches[0].clientY; // Get the y-coordinate of the touch
    const deltaY = touchY - touchStartY; // Calculate the change in touch position
    if (Math.abs(deltaY) >= touchDragThreshold) { // Check if touch movement exceeds the threshold
      if (deltaY < 0 && paddleLeftY > 0) { // Move paddle up if touch moves upwards and paddle is within bounds
        paddleLeftY -= maxPaddleSpeed;
      } else if (deltaY > 0 && paddleLeftY < canvas.height - paddleHeight) { // Move paddle down if touch moves downwards and paddle is within bounds
        paddleLeftY += maxPaddleSpeed;
      }
      touchStartY = touchY; // Update the initial touch position
    }
  });

  // Start the countdown when the button is clicked
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', function() {
    countdown(3, function() {
      countdownInProgress = false;
      draw();
    });
  });
}

function updateBotPaddle() {
  // Move bot paddle to align with the ball's y-coordinate
  if (ball.y < paddleRightY + paddleHeight / 2) {
    paddleRightY -= maxPaddleSpeed;
  } else if (ball.y > paddleRightY + paddleHeight / 2) {
    paddleRightY += maxPaddleSpeed;
  }
}

// Countdown function to animate countdown before starting the game
function countdown(seconds, callback) {
  let count = seconds;
  countdownInProgress = true;
  const countdownInterval = setInterval(function() {
    countdownValue = count;
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownInProgress = false;
      callback();
    }
    count--;
  }, 1000);
}

startGame();
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (countdownInProgress) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '100px Arial';
    context.fillText(countdownValue > 0 ? countdownValue : 'Go!', canvas.width / 2 - 50, canvas.height / 2 + 50);
  } else {
    drawBall();
    drawPaddles();
    drawScores();
  }

  if (gameEnded) {
    context.fillStyle = 'white';
    context.font = '30px Arial';
    context.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
    context.fillText('Click anywhere to restart', canvas.width / 2 - 150, canvas.height / 2 + 40);
    clearInterval(speedIncreaseInterval); // Stop the speed increase interval
    return;
  }

  if (!countdownInProgress) {
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
  }

  requestAnimationFrame(draw);
}
