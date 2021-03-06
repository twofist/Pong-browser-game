var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 5;
var dy = -5;
var paddleHeight = 75;
var paddleWidth = 10;
var paddleY = (canvas.height - paddleHeight) / 2;
var paddleX = 30;
var upPressed = false;
var downPressed = false;
var score = 0;
var lives = 3;
var lastCalledTime;
var fps;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode === 38) {
        upPressed = true;
    } else if (e.keyCode === 40) {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 38) {
        upPressed = false;
    } else if (e.keyCode === 40) {
        downPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, canvas.width / 2, 20);
}

function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(" Lives: " + lives, canvas.width / 2, 40);
}

function drawFps() {
    if (!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return;
    }
    delta = (Date.now() - lastCalledTime) / 1000;
    lastCalledTime = Date.now();
    fps = 1 / delta;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("  FPS: " + fps.toFixed(0), 40, 20)
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawFps();

    //right side revert ball
    if (x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
    //left side die
    else if (x - dx < ballRadius) {
        lives--;
        if (!lives) {
            alert("GAME OVER");
            document.location.reload();
        } else {
            if (dx < 0) {
                dx = -dx;
            }
            x = canvas.width / 2;
            y = canvas.height - 30;
            paddleY = (canvas.height - paddleHeight) / 2;
            alert("you lost a life");
        }
    }
    //revert if hit paddle
    if (y > paddleY && y < paddleY + paddleHeight && paddleX >= x - ballRadius) {
        dx = -dx;
        if (score >= 5 && score < 10) {
            dx += 2;
        } else if (score >= 10) {
            dx += 4;
        } else {
            dx++;
        }
        score++;
        ballRadius++;
        paddleHeight++;
    }
    //top and down side revert ball
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    //presses
    if (upPressed && paddleY > 8) {
        paddleY -= 10;
    } else if (downPressed && paddleY < canvas.height - paddleHeight - 8) {
        paddleY += 10;
    }

    //ball movement
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
