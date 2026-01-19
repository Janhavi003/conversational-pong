import { UI_CONFIG } from "../config.js";

export function renderTitle(canvasWidth) {
  fill(200);
  textAlign(CENTER, CENTER);
  textSize(26);
  textStyle(BOLD);

  // Title ABOVE the dialogue box
  text(
    "CONVERSATIONAL PONG",
    canvasWidth / 2,
    UI_CONFIG.dialogueHeight / 2 - 28
  );

  // Subtle underline (hardware label feel)
  stroke(90);
  line(
    canvasWidth / 2 - 150,
    UI_CONFIG.dialogueHeight / 2 - 14,
    canvasWidth / 2 + 150,
    UI_CONFIG.dialogueHeight / 2 - 14
  );

  noStroke();
}
