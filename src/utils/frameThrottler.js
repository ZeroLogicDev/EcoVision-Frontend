/**
 * Frame throttler — limits frame capture rate for live streaming.
 */
export function createFrameThrottler(targetFPS = 5) {
  let lastFrameTime = 0;
  const interval = 1000 / targetFPS;

  return {
    shouldCapture() {
      const now = performance.now();
      if (now - lastFrameTime >= interval) {
        lastFrameTime = now;
        return true;
      }
      return false;
    },

    setFPS(newFPS) {
      // Will be used when scaling to 10 FPS
      return createFrameThrottler(newFPS);
    },

    get currentFPS() {
      return targetFPS;
    },
  };
}
