import { initFPSMetering } from './fps';
import { SECOND_IN_MS } from './time';
import { wait } from '../testing/wait';

it('returns set of FPS statistics as NaN if immediately reported', async () => {
  const { fps, stop } = initFPSMetering();
  const fpsResults = fps();
  expect(fpsResults.median).toBeNaN();
  expect(fpsResults.average).toBeNaN();
  stop();
});

it('returns numerical values for median and average', async () => {
  const { fps, stop } = initFPSMetering();
  await wait(SECOND_IN_MS);
  const fpsResults = fps();
  expect(fpsResults.median).toBeGreaterThan(0);
  expect(fpsResults.average).toBeGreaterThan(0);
  stop();
});

it('resets measurements on calling reset', async () => {
  const { fps, stop, reset } = initFPSMetering();
  await wait(SECOND_IN_MS);
  reset();
  const fpsResults = fps();
  expect(fpsResults.median).toBeNaN();
  expect(fpsResults.average).toBeNaN();
  stop();
});
