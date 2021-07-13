import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { getBarWidth, getBucketColor, getSequential } from './displayLogic';
import { DataStream } from '../../../utils/dataTypes';
import { MONTH_IN_MS, DAY_IN_MS } from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';

const VIEW_PORT = { start: new Date(2000, 0), end: new Date(2000, 1, 0), yMin: 0, yMax: 100 };
const toClipSpace = clipSpaceConversion(VIEW_PORT);
const COLOR_ARRAY = [
  [204, 153, 102, 50.999999999999986, 0, 0, 0, 0],
  [227, 199, 171, 143, 115, 92, 69, 46],
  [241.4, 227.8, 214.2, 200.59999999999997, 187, 149.6, 112.2, 74.8],
];

const TOTAL_NUM_POINTS_MIN = DAY_IN_MS / 1000;
const THREE_DATA_STREAM = 3;
const TOTAL_POSSIBLE_POINT = TOTAL_NUM_POINTS_MIN * THREE_DATA_STREAM;

describe('getBarWidth', () => {
  it('with of the bar is in between the view port', () => {
    const DATA_STREAM: DataStream[] = [
      {
        id: '1',
        name: 'some name',
        resolution: MONTH_IN_MS,
        data: [],
        dataType: DataType.NUMBER,
      },
    ];
    const barWidth = getBarWidth({
      numDataStreams: DATA_STREAM.length,
      toClipSpace,
      resolution: MONTH_IN_MS,
    });
    expect(barWidth).toBeGreaterThanOrEqual(toClipSpace(VIEW_PORT.start.getTime()));
    expect(barWidth).toBeLessThanOrEqual(toClipSpace(VIEW_PORT.end.getTime()));
  });
});

describe('getSequential', () => {
  it('returns a blue sequential color palette', () => {
    const colorArray = getSequential('#ffffff', '#0073bb');
    expect(colorArray).toEqual(COLOR_ARRAY);
  });
});

describe('getBucketColor', () => {
  it('returns lowest opacity', () => {
    const lowestOpacityRGB = [COLOR_ARRAY[0][0], COLOR_ARRAY[1][0], COLOR_ARRAY[2][0]];
    let rgb = getBucketColor(COLOR_ARRAY, 1, TOTAL_POSSIBLE_POINT);
    expect(rgb).toEqual(lowestOpacityRGB);
    rgb = getBucketColor(COLOR_ARRAY, TOTAL_POSSIBLE_POINT / 8 - 1, TOTAL_POSSIBLE_POINT);
    expect(rgb).toEqual(lowestOpacityRGB);

    const midOpacityRGB = [COLOR_ARRAY[0][4], COLOR_ARRAY[1][4], COLOR_ARRAY[2][4]];
    rgb = getBucketColor(COLOR_ARRAY, TOTAL_POSSIBLE_POINT / 8 * 4 + 1, TOTAL_POSSIBLE_POINT);
    expect(rgb).toEqual(midOpacityRGB);
    rgb = getBucketColor(COLOR_ARRAY, (TOTAL_POSSIBLE_POINT / 8) * 5 - 1, TOTAL_POSSIBLE_POINT);
    expect(rgb).toEqual(midOpacityRGB);
  });
});
