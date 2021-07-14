import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { HeatmapColorPalette, getBucketWidth, getBucketColor, getSequential } from './displayLogic';
import { MONTH_IN_MS, DAY_IN_MS } from '../../../utils/time';

const VIEW_PORT = { start: new Date(2000, 0), end: new Date(2000, 1, 0), yMin: 0, yMax: 100 };
const toClipSpace = clipSpaceConversion(VIEW_PORT);
const COLOR_PALLETE: HeatmapColorPalette = {
  r: [204, 153, 102, 50.999999999999986, 0, 0, 0, 0],
  g: [227, 199, 171, 143, 115, 92, 69, 46],
  b: [241.4, 227.8, 214.2, 200.59999999999997, 187, 149.6, 112.2, 74.8],
};

const TOTAL_NUM_POINTS_MIN = DAY_IN_MS / 1000;
const THREE_DATA_STREAM = 3;
const TOTAL_POSSIBLE_POINT = TOTAL_NUM_POINTS_MIN * THREE_DATA_STREAM;

describe('getBucketWidth', () => {
  it('width of the bar is in between the view port', () => {
    const barWidth = getBucketWidth({
      numDataStreams: 1,
      toClipSpace,
      resolution: MONTH_IN_MS,
    });
    expect(barWidth).toBeGreaterThanOrEqual(toClipSpace(VIEW_PORT.start.getTime()));
    expect(barWidth).toBeLessThanOrEqual(toClipSpace(VIEW_PORT.end.getTime()));
  });
});

describe('getSequential', () => {
  it('returns a blue sequential color palette', () => {
    const colorArray = getSequential({ minColor: '#ffffff', maxColor: '#0073bb' });
    expect(colorArray).toEqual(COLOR_PALLETE);
  });
});

describe('getBucketColor', () => {
  it('returns lowest opacity', () => {
    const lowestOpacityRGB = [COLOR_PALLETE.r[0], COLOR_PALLETE.g[0], COLOR_PALLETE.b[0]];
    const rgb = getBucketColor(COLOR_PALLETE, TOTAL_POSSIBLE_POINT / 8 - 1, TOTAL_POSSIBLE_POINT);
    expect(rgb).toEqual(lowestOpacityRGB);
  });

  it('returns middle opacity', () => {
    const midOpacityRGB = [COLOR_PALLETE.r[4], COLOR_PALLETE.g[4], COLOR_PALLETE.b[4]];
    const rgb = getBucketColor(COLOR_PALLETE, (TOTAL_POSSIBLE_POINT / 8) * 5 - 1, TOTAL_POSSIBLE_POINT);
    expect(rgb).toEqual(midOpacityRGB);
  });

  it('returns darkest opacity', () => {
    const darkestOpacityRGB = [COLOR_PALLETE.r[7], COLOR_PALLETE.g[7], COLOR_PALLETE.b[7]];
    const rgb = getBucketColor(COLOR_PALLETE, TOTAL_POSSIBLE_POINT, TOTAL_POSSIBLE_POINT);
    expect(rgb).toEqual(darkestOpacityRGB);
  });
});
