// =========================
// GAME STATE
// =========================
let ball;
let paddle;
let score = 0;
let misses = 0;

// =========================
// SOUND STATE
// =========================
let blip;
let audioStarted = false;

// =========================
// DIALOGUE STATE
// =========================
let dialogue = {
  text: "",
  visible: false,
  timer: 0,
  cooldown: 0,
};

const DIALOGUE_POOL = {
  miss: [
    "Missed.",
    "Too slow.",
    "That one slipped by.",
    "You were late.",
  ],
  hit: [
    "Nice.",
    "Good timing.",
    "Clean hit.",
  ],
  danger: [
    "Careful.",
    "That was close.",
  ],
};

function setup() {
  createCanvas(800, 500);

  // =========================
  // BALL
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
  // PADDLE (BOTTOM)
  // =========================
  paddle = {
    x: width / 2,
    y: height - 30,
    width: 100,
    height: 10,
    speed: 0,
  };

  // =========================
  // SOUND INIT
  // =========================
  blip = new p5.Oscillator("sine");
  blip.freq(440);
  blip.amp(0);
  blip.start();
}

function draw() {
  background(20);

  // =========================
  // DANGER ZONE FEEDBACK
  // =========================
  if (ball.y > height - 40) {
    background(40, 0, 0, 40);
  }

  // =========================
  // DIALOGUE TIMERS
  // =========================
  if (dialogue.timer > 0) {
    dialogue.timer--;
  } else {
    dialogue.visible = false;
  }

  if (dialogue.cooldown > 0) {
    dialogue.cooldown--;
  }

  // =========================
  // BALL MOVEMENT
  // =========================
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall bounce (left / right)
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.vx *= -1;
    ball.pulse = 4;
    playBlip(300, 0.03, 0.15);
  }

  // Top bounce
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
    triggerDialogue("miss");
    playBlip(150, 0.15, 0.25);
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
    playBlip(600, 0.04, 0.2);

    if (random() < 0.3) {
      triggerDialogue("hit");
    }
  }

  // =========================
  // DANGER DIALOGUE (RARE)
  // =========================
  if (ball.y > height - 60 && random() < 0.01) {
    triggerDialogue("danger", 90);
  }

  // =========================
  // SAFETY CLAMP
  // =========================
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
  textAlign(LEFT);
  text(`FPS: ${nf(frameRate(), 2, 1)}`, 10, 20);
  text(`score: ${score}`, 10, 40);
  text(`misses: ${misses}`, 10, 60);

  // =========================
  // DIALOGUE RENDER
  // =========================
  if (dialogue.visible) {
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(dialogue.text, width / 2, height / 2 - 40);
  }
}

// =========================
// HELPERS
// =========================
function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.vx = random(-2, 2);
  ball.vy = 2.5;
  ball.pulse = 10;
}

function randomFrom(array) {
  return array[Math.floor(random(array.length))];
}

function triggerDialogue(type, duration = 120) {
  if (dialogue.cooldown > 0) return;

  const options = DIALOGUE_POOL[type];
  if (!options) return;

  dialogue.text = randomFrom(options);
  dialogue.visible = true;
  dialogue.timer = duration;
  dialogue.cooldown = 180;
}

// =========================
// AUDIO
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
