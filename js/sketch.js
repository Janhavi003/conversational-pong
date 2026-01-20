import {
  UI_CONFIG,
  BALL_CONFIG,
} from "./config.js";

// =========================
// GAME ENTITIES
// =========================
import {
  createBall,
  updateBall,
  resetBall,
} from "./game/Ball.js";

import {
  createPaddle,
  updatePaddle,
  paddleHitsBall,
} from "./game/Paddle.js";

import {
  createGameState,
  registerHit,
  registerMiss,
} from "./game/GameState.js";

// =========================
// SYSTEMS
// =========================
import {
  initSound,
  startAudio,
  playBlip,
} from "./systems/SoundSystem.js";

import {
  updateEmotion,
  tickEmotion,
  getEmotion,
} from "./systems/EmotionSystem.js";

import {
  updateDialogue,
  triggerDialogue,
  getDialogueState,
} from "./systems/DialogueSystem.js";

import {
  applyHitJuice,
  applyMissJuice,
  applyWallJuice,
  updateJuice,
  shouldHitStop,
  getCameraOffset,
} from "./systems/JuiceSystem.js";

// =========================
// UI
// =========================
import { renderDialogue } from "./ui/DialogueUI.js";
import { renderHUD } from "./ui/HUD.js";
import { renderTitle } from "./ui/TitleUI.js";
import {
  renderScanlines,
  renderVignette,
} from "./ui/EffectsUI.js";

// =========================
// CORE OBJECTS
// =========================
let ball;
let paddle;
let gameState;

// =========================
// IDLE / ATTRACT MODE
// =========================
let lastInputTime = 0;
const IDLE_THRESHOLD = 300; // frames (~5 seconds)

// =========================
// P5 LIFECYCLE (GLOBAL MODE)
// =========================
window.setup = function () {
  createCanvas(800, 500);

  ball = createBall(width, height);
  paddle = createPaddle(width, height);
  gameState = createGameState();

  initSound();
};

window.draw = function () {
  // -------------------------
  // HIT STOP
  // -------------------------
  if (shouldHitStop()) {
    updateJuice();
    return;
  }

  // Subtle CRT / lo-fi tone
  background(16, 18, 20);

  // -------------------------
  // IDLE DETECTION
  // -------------------------
  const isIdle =
    frameCount - lastInputTime > IDLE_THRESHOLD;

  // -------------------------
  // DIALOGUE PANEL
  // -------------------------
  noStroke();
  fill(10);
  rect(0, 0, width, UI_CONFIG.dialogueHeight);

  stroke(60);
  line(0, UI_CONFIG.dialogueHeight, width, UI_CONFIG.dialogueHeight);

  // -------------------------
  // TITLE (ATTRACT MODE)
  // -------------------------
  renderTitle({
    canvasWidth: width,
    emotion: getEmotion(),
    isIdle,
    frameCount,
  });

  // -------------------------
  // SYSTEM UPDATES
  // -------------------------
  tickEmotion();
  updateDialogue();
  updateJuice();

  // -------------------------
  // CAMERA (JUICE)
  // -------------------------
  const cam = getCameraOffset(UI_CONFIG.dialogueHeight);
  push();
  translate(cam.x, cam.y);

  // -------------------------
  // BALL UPDATE
  // -------------------------
  updateBall(ball);

  // Side walls
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.vx *= -1;
    applyWallJuice();
    playBlip(300, 0.03, 0.15);
  }

  // Top wall
  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
    applyWallJuice();
    playBlip(300, 0.03, 0.15);
  }

  // -------------------------
  // MISS
  // -------------------------
  if (ball.y - ball.radius > height - UI_CONFIG.dialogueHeight) {
    registerMiss(gameState);
    updateEmotion(
      "miss",
      gameState.score,
      gameState.misses
    );
    triggerDialogue("miss", getEmotion());
    applyMissJuice();
    playBlip(150, 0.15, 0.25);
    resetBall(ball, width, height);
  }

  // -------------------------
  // PADDLE UPDATE
  // -------------------------
  updatePaddle(
    paddle,
    window.constrain(mouseX, 0, width),
    width
  );

  // Track player activity via paddle movement
  if (abs(paddle.speed) > 0.1) {
    lastInputTime = frameCount;
  }

  // -------------------------
  // PADDLE HIT
  // -------------------------
  if (paddleHitsBall(paddle, ball)) {
    ball.vy *= -1;
    ball.vx += paddle.speed * 0.03;
    ball.vx = window.constrain(
      ball.vx,
      -BALL_CONFIG.maxSpeed,
      BALL_CONFIG.maxSpeed
    );

    registerHit(gameState);
    updateEmotion(
      "hit",
      gameState.score,
      gameState.misses
    );
    applyHitJuice();
    playBlip(600, 0.04, 0.2);

    if (window.random() < 0.3) {
      triggerDialogue("hit", getEmotion());
    }
  }

  // -------------------------
  // DANGER AWARENESS
  // -------------------------
  if (
    ball.y >
      height - UI_CONFIG.dialogueHeight - 60 &&
    window.random() < 0.01
  ) {
    updateEmotion(
      "danger",
      gameState.score,
      gameState.misses
    );
    triggerDialogue("danger", getEmotion(), 90);
  }

  // -------------------------
  // RENDER GAME OBJECTS
  // -------------------------
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

  // -------------------------
  // UI
  // -------------------------
  renderHUD(gameState);
  renderDialogue(getDialogueState(), width);

  // -------------------------
  // ARCADE / LO-FI EFFECTS
  // -------------------------
  renderScanlines(width, height);
  renderVignette(width, height);
};

// -------------------------
// AUDIO + INPUT
// -------------------------
window.mousePressed = function () {
  lastInputTime = frameCount;
  startAudio();
};
