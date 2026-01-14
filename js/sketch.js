let ball;

function setup() {
  createCanvas(800, 500);

  ball = {
    x: width / 2,
    y: height / 2,
    radius: 8,
    vx: 4,
    vy: 3,
    pulse: 0,
  };
}

function draw() {
  background(20);

  // --- Ball movement ---
  ball.x += ball.vx;
  ball.y += ball.vy;

  // --- Wall collision (top & bottom) ---
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
    ball.vy *= -1;
    ball.pulse = 4;
  }

  // --- Pulse easing ---
  ball.pulse = lerp(ball.pulse, 0, 0.1);

  // --- Draw ball ---
  noStroke();
  fill(255);
  circle(
    ball.x,
    ball.y,
    (ball.radius + ball.pulse) * 2
  );

  // --- Debug: center crosshair ---
  stroke(255, 50);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  // --- Debug text ---
  noStroke();
  fill(180);
  textSize(12);
  text(`FPS: ${nf(frameRate(), 2, 1)}`, 10, 20);
  text(`vx: ${ball.vx}, vy: ${ball.vy}`, width - 120, 20);
}

function mousePressed() {
  console.log("mouse pressed at", mouseX, mouseY);
}
