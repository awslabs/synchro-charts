import { pixelDensity } from './pixelDensity';

const SIZE = {
  width: 100,
  height: 200,
};

it('returns correct x pixel density', () => {
  const viewport = {
    start: new Date(2000, 0, 0),
    end: new Date(2001, 0, 0),
    yMin: 0,
    yMax: 100,
  };

  const { x } = pixelDensity({ viewport, size: SIZE, toClipSpace: t => t });

  expect(x).toEqual((viewport.end.getTime() - viewport.start.getTime()) / SIZE.width);
});

it('returns correct x pixel density with a non-identity clip space conversion', () => {
  const viewport = {
    start: new Date(2000, 0, 0),
    end: new Date(2001, 0, 0),
    yMin: 0,
    yMax: 100,
  };

  const { x } = pixelDensity({ viewport, size: SIZE, toClipSpace: t => t * 2 });

  expect(x).toEqual((2 * viewport.end.getTime() - 2 * viewport.start.getTime()) / SIZE.width);
});

it('returns correct y pixel density', () => {
  const viewport = {
    start: new Date(2000, 0, 0),
    end: new Date(2001, 0, 0),
    yMin: 0,
    yMax: 100,
  };

  const { y } = pixelDensity({ viewport, size: SIZE, toClipSpace: t => t });

  expect(y).toEqual((viewport.yMax - viewport.yMin) / SIZE.height);
});

it('returns zero for pixel densities when viewport has no area', () => {
  const viewport = {
    start: new Date(2000, 0, 0),
    end: new Date(2000, 0, 0),
    yMin: 100,
    yMax: 100,
  };

  const { x, y } = pixelDensity({ viewport, size: SIZE, toClipSpace: t => t });

  expect(x).toEqual(0);
  expect(y).toEqual(0);
});

it('returns infinity for pixel densities when container has no width or height', () => {
  // NOTE: I'm unsure if this is how we actually want to handle this edge case, but want to have this behavior
  // documented in the test suite.
  const viewport = {
    start: new Date(2000, 0, 0),
    end: new Date(2001, 0, 0),
    yMin: 0,
    yMax: 100,
  };

  const { x, y } = pixelDensity({ viewport, size: { width: 0, height: 0 }, toClipSpace: t => t });

  expect(x).toEqual(Infinity);
  expect(y).toEqual(Infinity);
});
