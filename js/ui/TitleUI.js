import { UI_CONFIG } from "../config.js";

// Internal idle animation state
let flickerPhase = 0;
let pulsePhase = 0;

// Emotion → color mapping
function getEmotionColor(emotion) {
  switch (emotion) {
    case "encouraging":
      return color(180, 220, 180);
    case "sarcastic":
      return color(220, 190, 120);
    case "tense":
      return color(220, 140, 140);
    default:
      return color(200);
  }
}

export function renderTitle({
  canvasWidth,
  emotion,
  isIdle,
  frameCount,
}) {
  // ---------------------------------
  // IDLE ANIMATION PHASES
  // ---------------------------------
  if (isIdle) {
    flickerPhase += 0.002; // VERY slow
    pulsePhase += 0.01;
  } else {
    flickerPhase *= 0.9;
    pulsePhase *= 0.9;
  }

  // Flicker alpha (subtle)
  const flicker =
    isIdle
      ? map(
          noise(flickerPhase),
          0,
          1,
          0.85,
          1
        )
      : 1;

  // Pulse scale (attract mode)
  const pulse =
    isIdle
      ? 1 + sin(pulsePhase) * 0.02
      : 1;

  const baseColor = getEmotionColor(emotion);

  push();
  translate(canvasWidth / 2, UI_CONFIG.dialogueHeight / 2 - 28);
  scale(pulse);

  textAlign(CENTER, CENTER);
  textSize(26);
  textStyle(BOLD);

  // ---------------------------------
  // GLOW (layered text)
  // ---------------------------------
  for (let i = 4; i > 0; i--) {
    fill(
      red(baseColor),
      green(baseColor),
      blue(baseColor),
      20 * flicker
    );
    text("CONVERSATIONAL PONG", 0, 0);
  }

  // ---------------------------------
  // MAIN TITLE TEXT
  // ---------------------------------
  fill(
    red(baseColor),
    green(baseColor),
    blue(baseColor),
    255 * flicker
  );
  text("CONVERSATIONAL PONG", 0, 0);

  // ---------------------------------
  // UNDERLINE
  // ---------------------------------
  stroke(100, 150 * flicker);
  line(-150, 14, 150, 14);
  noStroke();

  pop();
}
