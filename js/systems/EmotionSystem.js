// =========================
// EMOTION SYSTEM
// =========================
let emotion = {
  current: "calm",
  timer: 0,
};

// =========================
// PUBLIC API
// =========================
export function updateEmotion(eventType, score, misses) {
  switch (eventType) {
    case "miss":
      emotion.timer = 300;
      emotion.current =
        misses >= 3 ? "sarcastic" : "calm";
      break;

    case "hit":
      emotion.timer = 240;
      emotion.current =
        score >= 5 ? "encouraging" : "calm";
      break;

    case "danger":
      emotion.timer = 180;
      emotion.current = "tense";
      break;
  }
}

export function tickEmotion() {
  if (emotion.timer > 0) {
    emotion.timer--;
  } else {
    emotion.current = "calm";
  }
}

export function getEmotion() {
  return emotion.current;
}
