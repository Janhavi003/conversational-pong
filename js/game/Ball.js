import { BALL_CONFIG, UI_CONFIG } from "../config.js";

export function createBall(canvasWidth, canvasHeight) {
  return {
    x: canvasWidth / 2,
    y: (canvasHeight - UI_CONFIG.dialogueHeight) / 2,
    radius: BALL_CONFIG.radius,
    vx: BALL_CONFIG.baseVX,
    vy: BALL_CONFIG.baseVY,
    pulse: 0,
  };
}

export function updateBall(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
}

export function resetBall(ball, canvasWidth, canvasHeight) {
  ball.x = canvasWidth / 2;
  ball.y = (canvasHeight - UI_CONFIG.dialogueHeight) / 2;
  ball.vx = window.random(-2, 2); 
  ball.vy = BALL_CONFIG.baseVY;
  ball.pulse = 10;
}
