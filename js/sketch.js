function setup() {
  createCanvas(800, 500);
}

function draw() {
  background(20);

  // center crosshair
  stroke(255, 50);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  // frame rate monitor
  noStroke();
  fill(180);
  textSize(12);
  text(`FPS: ${nf(frameRate(), 2, 1)}`, 10, 20);
}
function mousePressed() {
  console.log("mouse pressed at", mouseX, mouseY);
}
