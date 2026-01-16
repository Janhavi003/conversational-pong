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

// =========================
// EMOTIONAL STATE
// =========================
let emotion = {
  current: "calm",
  timer: 0,
};

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

  blip = new p5.Oscillator("sine");
  blip.freq(440);
  blip.amp(0);
  blip.start();
}

function draw() {
  background(20);

  if (emotion.current === "tense") {
    background(60, 0, 0, 30);
  }

  // Emotion decay
  if (emotion.timer > 0) {
    emotion.timer--;
  } else {
    emotion.current = "calm";
  }

  // Dialogue timers
  if (dialogue.timer > 0) {
    dialogue.timer--;
  } else {
    dialogue.visible = false;
  }

  if (dialogue.cooldown > 0) {
    dialogue.cooldown--;
  }

  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.vx *= -1;
    playBlip(300, 0.03, 0.15);
  }

  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
    playBlip(300, 0.03, 0.15);
  }

  // Miss detection
  if (ball.y - ball.radius > height) {
    misses++;
    updateEmotion("miss");
    triggerDialogue("miss");
    playBlip(150, 0.15, 0.25);
    resetBall();
  }

  // Paddle input
  let targetX = constrain(mouseX, 0, width);
  paddle.speed = targetX - paddle.x;
  paddle.x += paddle.speed * 0.2;

  paddle.x = constrain(
    paddle.x,
    paddle.width / 2,
    width - paddle.width / 2
  );

  // Paddle collision
  let hit =
    ball.y + ball.radius > paddle.y - paddle.height / 2 &&
    ball.x > paddle.x - paddle.width / 2 &&
    ball.x < paddle.x + paddle.width / 2 &&
    ball.vy > 0;

  if (hit) {
    ball.vy *= -1;
    ball.vx += paddle.speed * 0.03;
    score++;
    updateEmotion("hit");
    playBlip(600, 0.04, 0.2);

    if (random() < 0.3) {
      triggerDialogue("hit");
    }
  }

  // Danger awareness
  if (ball.y > height - 60 && random() < 0.01) {
    updateEmotion("danger");
    triggerDialogue("danger", 90);
  }

  ball.vx = constrain(ball.vx, -5, 5);
  ball.vy = constrain(ball.vy, -5, 5);
  ball.pulse = lerp(ball.pulse, 0, 0.1);

  // Render
  noStroke();
  fill(255);
  circle(ball.x, ball.y, (ball.radius + ball.pulse) * 2);

  let stretch = map(abs(paddle.speed), 0, 30, 0, 8, true);
  rectMode(CENTER);
  rect(paddle.x, paddle.y, paddle.width + stretch, paddle.height);

  // UI
  fill(180);
  textSize(12);
  text(`score: ${score}`, 10, 40);
  text(`misses: ${misses}`, 10, 60);

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
