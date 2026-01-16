// =========================
// UI LAYOUT
// =========================
const UI = {
  dialogueHeight: 80,
  padding: 20,
};

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

  // =========================
  // BALL
  // =========================
  ball = {
    x: width / 2,
    y: UI.dialogueHeight + (height - UI.dialogueHeight) / 2,
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
  // DIALOGUE PANEL
  // =========================
  noStroke();
  fill(10);
  rect(0, 0, width, UI.dialogueHeight);

  stroke(60);
  line(0, UI.dialogueHeight, width, UI.dialogueHeight);

  // =========================
  // EMOTION DECAY
  // =========================
  if (emotion.timer > 0) {
    emotion.timer--;
  } else {
    emotion.current = "calm";
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

  dialogue.yOffset = lerp(dialogue.yOffset, 0, 0.1);

  // =========================
  // GAMEPLAY SPACE
  // =========================
  push();
  translate(0, UI.dialogueHeight);

  // Emotional tension overlay
  if (emotion.current === "tense") {
    background(60, 0, 0, 30);
  }

  // =========================
  // BALL MOVEMENT
  // =========================
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Side walls
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.vx *= -1;
    ball.pulse = 4;
    playBlip(300, 0.03, 0.15);
  }

  // Top wall (gameplay top = 0)
  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
    ball.pulse = 4;
    playBlip(300, 0.03, 0.15);
  }

  // =========================
  // MISS DETECTION
  // =========================
  if (ball.y - ball.radius > height - UI.dialogueHeight) {
    misses++;
    updateEmotion("miss");
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
    ball.y + ball.radius > paddle.y - UI.dialogueHeight - paddle.height / 2 &&
    ball.x > paddle.x - paddle.width / 2 &&
    ball.x < paddle.x + paddle.width / 2 &&
    ball.vy > 0;

  if (hit) {
    ball.vy *= -1;
    ball.vx += paddle.speed * 0.03;
    score++;
    updateEmotion("hit");
    playBlip(600, 0.04, 0.2);
    ball.pulse = 6;

    if (random() < 0.3) {
      triggerDialogue("hit");
    }
  }

  // =========================
  // DANGER AWARENESS
  // =========================
  if (ball.y > height - UI.dialogueHeight - 60 && random() < 0.01) {
    updateEmotion("danger");
    triggerDialogue("danger", 90);
  }

  // Safety clamp
  ball.vx = constrain(ball.vx, -5, 5);
  ball.vy = constrain(ball.vy, -5, 5);
  ball.pulse = lerp(ball.pulse, 0, 0.1);

  // =========================
  // RENDER GAME OBJECTS
  // =========================
  noStroke();
  fill(255);
  circle(ball.x, ball.y, (ball.radius + ball.pulse) * 2);

  let stretch = map(abs(paddle.speed), 0, 30, 0, 8, true);
  rectMode(CENTER);
  rect(
    paddle.x,
    paddle.y - UI.dialogueHeight,
    paddle.width + stretch,
    paddle.height
  );

  pop();

  // =========================
  // UI TEXT
  // =========================
  fill(180);
  textSize(12);
  textAlign(LEFT);
  text(`score: ${score}`, 10, UI.dialogueHeight + 20);
  text(`misses: ${misses}`, 10, UI.dialogueHeight + 40);

  // =========================
  // DIALOGUE RENDER
  // =========================
  if (dialogue.visible) {
    fill(220);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(
      dialogue.text,
      width / 2,
      UI.dialogueHeight / 2 + dialogue.yOffset
    );
  }
}

// =========================
// HELPERS
// =========================
function resetBall() {
  ball.x = width / 2;
  ball.y = (height - UI.dialogueHeight) / 2;
  ball.vx = random(-2, 2);
  ball.vy = 2.5;
  ball.pulse = 10;
}

function randomFrom(arr) {
  return arr[Math.floor(random(arr.length))];
}

function updateEmotion(event) {
  switch (event) {
    case "miss":
      emotion.timer = 300;
      emotion.current = misses >= 3 ? "sarcastic" : "calm";
      break;
    case "hit":
      emotion.timer = 240;
      emotion.current = score >= 5 ? "encouraging" : "calm";
      break;
    case "danger":
      emotion.timer = 180;
      emotion.current = "tense";
      break;
  }
}

function triggerDialogue(type, duration = 120) {
  if (dialogue.cooldown > 0) return;

  const emotionalSet = DIALOGUE_POOL[type];
  const options =
    emotionalSet?.[emotion.current] || emotionalSet?.calm;

  if (!options || options.length === 0) return;

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

  setTimeout(() => {
    blip.amp(0, 0.05);
  }, duration * 1000);
}
