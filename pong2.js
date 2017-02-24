var canvas = document.getElementById("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = Math.floor(Math.random() * canvas.width/2) + canvas.width/2/2;
var y = Math.floor(Math.random() * canvas.height/2) + canvas.height/2/2;
var dx = 5;
var dy = -5;
var paddleHeight = 75;
var paddleWidth = 10;
var paddleY = (canvas.height-paddleHeight)/2;
var paddleX = 30;
var upPressed = false;
var downPressed = false;
var score = 0;
var lives = 3;
var pclives = 3;
var lastCalledTime;
var fps;
var aix = canvas.width - paddleX;
var aiy = paddleY;
var check1 = 1;
var check2 = 1;
var check3 = 1;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode === 38) {
        upPressed = true;
    }
    else if(e.keyCode === 40) {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode === 38) {
        upPressed = false;
    }
    else if(e.keyCode === 40) {
        downPressed = false;
    }
}
	
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
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

function AIpaddle() {
	ctx.beginPath();
	ctx.rect(aix, aiy, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, canvas.width/2, 20);
}

function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
	let txt = " Lives: "+lives+" - "+pclives+" :Comp Lives"
    ctx.fillText(txt, canvas.width/2-txt.length*3, 40);
}

function drawFps() {
	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1/delta;
	ctx.font = "20px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("  FPS: "+fps.toFixed(0), 40, 20)
}

function grow(){
	score++;
	ballRadius++;
	paddleHeight++;
	paddleWidth++;
}

function resetball(){
	if(dx < 0){dx = -dx;}
    x = Math.floor(Math.random() * canvas.width/2) + canvas.width/2/2;
    y = Math.floor(Math.random() * canvas.height/2) + canvas.height/2/2;
    paddleY = (canvas.height-paddleHeight)/2;
	check1 = 1;
	check2 = 1;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
	AIpaddle();
	drawScore();
	drawLives();
	drawFps();

	//right side win
	if(x + dx > canvas.width+ballRadius+ballRadius) {
		resetball();
		alert("the computer lost a life");
		pclives--;
		if(!pclives) {
			alert("YOU WIN");
			document.location.reload();
		}
    }
	//left side die
	else if(x - dx < 0-ballRadius-ballRadius) {
		resetball();
		alert("you lost a life");
		lives--;
		if(!lives) {
            alert("GAME OVER");
            document.location.reload();
        }
    }
	//revert if hit paddle
	if(y > paddleY && y < paddleY + paddleHeight && paddleX+paddleWidth >= x-ballRadius && paddleX-paddleWidth <= x-ballRadius && check1 === 1) {
		check1 = 0;
		check2 = 1;
		dx = -dx;
		dx++;
		grow();
	}
	//revert if hit paddle
	if(y > aiy && y < aiy + paddleHeight && aix <= x+ballRadius && check2 === 1) {
		check2 = 0;
		check1 = 1;
		dx = -dx;
		dx--;
		grow();
	}
	
	//top and down side revert ball
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
	//presses
	if(upPressed && paddleY > 8) {
        paddleY -= 10;
    }
    else if(downPressed && paddleY < canvas.height-paddleHeight-8) {
        paddleY += 10;
    }
	
	//ai movement
	if (dx > 0) {
		if (y>aiy && aiy < canvas.height-paddleHeight-8){
			aiy += 10;
		}
		if (y<aiy && aiy > 8) {
			aiy -= 10;
		}
	}
	if (dx<0 && aiy > canvas.height/2+paddleHeight/2){
		aiy -= 10;
	}
	else if (dx<0 && aiy < canvas.height/2-paddleHeight/2){
		aiy += 10;
	}
	
	//ball movement
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
