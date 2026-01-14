let ball;
let paddle;

function setup() {
  createCanvas(800, 500);

  // --- Ball state (SLOWER, READABLE) ---
  ball = {
    x: width / 2,
    y: height / 2,
    radius: 8,
    vx: 2,
    vy: 2.5,
    pulse: 0,
  };

  // --- Player paddle (BOTTOM, HORIZONTAL) ---
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

  // =========================
  // BALL MOVEMENT
  // =========================

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Left & right wall bounce
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.vx *= -1;
    ball.pulse = 4;
  }

  // Top wall bounce
  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
    ball.pulse = 4;
  }

  // =========================
  // PADDLE INPUT (HORIZONTAL)
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

    // Subtle horizontal influence from paddle motion
    ball.vx += paddle.speed * 0.03;

    ball.pulse = 6;
  }

  // =========================
  // SAFETY CLAMP (DESIGN LIMITS)
  // =========================

  ball.vx = constrain(ball.vx, -5, 5);
  ball.vy = constrain(ball.vy, -5, 5);

  // =========================
  // FEEDBACK / EASING
  // =========================

  ball.pulse = lerp(ball.pulse, 0, 0.1);

  // =========================
  // RENDERING
  // =========================

  // Ball
  noStroke();
  fill(255);
  circle(
    ball.x,
    ball.y,
    (ball.radius + ball.pulse) * 2
  );

  // Paddle (stretch based on speed)
  let stretch = map(abs(paddle.speed), 0, 30, 0, 8, true);

  rectMode(CENTER);
  rect(
    paddle.x,
    paddle.y,
    paddle.width + stretch,
    paddle.height
  );

  // =========================
  // DEBUG UI
  // =========================

  stroke(255, 50);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  noStroke();
  fill(180);
  textSize(12);
  text(`FPS: ${nf(frameRate(), 2, 1)}`, 10, 20);
  text(
    `vx: ${nf(ball.vx, 1, 2)}, vy: ${nf(ball.vy, 1, 2)}`,
    width - 180,
    20
  );
  text(
    `paddle speed: ${nf(paddle.speed, 1, 1)}`,
    width - 180,
    40
  );
}
