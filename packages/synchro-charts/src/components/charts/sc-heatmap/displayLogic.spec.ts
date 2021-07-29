import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { HeatmapColorPalette, getXBucketWidth, getBucketColor, getSequential, getYBucketHeight } from './displayLogic';
import { NUM_OF_COLORS_SEQUENTIAL } from './heatmapConstants';
import { MONTH_IN_MS, DAY_IN_MS } from '../../../utils/time';

const VIEW_PORT = { start: new Date(2000, 0), end: new Date(2000, 1, 0), yMin: 0, yMax: 100 };
const toClipSpace = clipSpaceConversion(VIEW_PORT);
const COLOR_PALLETE: HeatmapColorPalette = getSequential();

const TOTAL_NUM_POINTS_MIN = DAY_IN_MS / 1000;
const THREE_DATA_STREAM = 3;
const TOTAL_POSSIBLE_POINT = TOTAL_NUM_POINTS_MIN * THREE_DATA_STREAM;

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
  it('returns a color palette', () => {
    expect(COLOR_PALLETE.r.length).toBe(NUM_OF_COLORS_SEQUENTIAL);
    expect(COLOR_PALLETE.g.length).toBe(NUM_OF_COLORS_SEQUENTIAL);
    expect(COLOR_PALLETE.b.length).toBe(NUM_OF_COLORS_SEQUENTIAL);
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
