// =========================
// JUICE SYSTEM
// =========================
let shake = {
  intensity: 0,
};

let hitStop = 0;

// =========================
// PUBLIC API
// =========================
export function applyHitJuice() {
  shake.intensity = Math.max(shake.intensity, 6);
  hitStop = 3;
}

export function applyMissJuice() {
  shake.intensity = Math.max(shake.intensity, 10);
  hitStop = 6;
}

export function applyWallJuice() {
  shake.intensity = Math.max(shake.intensity, 2);
}

export function updateJuice() {
  shake.intensity = window.lerp(shake.intensity, 0, 0.2);

  if (hitStop > 0) {
    hitStop--;
  }
}

export function shouldHitStop() {
  return hitStop > 0;
}

export function getCameraOffset(dialogueHeight = 0) {
  return {
    x: window.random(-shake.intensity, shake.intensity),
    y:
      window.random(-shake.intensity, shake.intensity) +
      dialogueHeight,
  };
}
