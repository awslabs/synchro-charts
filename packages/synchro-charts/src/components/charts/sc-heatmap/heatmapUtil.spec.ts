import { DataType } from '../../../utils/dataConstants';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import {
  calculateBucketIndex,
  HeatValueMap,
  addCount,
  calcHeatValues,
  calculateXBucketStart,
  getXBucketRange,
  displayDate,
  shouldRerenderOnViewportChange,
} from './heatmapUtil';
import { DAY_IN_MS, HOUR_IN_MS, MINUTE_IN_MS, MONTH_IN_MS, SECOND_IN_MS } from '../../../utils/time';
import { BUCKET_COUNT } from './heatmapConstants';

const VIEWPORT: ViewPort = {
  start: new Date('June 1, 2021 10:00:00'),
  end: new Date('June 3, 2022 21:00:00'),
  yMin: 0,
  yMax: 100,
};

const X_BUCKET_RANGE: number = MONTH_IN_MS;
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
  resolution: X_BUCKET_RANGE,
  data: DATA_SET_1,
  dataType: DataType.NUMBER,
};

const DATASTREAM_2 = {
  id: 'data-stream-2',
  name: 'some name 2',
  resolution: X_BUCKET_RANGE,
  data: DATA_SET_2,
  dataType: DataType.NUMBER,
};

const START_TIME_EPOCH = calculateXBucketStart({ xValue: DATA_POINT_1.x, xBucketRange: MONTH_IN_MS });
const START_TIME_EPOCH_1 = calculateXBucketStart({ xValue: START_TIME + MONTH_IN_MS, xBucketRange: MONTH_IN_MS });
const START_TIME_EPOCH_2 = calculateXBucketStart({
  xValue: START_TIME + MONTH_IN_MS * 2,
  xBucketRange: MONTH_IN_MS,
});
const START_TIME_EPOCH_5 = calculateXBucketStart({
  xValue: START_TIME + MONTH_IN_MS * 5,
  xBucketRange: MONTH_IN_MS,
});
const START_TIME_EPOCH_10 = calculateXBucketStart({
  xValue: START_TIME + MONTH_IN_MS * 10,
  xBucketRange: MONTH_IN_MS,
});

describe.each`
  yValue | yMax   | yMin  | bucketCount | bucketIndex
  ${100} | ${100} | ${0}  | ${10}       | ${10}
  ${62}  | ${100} | ${0}  | ${10}       | ${6}
  ${10}  | ${15}  | ${5}  | ${10}       | ${5}
  ${12}  | ${15}  | ${5}  | ${10}       | ${7}
  ${-4}  | ${5}   | ${-5} | ${10}       | ${1}
  ${4}   | ${5}   | ${-5} | ${10}       | ${9}
  ${0}   | ${10}  | ${0}  | ${10}       | ${0}
  ${10}  | ${10}  | ${0}  | ${10}       | ${10}
  ${-5}  | ${5}   | ${-5} | ${10}       | ${0}
`('calculateBucketIndex', ({ yValue, yMax, yMin, bucketCount, bucketIndex }) => {
  test(`bucket index for ${yValue} with yMax: ${yMax} and yMin: ${yMin}`, () => {
    expect(calculateBucketIndex({ yValue, yMax, yMin, bucketCount })).toBe(bucketIndex);
  });
});

describe.each`
  xValue                          | xBucketRange   | bucketRangeStart
  ${START_TIME}                   | ${MONTH_IN_MS} | ${1620000000000}
  ${START_TIME + MONTH_IN_MS * 2} | ${MONTH_IN_MS} | ${1625184000000}
  ${START_TIME + MONTH_IN_MS * 5} | ${MONTH_IN_MS} | ${1632960000000}
`('calculateXBucketStart', ({ xValue, xBucketRange, bucketRangeStart }) => {
  test(`bucket range start for ${xValue}`, () => {
    expect(calculateXBucketStart({ xValue, xBucketRange })).toBe(bucketRangeStart);
  });
});

