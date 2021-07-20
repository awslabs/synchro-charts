import { DataType } from '../../../utils/dataConstants';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import { calculateBucketIndex, HeatValueMap, addCount, calcHeatValues, calculateXBucketStart } from './heatmapUtil';
import { MONTH_IN_MS } from '../../../utils/time';

const VIEWPORT: ViewPort = {
  start: new Date('June 1, 2021 10:00:00'),
  end: new Date('June 3, 2022 21:00:00'),
  yMin: 0,
  yMax: 100,
};

const RESOLUTION: number = MONTH_IN_MS;
const START_TIME = VIEWPORT.start.getTime();

const DATA_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 100 };
const DATA_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS * 2, y: Math.random() * 100 };
const DATA_POINT_3: DataPoint = { x: START_TIME + MONTH_IN_MS * 5, y: Math.random() * 100 };
const DATA_POINT_4: DataPoint = { x: START_TIME, y: Math.random() * 100 };
const DATA_POINT_5: DataPoint = { x: START_TIME + MONTH_IN_MS * 10, y: Math.random() * 100 };

const DATA_SET_1 = [DATA_POINT_1, DATA_POINT_2, DATA_POINT_3];
const DATA_SET_2 = [DATA_POINT_3, DATA_POINT_4, DATA_POINT_5];

const DATASTREAM_1 = {
  id: 'data-stream-1',
  name: 'some name 1',
  resolution: RESOLUTION,
  data: DATA_SET_1,
  dataType: DataType.NUMBER,
};

const DATASTREAM_2 = {
  id: 'data-stream-2',
  name: 'some name 2',
  resolution: RESOLUTION,
  data: DATA_SET_2,
  dataType: DataType.NUMBER,
};

const START_TIME_EPOCH = calculateXBucketStart({ xValue: DATA_POINT_1.x, xAxisBucketRange: MONTH_IN_MS });
const START_TIME_EPOCH_1 = calculateXBucketStart({ xValue: START_TIME + MONTH_IN_MS, xAxisBucketRange: MONTH_IN_MS });
const START_TIME_EPOCH_2 = calculateXBucketStart({
  xValue: START_TIME + MONTH_IN_MS * 2,
  xAxisBucketRange: MONTH_IN_MS,
});
const START_TIME_EPOCH_5 = calculateXBucketStart({
  xValue: START_TIME + MONTH_IN_MS * 5,
  xAxisBucketRange: MONTH_IN_MS,
});
const START_TIME_EPOCH_10 = calculateXBucketStart({
  xValue: START_TIME + MONTH_IN_MS * 10,
  xAxisBucketRange: MONTH_IN_MS,
});

describe.each`
  yValue | yMax   | yMin  | bucketIndex
  ${100} | ${100} | ${0}  | ${10}
  ${62}  | ${100} | ${0}  | ${7}
  ${10}  | ${15}  | ${5}  | ${5}
  ${12}  | ${15}  | ${5}  | ${7}
  ${-4}  | ${5}   | ${-5} | ${1}
  ${4}   | ${5}   | ${-5} | ${9}
`('calculateBucketIndex', ({ yValue, yMax, yMin, bucketIndex }) => {
  test(`bucket index for ${yValue} with yMax: ${yMax} and yMin: ${yMin}`, () => {
    expect(calculateBucketIndex({ yValue, yMax, yMin })).toBe(bucketIndex);
  });
});

describe.each`
  xValue                          | xAxisBucketRange | bucketRangeStart
  ${START_TIME}                   | ${MONTH_IN_MS}   | ${1620000000000}
  ${START_TIME + MONTH_IN_MS * 2} | ${MONTH_IN_MS}   | ${1625184000000}
  ${START_TIME + MONTH_IN_MS * 5} | ${MONTH_IN_MS}   | ${1632960000000}
`('calculateXBucketStart', ({ xValue, xAxisBucketRange, bucketRangeStart }) => {
  test(`bucket range start for ${xValue}`, () => {
    expect(calculateXBucketStart({ xValue, xAxisBucketRange })).toBe(bucketRangeStart);
  });
});

describe('addCount', () => {
  it('returns aggregated data for one data point', () => {
    const newHeatValue = addCount({
      heatValue: {},
      xBucketRangeStart: START_TIME_EPOCH,
      bucketIndex: 1,
      dataStreamId: DATASTREAM_1.id,
    });
    expect(newHeatValue).toEqual({
      [START_TIME_EPOCH]: {
        1: {
          totalCount: 1,
          streamCount: {
            [DATASTREAM_1.id]: 1,
          },
        },
      },
    });
  });

  it('returns aggregated data for multiple calls with the same heatValueMap object passed in', () => {
    let heatValue: HeatValueMap = {};
    heatValue = addCount({
      heatValue,
      xBucketRangeStart: START_TIME_EPOCH,
      bucketIndex: 1,
      dataStreamId: DATASTREAM_1.id,
    });
    heatValue = addCount({
      heatValue,
      xBucketRangeStart: START_TIME_EPOCH,
      bucketIndex: 2,
      dataStreamId: DATASTREAM_1.id,
    });
    heatValue = addCount({
      heatValue,
      xBucketRangeStart: START_TIME_EPOCH_1,
      bucketIndex: 5,
      dataStreamId: DATASTREAM_1.id,
    });
    heatValue = addCount({
      heatValue,
      xBucketRangeStart: START_TIME_EPOCH,
      bucketIndex: 1,
      dataStreamId: DATASTREAM_2.id,
    });
    heatValue = addCount({
      heatValue,
      xBucketRangeStart: START_TIME_EPOCH_1,
      bucketIndex: 6,
      dataStreamId: DATASTREAM_2.id,
    });

    expect(heatValue).toEqual({
      [START_TIME_EPOCH]: {
        1: {
          totalCount: 2,
          streamCount: {
            [DATASTREAM_1.id]: 1,
            [DATASTREAM_2.id]: 1,
          },
        },
        2: {
          totalCount: 1,
          streamCount: {
            [DATASTREAM_1.id]: 1,
          },
        },
      },
      [START_TIME_EPOCH_1]: {
        5: {
          totalCount: 1,
          streamCount: {
            [DATASTREAM_1.id]: 1,
          },
        },
        6: {
          totalCount: 1,
          streamCount: {
            [DATASTREAM_2.id]: 1,
          },
        },
      },
    });
  });
});

describe('calcHeatValues', () => {
  it('returns aggregated data for dataStreams with different x-axis bucket ranges', () => {
    const dataStreams: DataStream[] = [DATASTREAM_1, DATASTREAM_2];
    const newHeatValue = calcHeatValues({ oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewport: VIEWPORT });
    expect(newHeatValue).toEqual({
      [START_TIME_EPOCH]: expect.any(Object),
      [START_TIME_EPOCH_2]: expect.any(Object),
      [START_TIME_EPOCH_5]: expect.any(Object),
      [START_TIME_EPOCH_10]: expect.any(Object),
    });
  });

  it('returns empty when given non-number datatype', () => {
    const DATASTREAM = {
      id: 'data-stream-1',
      name: 'some name 1',
      resolution: RESOLUTION,
      data: DATA_SET_1,
      dataType: DataType.STRING,
    };
    const dataStreams: DataStream[] = [DATASTREAM];
    const newHeatValue = calcHeatValues({ oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewport: VIEWPORT });
    expect(newHeatValue).toEqual({});
  });
});
