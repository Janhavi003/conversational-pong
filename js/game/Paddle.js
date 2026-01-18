import { PADDLE_CONFIG, UI_CONFIG } from "../config.js";

export function createPaddle(canvasWidth, canvasHeight) {
  return {
    x: canvasWidth / 2,
    y: canvasHeight - PADDLE_CONFIG.yOffset,
    width: PADDLE_CONFIG.width,
    height: PADDLE_CONFIG.height,
    speed: 0,
  };
}

export function updatePaddle(paddle, targetX, canvasWidth) {
  paddle.speed = targetX - paddle.x;
  paddle.x += paddle.speed * PADDLE_CONFIG.easing;

  paddle.x = window.constrain( 
    paddle.x,
    paddle.width / 2,
    canvasWidth - paddle.width / 2
  );
}

export function paddleHitsBall(paddle, ball) {
  return (
    ball.y + ball.radius >
      paddle.y - UI_CONFIG.dialogueHeight - paddle.height / 2 &&
    ball.x > paddle.x - paddle.width / 2 &&
    ball.x < paddle.x + paddle.width / 2 &&
    ball.vy > 0
  );
}
