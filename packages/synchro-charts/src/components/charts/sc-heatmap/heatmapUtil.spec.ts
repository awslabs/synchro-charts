import { DataType } from '../../../utils/dataConstants';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import { calculateBucketIndex, HeatValueMap, addCount, calcHeatValues } from './heatmapUtil';
import { MONTH_IN_MS} from '../../../utils/time';

const VIEW_PORT: ViewPort = {
  start: new Date('June 30, 2021 10:00:00'),
  end: new Date('June 30, 2022 21:00:00'),
  yMin: 0,
  yMax: 100,
};

const RESOLUTION: number = MONTH_IN_MS;
const START_TIME = VIEW_PORT.start.getTime(); //1625047200000

const STREAM_1_DATA_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 100 };
const STREAM_1_DATA_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS / 2, y: Math.random() * 100 };
const STREAM_1_DATA_POINT_3: DataPoint = { x: START_TIME + (MONTH_IN_MS / 2) * 3, y: Math.random() * 100 };
const STREAM_1_DATA_POINT_4: DataPoint = { x: START_TIME + (MONTH_IN_MS / 2) * 4, y: Math.random() * 100 };
const STREAM_1_DATA_POINT_5: DataPoint = { x: START_TIME + (MONTH_IN_MS / 2) * 5, y: Math.random() * 100 };

const STREAM_2_DATA_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 10 };
const STREAM_2_DATA_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS / 2, y: Math.random() * 100 };
const STREAM_2_DATA_POINT_3: DataPoint = { x: START_TIME + (MONTH_IN_MS / 2) * 3, y: Math.random() * 100 };
const STREAM_2_DATA_POINT_4: DataPoint = { x: START_TIME + (MONTH_IN_MS / 2) * 4, y: Math.random() * 100 };
const STREAM_2_DATA_POINT_5: DataPoint = { x: START_TIME + (MONTH_IN_MS / 2) * 5, y: Math.random() * 100 };

const STREAM_3_DATA_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 100 };
const STREAM_3_DATA_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS, y: Math.random() * 100 };
const STREAM_3_DATA_POINT_3: DataPoint = { x: START_TIME + MONTH_IN_MS * 5, y: Math.random() * 100 };
const STREAM_3_DATA_POINT_4: DataPoint = { x: START_TIME + MONTH_IN_MS * 10, y: Math.random() * 100 };
const STREAM_3_DATA_POINT_5: DataPoint = { x: START_TIME + MONTH_IN_MS * 11, y: Math.random() * 100 };

const DATA_SET_1 = [
  STREAM_1_DATA_POINT_1,
  STREAM_1_DATA_POINT_2,
  STREAM_1_DATA_POINT_3,
  STREAM_1_DATA_POINT_4,
  STREAM_1_DATA_POINT_5,
];

const DATA_SET_2 = [
  STREAM_2_DATA_POINT_1,
  STREAM_2_DATA_POINT_2,
  STREAM_2_DATA_POINT_3,
  STREAM_2_DATA_POINT_4,
  STREAM_2_DATA_POINT_5,
];

const DATA_SET_3 = [
  STREAM_3_DATA_POINT_1,
  STREAM_3_DATA_POINT_2,
  STREAM_3_DATA_POINT_3,
  STREAM_3_DATA_POINT_4,
  STREAM_3_DATA_POINT_5,
];

const DATASTREAM_1 = {
  id: 'data-stream-1',
  name: 'some name 1',
  resolution: RESOLUTION,
  aggregates: {},
  data: DATA_SET_1,
  dataType: DataType.NUMBER,
};

const DATASTREAM_2 = {
  id: 'data-stream-2',
  name: 'some name 2',
  resolution: RESOLUTION,
  aggregates: {},
  data: DATA_SET_2,
  dataType: DataType.NUMBER,
};

const DATASTREAM_3 = {
  id: 'data-stream-3',
  name: 'some name 3',
  resolution: RESOLUTION,
  aggregates: {},
  data: DATA_SET_3,
  dataType: DataType.NUMBER,
};

describe('calculateBucketIndex', () => {
  it('returns the bucket index for each y-value', () => {
    expect(calculateBucketIndex({yValue: 100, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(10);
    expect(calculateBucketIndex({yValue: 62, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(7);

    expect(calculateBucketIndex({yValue: 10, yMax: 15, yMin: 5, bucketCount: 10})).toEqual(5);
    expect(calculateBucketIndex({yValue: 12, yMax: 15, yMin: 5, bucketCount: 10})).toEqual(7);

    expect(calculateBucketIndex({yValue: -4, yMax: 5, yMin: -5, bucketCount: 10})).toEqual(1);
    expect(calculateBucketIndex({yValue: 4, yMax: 5, yMin: -5, bucketCount: 10})).toEqual(9);
  });
});

describe('addCount', () => {
  it('returns aggregated data for one data point', () => {
    const oldHeatValue: HeatValueMap = {};
    const newHeatValue = addCount({oldHeatValue, xBucketRangeStart: 123, bucketIndex: 1, dataStreamId: 'data-stream-1'});

    expect(newHeatValue).toEqual({
      123 : {
        1: { totalCount: 1, 'data-stream-1': 1 },
      },
    });
  });

  it('returns aggregated data for multiple calls with the same heatValueMap object passed in', () => {
    let heatValue: HeatValueMap = {};
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 123, bucketIndex: 1, dataStreamId: 'data-stream-1'});
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 123, bucketIndex: 2, dataStreamId: 'data-stream-1'});
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 124, bucketIndex: 5, dataStreamId: 'data-stream-1'});
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 123, bucketIndex: 1, dataStreamId: 'data-stream-2'});
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 124, bucketIndex: 6, dataStreamId: 'data-stream-2'});

    expect(heatValue).toEqual({
      123: {
        1: { totalCount: 2, 'data-stream-1': 1, 'data-stream-2': 1 },
        2: { totalCount: 1, 'data-stream-1': 1 },
      },
      124: {
        5: { totalCount: 1, 'data-stream-1': 1 },
        6: { totalCount: 1, 'data-stream-2': 1 },
      },
    });
  });
});

describe('calcHeatValues tests', () => {
  it('returns aggregated data with multiple dataStreams', () => {
    const dataStreams: DataStream[] = [
      DATASTREAM_1,
      DATASTREAM_2,
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});
    expect(newHeatValue).toEqual({
      1622592000000: expect.anything(),
      1625184000000: expect.anything(),
      1627776000000: expect.anything(),
      1630368000000: expect.anything(),        
    });
  });

  it('returns aggregated data for a dataStream with skipping timestamps', () => {
    

    const dataStreams: DataStream[] = [
      DATASTREAM_3,
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});;
    expect(newHeatValue).toEqual({
      1622592000000: expect.anything(),
      1625184000000: expect.anything(),
      1635552000000: expect.anything(),
      1648512000000: expect.anything(),
      1651104000000: expect.anything(),
    });
  });

  it('returns aggregated data for dataStreams with different x-axis bucket ranges', () => {
    const dataStreams: DataStream[] = [
      DATASTREAM_2,
      DATASTREAM_3,
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});;
    expect(newHeatValue).toEqual({
      1622592000000: expect.anything(),
      1625184000000: expect.anything(),
      1635552000000: expect.anything(),
      1648512000000: expect.anything(),
      1651104000000: expect.anything(),
    });
  });
});
