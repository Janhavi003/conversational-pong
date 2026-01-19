import { UI_CONFIG } from "../config.js";

export function renderDialogue(dialogueState, canvasWidth) {
  if (!dialogueState.visible) return;

  fill(220);
  textSize(16);
  textAlign(CENTER, CENTER);

  // Dialogue sits LOWER than the title
  text(
    dialogueState.text,
    canvasWidth / 2,
    UI_CONFIG.dialogueHeight / 2 + 18 + dialogueState.yOffset
  );
}
