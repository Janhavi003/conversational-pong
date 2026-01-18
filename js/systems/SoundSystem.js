// =========================
// SOUND SYSTEM
// =========================
let blip;
let audioStarted = false;

// =========================
// PUBLIC API
// =========================
export function initSound() {
  blip = new p5.Oscillator("sine");
  blip.freq(440);
  blip.amp(0);
  blip.start();
}

export function startAudio() {
  if (!audioStarted) {
    window.userStartAudio();
    audioStarted = true;
  }
}

export function playBlip(freq = 440, duration = 0.05, amp = 0.3) {
  if (!audioStarted) return;

  blip.freq(freq);
  blip.amp(amp, 0.01);

  setTimeout(() => {
    blip.amp(0, 0.05);
  }, duration * 1000);
}
