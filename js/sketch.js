let ball;
let paddle;
let score = 0;
let misses = 0;

// --- Sound state ---
let blip;
let audioStarted = false;

function setup() {
  createCanvas(800, 500);

  // =========================
  // BALL STATE
  // =========================
  ball = {
    x: width / 2,
    y: height / 2,
    radius: 8,
    vx: 2,
    vy: 2.5,
    pulse: 0,
  };

  // =========================
  // PADDLE STATE (BOTTOM)
  // =========================
  paddle = {
    x: width / 2,
    y: height - 30,
    width: 100,
    height: 10,
    speed: 0,
  };

  // =========================
  // SOUND INIT (SILENT)
  // =========================
  blip = new p5.Oscillator("sine");
  blip.freq(440);
  blip.amp(0);
  blip.start();
}

function draw() {
  background(20);

  // Emotional danger zone feedback
  if (ball.y > height - 40) {
    background(40, 0, 0, 40);
  }

  // =========================
  // BALL MOVEMENT
  // =========================
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Left / right wall bounce
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.vx *= -1;
    ball.pulse = 4;
    playBlip(300, 0.03, 0.15);
  }

  // Top wall bounce
  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
    ball.pulse = 4;
    playBlip(300, 0.03, 0.15);
  }

  // =========================
  // MISS DETECTION
  // =========================
  if (ball.y - ball.radius > height) {
    misses++;
    playBlip(150, 0.15, 0.25);
    resetBall();
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
    ball.vx += paddle.speed * 0.03;

    score++;
    ball.pulse = 6;

    playBlip(600, 0.04, 0.2);
  }

  // Safety clamp
  ball.vx = constrain(ball.vx, -5, 5);
  ball.vy = constrain(ball.vy, -5, 5);

  // Pulse easing
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

// =========================
// AUDIO CONTROL
// =========================
function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
    console.log("Audio started");
  }
}

function playBlip(freq = 440, duration = 0.05, amp = 0.3) {
  if (!audioStarted) return;

  blip.freq(freq);
  blip.amp(amp, 0.01);

  setTimeout(() => {
    blip.amp(0, 0.05);
  }, duration * 1000);
}
