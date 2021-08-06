import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { HeatmapColorPalette, getXBucketWidth, getBucketColor, getSequential, getYBucketHeight } from './displayLogic';
import { MONTH_IN_MS } from '../../../utils/time';
import { HeatValueMap } from './heatmapUtil';
import { MAX_NUM_OF_COLORS_SEQUENTIAL } from './heatmapConstants';

const VIEW_PORT = { start: new Date(2000, 0), end: new Date(2000, 1, 0), yMin: 0, yMax: 100 };
const toClipSpace = clipSpaceConversion(VIEW_PORT);

describe('getXBucketWidth', () => {
  it('width of the bar is in between the view port', () => {
    const barWidth = getXBucketWidth({
      toClipSpace,
      xBucketRange: MONTH_IN_MS,
    });
    expect(barWidth).toBeGreaterThanOrEqual(toClipSpace(VIEW_PORT.start.getTime()));
    expect(barWidth).toBeLessThanOrEqual(toClipSpace(VIEW_PORT.end.getTime()));
  });
});

describe.each`
  yMin    | yMax   | yBucketHeight
  ${0}    | ${100} | ${9.33}
  ${0}    | ${50}  | ${4.66}
  ${-20}  | ${40}  | ${5.6}
  ${-100} | ${0}   | ${9.33}
`('getYBucketHeight', ({ yMin, yMax, yBucketHeight }) => {
  test(`y bucket height for yMin: ${yMin} and yMax: ${yMax}`, () => {
    expect(getYBucketHeight({ ...VIEW_PORT, yMin, yMax })).toBeCloseTo(yBucketHeight, 0);
  });
});

describe('getSequential', () => {
  it('returns a color palette with 1 color', () => {
    const tempHeatValues: HeatValueMap = { minHeatValue: 1, maxHeatValue: 1 };
    const colorPalette = getSequential(tempHeatValues);
    expect(colorPalette.r.length).toBe(1);
    expect(colorPalette.g.length).toBe(1);
    expect(colorPalette.b.length).toBe(1);
  });

  it('returns a color palette with 2 colors', () => {
    const tempHeatValues: HeatValueMap = { minHeatValue: 1, maxHeatValue: 2 };
    const colorPalette = getSequential(tempHeatValues);
    expect(colorPalette.r.length).toBe(2);
    expect(colorPalette.g.length).toBe(2);
    expect(colorPalette.b.length).toBe(2);
  });

  it('returns a color palette with 4 colors', () => {
    const tempHeatValues: HeatValueMap = { minHeatValue: 1, maxHeatValue: 4 };
    const colorPalette = getSequential(tempHeatValues);
    expect(colorPalette.r.length).toBe(4);
    expect(colorPalette.g.length).toBe(4);
    expect(colorPalette.b.length).toBe(4);
  });

  it('returns a color palette with 7 colors', () => {
    const tempHeatValues: HeatValueMap = { minHeatValue: 1, maxHeatValue: 7 };
    const colorPalette = getSequential(tempHeatValues);
    expect(colorPalette.r.length).toBe(7);
    expect(colorPalette.g.length).toBe(7);
    expect(colorPalette.b.length).toBe(7);
  });

  it('returns a color palette with maximum number of colors', () => {
    const tempHeatValues: HeatValueMap = { minHeatValue: 1, maxHeatValue: 10 };
    const colorPalette = getSequential(tempHeatValues);
    expect(colorPalette.r.length).toBe(MAX_NUM_OF_COLORS_SEQUENTIAL);
    expect(colorPalette.g.length).toBe(MAX_NUM_OF_COLORS_SEQUENTIAL);
    expect(colorPalette.b.length).toBe(MAX_NUM_OF_COLORS_SEQUENTIAL);
  });
});

describe('getBucketColor', () => {
  it('returns lowest opacity', () => {
    const tempHeatValues: HeatValueMap = {
      minHeatValue: 1,
      maxHeatValue: 10,
      '123': {
        '1': {
          bucketHeatValue: 1,
          streamCount: {
            'data-stream-1': 1,
          },
        },
      },
    };
    const colorPalette: HeatmapColorPalette = getSequential(tempHeatValues);

    const lowestOpacityRGB = [colorPalette.r[0], colorPalette.g[0], colorPalette.b[0]];
    const rgb = getBucketColor({ heatValues: tempHeatValues, xBucket: '123', yBucket: '1', colorPalette });
    expect(rgb).toEqual(lowestOpacityRGB);
  });

  it('returns middle opacity', () => {
    const tempHeatValues: HeatValueMap = {
      minHeatValue: 1,
      maxHeatValue: 9,
      '123': {
        '1': {
          bucketHeatValue: 4,
          streamCount: {
            'data-stream-1': 4,
          },
        },
      },
    };
    const colorPalette: HeatmapColorPalette = getSequential(tempHeatValues);

    const midOpacityRGB = [colorPalette.r[3], colorPalette.g[3], colorPalette.b[3]];
    const rgb = getBucketColor({ heatValues: tempHeatValues, xBucket: '123', yBucket: '1', colorPalette });
    expect(rgb).toEqual(midOpacityRGB);
  });

  it('returns darkest opacity', () => {
    const tempHeatValues: HeatValueMap = {
      minHeatValue: 1,
      maxHeatValue: 9,
      '123': {
        '1': {
          bucketHeatValue: 9,
          streamCount: {
            'data-stream-1': 9,
          },
        },
      },
    };
    const colorPalette: HeatmapColorPalette = getSequential(tempHeatValues);

    const midOpacityRGB = [colorPalette.r[7], colorPalette.g[7], colorPalette.b[7]];
    const rgb = getBucketColor({ heatValues: tempHeatValues, xBucket: '123', yBucket: '1', colorPalette });
    expect(rgb).toEqual(midOpacityRGB);
  });
});
