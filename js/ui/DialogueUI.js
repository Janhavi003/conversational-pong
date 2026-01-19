import { UI_CONFIG } from "../config.js";

export function renderDialogue(dialogueState, canvasWidth) {
  if (!dialogueState.visible) return;

  fill(220);
  textSize(18);
  textAlign(CENTER, CENTER);

  text(
    dialogueState.text,
    canvasWidth / 2,
    UI_CONFIG.dialogueHeight / 2 + dialogueState.yOffset
  );
}