describe('addCount', () => {
  it('returns aggregated data for one data point', () => {
    const newHeatValue = addCount({
      heatValues: {},
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
    let heatValues: HeatValueMap = {};
    heatValues = addCount({
      heatValues,
      xBucketRangeStart: START_TIME_EPOCH,
      bucketIndex: 1,
      dataStreamId: DATASTREAM_1.id,
    });
    heatValues = addCount({
      heatValues,
      xBucketRangeStart: START_TIME_EPOCH,
      bucketIndex: 2,
      dataStreamId: DATASTREAM_1.id,
    });
    heatValues = addCount({
      heatValues,
      xBucketRangeStart: START_TIME_EPOCH_1,
      bucketIndex: 5,
      dataStreamId: DATASTREAM_1.id,
    });
    heatValues = addCount({
      heatValues,
      xBucketRangeStart: START_TIME_EPOCH,
      bucketIndex: 1,
      dataStreamId: DATASTREAM_2.id,
    });
    heatValues = addCount({
      heatValues,
      xBucketRangeStart: START_TIME_EPOCH_1,
      bucketIndex: 6,
      dataStreamId: DATASTREAM_2.id,
    });

    expect(heatValues).toEqual({
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
    const newHeatValue = calcHeatValues({
      oldHeatValues: {},
      dataStreams,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEWPORT,
      bucketCount: BUCKET_COUNT,
    });
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
      resolution: X_BUCKET_RANGE,
      data: DATA_SET_1,
      dataType: DataType.STRING,
    };
    const dataStreams: DataStream[] = [DATASTREAM];
    const newHeatValue = calcHeatValues({
      oldHeatValues: {},
      dataStreams,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEWPORT,
      bucketCount: BUCKET_COUNT,
    });
    expect(newHeatValue).toEqual({});
  });
});

describe.each`
  start                      | end                              | xBucketRange
  ${new Date(2000, 0, 0, 0)} | ${new Date(2000, 0, 0, 0, 0, 1)} | ${SECOND_IN_MS}
  ${new Date(2000, 0, 0, 0)} | ${new Date(2000, 0, 0, 0, 3)}    | ${MINUTE_IN_MS}
  ${new Date(2000, 0, 0, 0)} | ${new Date(2000, 0, 0, 3)}       | ${HOUR_IN_MS}
  ${new Date(2000, 0, 0, 0)} | ${new Date(2000, 0, 4)}          | ${DAY_IN_MS}
  ${new Date(2000, 0, 0, 0)} | ${new Date(2000, 5, 0)}          | ${MONTH_IN_MS}
`('getXBucketRange', ({ start, end, xBucketRange }) => {
  test(`x bucket range for start: ${start} and end: ${end}`, () => {
    expect(getXBucketRange({ start, end })).toBe(xBucketRange);
  });
});

describe('displayDate', () => {
  it('returns date range in month, date, year', () => {
    const dates = [new Date(2000, 0, 0), new Date(2000, 0, 4)];
    const start = new Date(2000, 0, 0);
    const end = new Date(2000, 0, 10);
    expect(displayDate(dates, { start, end })).toEqual('12/31/1999 - 1/4/2000');
  });

  it('returns date range in month, day, hour', () => {
    const dates = [new Date(2000, 0, 0), new Date(2000, 0, 4)];
    const start = new Date(2000, 0, 0);
    const end = new Date(2000, 0, 5);
    expect(displayDate(dates, { start, end })).toEqual('12/31, 12 AM - 1/4, 12 AM');
  });
});

describe('shouldRerenderOnViewportChange', () => {
  it('returns true on viewport yMin/Max change', () => {
    const oldViewport: ViewPort = { yMax: 100, yMin: 0, start: new Date(), end: new Date() };
    const newViewport: ViewPort = { yMax: 90, yMin: 0, start: new Date(), end: new Date() };
    expect(shouldRerenderOnViewportChange({ oldViewport, newViewport })).toBeTrue();
  });

  it('returns true on x bucket range change', () => {
    const oldViewport: ViewPort = { yMax: 100, yMin: 0, start: new Date(2000, 0, 0), end: new Date(2000, 0, 0, 0, 1) };
    const newViewport: ViewPort = { yMax: 100, yMin: 0, start: new Date(2000, 0, 0), end: new Date(2000, 0, 1) };
    expect(shouldRerenderOnViewportChange({ oldViewport, newViewport })).toBeTrue();
  });
});
