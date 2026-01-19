export function renderScanlines(canvasWidth, canvasHeight) {
  stroke(0, 40);
  for (let y = 0; y < canvasHeight; y += 4) {
    line(0, y, canvasWidth, y);
  }
  noStroke();
}

export function renderVignette(canvasWidth, canvasHeight) {
  noFill();
  for (let i = 0; i < 60; i++) {
    stroke(0, i * 3);
    rect(
      -i,
      -i,
      canvasWidth + i * 2,
      canvasHeight + i * 2
    );
  }
  noStroke();
}

export function renderGrain(canvasWidth, canvasHeight) {
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    const noise = random(-8, 8);
    pixels[i] += noise;
    pixels[i + 1] += noise;
    pixels[i + 2] += noise;
  }
  updatePixels();
}
