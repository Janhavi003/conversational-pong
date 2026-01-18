// =========================
// DIALOGUE SYSTEM
// =========================
let dialogue = {
  text: "",
  visible: false,
  timer: 0,
  cooldown: 0,
  yOffset: -20,
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

function randomFrom(arr) {
  const index = Math.floor(
    window.random(0, arr.length)
  );
  return arr[index];
}


// =========================
// PUBLIC API
// =========================
export function updateDialogue() {
  if (dialogue.timer > 0) {
    dialogue.timer--;
  } else {
    dialogue.visible = false;
  }

  if (dialogue.cooldown > 0) {
    dialogue.cooldown--;
  }

  dialogue.yOffset += (0 - dialogue.yOffset) * 0.1;

}

export function triggerDialogue(type, emotion, duration = 120) {
  if (dialogue.cooldown > 0) return;

  const emotionalSet = DIALOGUE_POOL[type];
  if (!emotionalSet) return;

  const options =
    emotionalSet[emotion] || emotionalSet.calm;

  if (!options || options.length === 0) return;

  dialogue.text = randomFrom(options);
  dialogue.visible = true;
  dialogue.timer = duration;
  dialogue.cooldown = 180;
  dialogue.yOffset = -20;
}

export function getDialogueState() {
  return dialogue;
}
