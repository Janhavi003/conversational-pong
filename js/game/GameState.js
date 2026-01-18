export function createGameState() {
  return {
    score: 0,
    misses: 0,
  };
}

export function registerHit(state) {
  state.score++;
}

export function registerMiss(state) {
  state.misses++;
}
