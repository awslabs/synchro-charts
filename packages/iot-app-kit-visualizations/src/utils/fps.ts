import { SECOND_IN_MS } from './time';

const MAX_FPS_TRACKED = 80;

export const initFPSMetering = () => {
  let trackedFPS: number[] = [];
  let lastLoop = Date.now();
  let thisLoop = Date.now();
  let framesProcessed = 0;

  const loop = setInterval(() => {
    framesProcessed += 1;
  }, SECOND_IN_MS / MAX_FPS_TRACKED);

  const updateFPS = setInterval(() => {
    thisLoop = Date.now();
    const duration = (thisLoop - lastLoop) / SECOND_IN_MS;
    trackedFPS.push(framesProcessed / Math.max(duration, 0.005));
    lastLoop = thisLoop;
    framesProcessed = 0;
  }, SECOND_IN_MS / 4);

  return {
    reset: () => {
      framesProcessed = 0;
      thisLoop = Date.now();
      lastLoop = Date.now();
      trackedFPS = [];
    },
    fps: () => {
      const sortedFPS = [...trackedFPS].sort();
      const len = sortedFPS.length;
      const mid = Math.ceil(len / 2);
      const median = len % 2 === 0 ? (sortedFPS[mid] + sortedFPS[mid - 1]) / 2 : sortedFPS[mid - 1];
      const sum = sortedFPS.reduce((total, num) => total + num, 0);
      const average = sum / len;

      trackedFPS = [];
      return { average, median };
    },
    stop: () => {
      clearInterval(loop);
      clearInterval(updateFPS);
    },
  };
};
