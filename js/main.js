var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
//bar measurements
var barHeight = 10;
var barWidth = 75;
var barX = (canvas.width - barWidth) / 2;
//ball measurements and position
var x = canvas.width / 2;
var ballRadius = 10;
var y = canvas.height - barHeight - ballRadius;
var dx = 2;
var dy = -2;
//control key
var rightPressed = false;
var leftPressed = false;

//measurements for brick
var brickRowCout = 4;
var brickColumnCout = 7;
var brickWidth = 51;
var brickHeight = 20;
var brickPadding = 11;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var start = false;


var bricks = [];
for (var c = 0; c < brickColumnCout; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCout; r++) {
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
document.addEventListener('keypress', keyPressHandler, false);

//check if left or right arrow is pressed
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}
//checked if left or right arrow is released
function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function keyPressHandler(e) {
  if (e.keyCode == 32) {
    start = true;
    draw();
  }

  if (e.keyCode == 82){
    document.location.reload();
  }
}

//mouse control
function mouseMoveHandler(e) {
  if (start) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      barX = relativeX - barWidth / 2;
    }
  }
}

//checking if  ball hit brick
function brickCollisionDetection() {
  for (var c = 0; c < brickColumnCout; c++) {
    for (var r = 0; r < brickRowCout; r++) {
      var b = {x: bricks[c][r].x, y: bricks[c][r].y, w: brickWidth, h: brickHeight};
      var ball = {x: x, y: y, r: ballRadius};
      if (bricks[c][r].status == 1) {

        if (rectCircleColliding(ball, b)) {
          dy = -dy;
          bricks[c][r].status = 0;
          score++;
          if (score == brickColumnCout * brickRowCout) {
            document.location.reload();
            alert("YOU ARE THE CHAMPION!!!")

          }
        }
      }
    }
  }
}
//What to do if the ball touch or miss the bar
function barCollisionDetection() {
  //get ball and bar coords
  var bar = {x: barX, y: canvas.height - barHeight, w: barWidth, h: barHeight};
  var ball = {x: x, y: y, r: ballRadius};
  //check if the ball touch bar
  if (rectCircleColliding(ball, bar)) {
    dy = -dy;
  } else if (y + dy > canvas.height + 10){
    //check if the ball is below bottom
    lives--;
    if (!lives) {
      document.location.reload();
      alert("GAME OVER");
    } else {
      //resume to starting position
      x = canvas.width / 2;
      y = canvas.height - barHeight - ballRadius;
      dx = 2;
      dy = -2;
      barX = (canvas.width - barWidth) / 2;
      //allow player to start game manually with space button
      start = false;
    }
  }

}
function rectCircleColliding(circle, rect) {
  //define distance between ball and brick (X and Y axis)
  var distX = Math.abs(circle.x - rect.x - rect.w / 2);
  var distY = Math.abs(circle.y - rect.y - rect.h / 2);
  //check if the distance is greater ball radius + distance from center of rect
  if (distX > (rect.w / 2 + circle.r)) {
    return false;
  }
  if (distY > (rect.h / 2 + circle.r)) {
    return false;
  }
  //if previous is false than they are colliding
  if (distX <= (rect.w / 2)) {
    return true;
  }
  if (distY <= (rect.h / 2)) {
    return true;
  }
  //corner touch
  var dx = distX - rect.w / 2;
  var dy = distY - rect.h / 2;
  return (dx * dx + dy * dy <= (circle.r * circle.r));
}

//how to display player lives
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("lives: " + lives, canvas.width - 65, 20);
}

//how to display player current score
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFCC00";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawContinueMessage (){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#666699";
  ctx.fillText('You miss the ball !!!', 175, 200);
  ctx.font = "32px Arial";
  ctx.fillText("Press space to continue", 90, 250);
}

function drawStartMessage() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#666699";
  ctx.fillText('Use right and left arrows or mouse to control bar', 80, 200);
  ctx.font = "32px Arial";
  ctx.fillText("Press space to begin", 100, 250);

}


//how to display bricks
function drawBricks() {
  for (var c = 0; c < brickColumnCout; c++) {
    for (var r = 0; r < brickRowCout; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#841F27";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//how to display ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#A5f2E3";
  ctx.fill();
  ctx.closePath();
}

//how to display bar
function drawBar() {
  ctx.beginPath();
  ctx.rect(barX, canvas.height - barHeight, barWidth, barHeight);
  ctx.fillStyle = "rgba(0, 0, 0, 0.7";
  ctx.fill();
  ctx.closePath();
}

//display inside the canvas
function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawBar();
  drawScore();
  drawLives();
  brickCollisionDetection();
  if (rightPressed && barX < canvas.width - barWidth) {
    barX += 7;
  } else if (leftPressed && barX > 0) {
    barX -= 7;
  }
  if (x + dx + ballRadius > canvas.width || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else {
    barCollisionDetection();
  }

  if (start) {
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
  } else if (lives !== 3 && lives !==0){
    drawContinueMessage()
  } else{
    drawStartMessage();
  }

}

draw();