let ball;
let paddle;
let score = 0;
let misses = 0;

function setup() {
  createCanvas(800, 500);

  ball = {
    x: width / 2,
    y: height / 2,
    radius: 8,
    vx: 2,
    vy: 2.5,
    pulse: 0,
  };

  paddle = {
    x: width / 2,
    y: height - 30,
    width: 100,
    height: 10,
    speed: 0,
  };
}

function draw() {
  background(20);

  // Danger zone feedback
  if (ball.y > height - 40) {
    background(40, 0, 0, 40);
  }

  // =========================
  // BALL MOVEMENT
  // =========================

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.vx *= -1;
    ball.pulse = 4;
  }

  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
    ball.pulse = 4;
  }

  // MISS DETECTION
  if (ball.y - ball.radius > height) {
    misses++;
    resetBall();
  }

  // =========================
  // PADDLE INPUT
  // =========================

  let targetX = constrain(mouseX, 0, width);
  paddle.speed = targetX - paddle.x;
  paddle.x += paddle.speed * 0.2;

  paddle.x = constrain(
    paddle.x,
    paddle.width / 2,
    width - paddle.width / 2
  );

  // =========================
  // BALL ↔ PADDLE COLLISION
  // =========================

  let hit =
    ball.y + ball.radius > paddle.y - paddle.height / 2 &&
    ball.x > paddle.x - paddle.width / 2 &&
    ball.x < paddle.x + paddle.width / 2 &&
    ball.vy > 0;

  if (hit) {
    ball.vy *= -1;
    ball.vx += paddle.speed * 0.03;

    score++;
    ball.pulse = 6;
  }

  // Safety clamp
  ball.vx = constrain(ball.vx, -5, 5);
  ball.vy = constrain(ball.vy, -5, 5);

  ball.pulse = lerp(ball.pulse, 0, 0.1);

  // =========================
  // RENDERING
  // =========================

  noStroke();
  fill(255);
  circle(
    ball.x,
    ball.y,
    (ball.radius + ball.pulse) * 2
  );

  let stretch = map(abs(paddle.speed), 0, 30, 0, 8, true);

  rectMode(CENTER);
  rect(
    paddle.x,
    paddle.y,
    paddle.width + stretch,
    paddle.height
  );

  // =========================
  // UI / DEBUG
  // =========================

  fill(180);
  textSize(12);
  text(`FPS: ${nf(frameRate(), 2, 1)}`, 10, 20);
  text(`score: ${score}`, 10, 40);
  text(`misses: ${misses}`, 10, 60);
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;

  ball.vx = random(-2, 2);
  ball.vy = 2.5;

  ball.pulse = 10;
}
