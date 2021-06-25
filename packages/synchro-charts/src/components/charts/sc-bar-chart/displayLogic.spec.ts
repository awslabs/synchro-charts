import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { getBarWidth } from './displayLogic';
import { DataStream } from '../../../utils/dataTypes';
import { MONTH_IN_MS } from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';

const VIEW_PORT = { start: new Date(2000, 0), end: new Date(2000, 1, 0), yMin: 0, yMax: 100 };
const toClipSpace = clipSpaceConversion(VIEW_PORT);

describe('bar chart display logic', () => {
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
