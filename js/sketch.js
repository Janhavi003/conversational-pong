import {
  UI_CONFIG,
  BALL_CONFIG,
  PADDLE_CONFIG,
  JUICE_CONFIG,
} from "./config.js";

// =========================
// JUICE STATE
// =========================
let shake = { intensity: 0 };
let hitStop = 0;

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
  yOffset: -20,
};

// =========================
// EMOTIONAL STATE
// =========================
let emotion = {
  current: "calm",
  timer: 0,
};

// =========================
// DIALOGUE DATA
// =========================
const DIALOGUE_POOL = {
  miss: {
    calm: ["Missed.", "That slipped by."],
    sarcastic: [
      "Again?",
      "You keep missing that.",
      "Timing is optional, apparently.",
    ],
    encouraging: ["It's okay. Reset."],
    tense: ["Careful."],
  },
  hit: {
    calm: ["Nice.", "Good."],
    encouraging: ["You're getting better.", "Yes. That."],
    tense: ["That was close."],
  },
  danger: {
    calm: ["Careful."],
    tense: ["Focus.", "Pay attention."],
  },
};

function setup() {
  createCanvas(800, 500);

  ball = {
    x: width / 2,
    y: (height - UI_CONFIG.dialogueHeight) / 2,
    radius: BALL_CONFIG.radius,
    vx: BALL_CONFIG.baseVX,
    vy: BALL_CONFIG.baseVY,
    pulse: 0,
  };

  paddle = {
    x: width / 2,
    y: height - PADDLE_CONFIG.yOffset,
    width: PADDLE_CONFIG.width,
    height: PADDLE_CONFIG.height,
    speed: 0,
  };

  blip = new p5.Oscillator("sine");
  blip.freq(440);
  blip.amp(0);
  blip.start();
}

function draw() {
  if (hitStop > 0) {
    hitStop--;
    return;
  }

  background(20);

  // Dialogue panel
  noStroke();
  fill(10);
  rect(0, 0, width, UI_CONFIG.dialogueHeight);
  stroke(60);
  line(0, UI_CONFIG.dialogueHeight, width, UI_CONFIG.dialogueHeight);

  // Emotion decay
  if (emotion.timer > 0) emotion.timer--;
  else emotion.current = "calm";

  // Dialogue timers
  if (dialogue.timer > 0) dialogue.timer--;
  else dialogue.visible = false;
  if (dialogue.cooldown > 0) dialogue.cooldown--;

  dialogue.yOffset = lerp(dialogue.yOffset, 0, 0.1);

  // =========================
  // GAMEPLAY CAMERA
  // =========================
  push();
  translate(
    random(-shake.intensity, shake.intensity),
    random(-shake.intensity, shake.intensity) +
      UI_CONFIG.dialogueHeight
  );

  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.vx *= -1;
    shake.intensity = max(shake.intensity, JUICE_CONFIG.wallShake);
    playBlip(300, 0.03, 0.15);
  }

  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
    shake.intensity = max(shake.intensity, JUICE_CONFIG.wallShake);
    playBlip(300, 0.03, 0.15);
  }

  if (
    ball.y - ball.radius >
    height - UI_CONFIG.dialogueHeight
  ) {
    misses++;
    updateEmotion("miss");
    triggerDialogue("miss");
    shake.intensity = JUICE_CONFIG.missShake;
    hitStop = JUICE_CONFIG.hitStopMiss;
    playBlip(150, 0.15, 0.25);
    resetBall();
  }

  let targetX = constrain(mouseX, 0, width);
  paddle.speed = targetX - paddle.x;
  paddle.x += paddle.speed * PADDLE_CONFIG.easing;

  paddle.x = constrain(
    paddle.x,
    paddle.width / 2,
    width - paddle.width / 2
  );

  let hit =
    ball.y + ball.radius >
      paddle.y -
        UI_CONFIG.dialogueHeight -
        paddle.height / 2 &&
    ball.x > paddle.x - paddle.width / 2 &&
    ball.x < paddle.x + paddle.width / 2 &&
    ball.vy > 0;

  if (hit) {
    ball.vy *= -1;
    ball.vx += paddle.speed * 0.03;
    ball.vx = constrain(
      ball.vx,
      -BALL_CONFIG.maxSpeed,
      BALL_CONFIG.maxSpeed
    );

    score++;
    updateEmotion("hit");
    shake.intensity = JUICE_CONFIG.hitShake;
    hitStop = JUICE_CONFIG.hitStopHit;
    playBlip(600, 0.04, 0.2);

    if (random() < 0.3) triggerDialogue("hit");
  }

  ball.pulse = lerp(ball.pulse, 0, 0.1);

  noStroke();
  fill(255);
  circle(ball.x, ball.y, ball.radius * 2);

  rectMode(CENTER);
  rect(
    paddle.x,
    paddle.y - UI_CONFIG.dialogueHeight,
    paddle.width,
    paddle.height
  );

  pop();

  shake.intensity = lerp(shake.intensity, 0, 0.2);

  // UI text
  fill(180);
  textSize(12);
  text(`score: ${score}`, 10, UI_CONFIG.dialogueHeight + 20);
  text(`misses: ${misses}`, 10, UI_CONFIG.dialogueHeight + 40);

  if (dialogue.visible) {
    fill(220);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(
      dialogue.text,
      width / 2,
      UI_CONFIG.dialogueHeight / 2 + dialogue.yOffset
    );
  }
}

// =========================
// HELPERS
// =========================
function resetBall() {
  ball.x = width / 2;
  ball.y = (height - UI_CONFIG.dialogueHeight) / 2;
  ball.vx = random(-2, 2);
  ball.vy = BALL_CONFIG.baseVY;
}

function randomFrom(arr) {
  return arr[Math.floor(random(arr.length))];
}

function updateEmotion(event) {
  if (event === "miss") {
    emotion.timer = 300;
    emotion.current = misses >= 3 ? "sarcastic" : "calm";
  } else if (event === "hit") {
    emotion.timer = 240;
    emotion.current = score >= 5 ? "encouraging" : "calm";
  } else if (event === "danger") {
    emotion.timer = 180;
    emotion.current = "tense";
  }
}

function triggerDialogue(type, duration = 120) {
  if (dialogue.cooldown > 0) return;
  const options =
    DIALOGUE_POOL[type]?.[emotion.current] ||
    DIALOGUE_POOL[type]?.calm;
  if (!options) return;
  dialogue.text = randomFrom(options);
  dialogue.visible = true;
  dialogue.timer = duration;
  dialogue.cooldown = 180;
  dialogue.yOffset = -20;
}

// =========================
// AUDIO
// =========================
function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
  }
}

function playBlip(freq, duration, amp) {
  if (!audioStarted) return;
  blip.freq(freq);
  blip.amp(amp, 0.01);
  setTimeout(() => blip.amp(0, 0.05), duration * 1000);
}
