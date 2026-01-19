import { UI_CONFIG } from "../config.js";

export function renderHUD(gameState) {
  fill(180);
  textSize(12);
  textAlign(LEFT);

  text(
    `score: ${gameState.score}`,
    10,
    UI_CONFIG.dialogueHeight + 20
  );

  text(
    `misses: ${gameState.misses}`,
    10,
    UI_CONFIG.dialogueHeight + 40
  );
}
