const cvs = document.getElementById("game");
cvs.width = window.innerWidth - 20;
cvs.height = window.innerHeight - 20;
const ctx = cvs.getContext("2d");

const drawRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

const drawCircleF = (x, y, radius, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

const drawCircleS = (x, y, radius, w, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}

const drawText = (text, x, y, color) => {
    ctx.fillStyle = color;
    ctx.font = "20px Arial";
    ctx.fillText(text, x, y);
}

const user = {
    x: 20,
    y: cvs.height / 2 - 50,
    w: 10,
    h: 100,
    color: "#fff",
    score: 0,
};

const com = {
    x: cvs.width - 30,
    y: cvs.height / 2 - 50,
    w: 10,
    h: 100,
    color: "#fff",
    score: 0,
};

const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: 13,
    speed: 5,
    velocityX: 3,
    velocityY: 4,
    stop: true,
    color: "#000",
};

const movePaddle = (event) => {
    let rect = cvs.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.h / 2;

}

cvs.addEventListener("mousemove", movePaddle);

const collision = (b, p) => {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;

    return (b.right > p.left && b.left < p.right && b.bottom > p.top && b.top < p.bottom);
}

const update = () => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > cvs.height) {
        ball.y = cvs.height - ball.radius;
        ball.velocityY = -ball.velocityY;
    }
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.velocityY = -ball.velocityY;
    }

    // AI (computer) paddle movement
    let comlvl = 0.1;
    com.y += (ball.y - (com.y + com.h / 2)) * comlvl;
    if (com.y < 0) com.y = 0;
    if (com.y + com.h > cvs.height) com.y = cvs.height - com.h;

    // Ball collision with left and right walls (scoring)
    if (ball.x + ball.radius > cvs.width) {
        user.score++;
        resetBall();
    }
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    }

    // Determine which paddle to check collision with
    let player = (ball.x < cvs.width / 2) ? user : com;

    // Ball collision with paddle
    if (collision(ball, player)) {
        // basit bounce efekti
        let intersectY = ball.y - (player.y + player.h / 2);
        intersectY /= player.h / 2;

        let maxBounceRate = Math.PI / 3; // 60 degrees
        let bounceAngle = intersectY * maxBounceRate;

        let direction = (ball.x < cvs.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(bounceAngle);
        ball.velocityY = ball.speed * Math.sin(bounceAngle);

        ball.speed += 2; // Increase speed after each hit

        if (ball.speed > 15) ball.speed -= 2;
        if (ball.speed < 5) ball.speed += 2; // Cap the speed

    }

    // Stop the ball if it goes out of bounds
    if (ball.x > cvs.width) {
        user.score++;
        resetBall();
    } else if (ball.x < 0) {
        com.score++;
        resetBall();
    }
}

const resetBall = () => {
    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.stop = true;
}


const render = () => {
    drawRect(0, 0, cvs.width, cvs.height, "#008374");
    drawRect(cvs.width/2 - 2, 0, 4, cvs.height, "#fff");
    drawCircleF(cvs.width/2, cvs.height/2, 8, "#fff");
    drawCircleS(cvs.width/2, cvs.height/2, 50, 4, "#fff");
    drawText(`${user.score}`, cvs.width/4, 100, "#fff");
    drawText(`${com.score}`, 3*cvs.width/4, 100, "#fff");

    drawRect(user.x, user.y, user.w, user.h, user.color);
    drawRect(com.x, com.y, com.w, com.h, com.color);
    drawCircleF(ball.x, ball.y, ball.radius, ball.color);
}

const game = () => {
    render();
    update();
}

const fps = 50;
setInterval(game, 1000 / fps);

game();
