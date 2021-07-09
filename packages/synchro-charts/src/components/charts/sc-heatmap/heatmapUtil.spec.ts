import { DataType } from '../../../utils/dataConstants';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import { calculateBucketIndex, HeatValueMap, addCount, calcHeatValues } from './heatmapUtil';
import { MONTH_IN_MS} from '../../../utils/time';

type HeatValueMapLayer = {
  number: {
    number: {
      totalCount: number;
      [streamId: string]: number;
    }
  }
}

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

describe('calculateBucketIndex', () => {
  it('returns the bucket index for each y-value', () => {
    expect(calculateBucketIndex({yValue: 100, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(10);
    expect(calculateBucketIndex({yValue: 92, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(10);
    expect(calculateBucketIndex({yValue: 10, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(1);
    expect(calculateBucketIndex({yValue: 1, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(1);
    expect(calculateBucketIndex({yValue: 55, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(6);
    expect(calculateBucketIndex({yValue: 49, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(5);
    expect(calculateBucketIndex({yValue: 30, yMax: 100, yMin: 0, bucketCount: 10})).toEqual(3);
  });

  it('returns the bucket index for each y-value given a positive nonzero yMin', () => {
    expect(calculateBucketIndex({yValue: 10, yMax: 15, yMin: 5, bucketCount: 10})).toEqual(5);
    expect(calculateBucketIndex({yValue: 12, yMax: 15, yMin: 5, bucketCount: 10})).toEqual(7);
    expect(calculateBucketIndex({yValue: 9, yMax: 15, yMin: 5, bucketCount: 10})).toEqual(4);
    expect(calculateBucketIndex({yValue: 8, yMax: 15, yMin: 5, bucketCount: 10})).toEqual(3);
    expect(calculateBucketIndex({yValue: 13, yMax: 15, yMin: 5, bucketCount: 10})).toEqual(8);
  });

  it('returns the bucket index for each y-value given a negative yMin works', () => {
    expect(calculateBucketIndex({yValue: -4, yMax: 5, yMin: -5, bucketCount: 10})).toEqual(1);
    expect(calculateBucketIndex({yValue: 4, yMax: 5, yMin: -5, bucketCount: 10})).toEqual(9);
    expect(calculateBucketIndex({yValue: 0, yMax: 5, yMin: -5, bucketCount: 10})).toEqual(5);
    expect(calculateBucketIndex({yValue: 2, yMax: 5, yMin: -5, bucketCount: 10})).toEqual(7);
    expect(calculateBucketIndex({yValue: -1, yMax: 5, yMin: -5, bucketCount: 10})).toEqual(4);
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
  it('returns aggregated data with a dataStream with one data point', () => {
    const oldHeatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: START_TIME, y: 30 };

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution: RESOLUTION,
        aggregates: {},
        data: [STREAM_1_DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];

    const testHeatValue = calcHeatValues({oldHeatValue, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});
    expect(testHeatValue).toEqual({
      1625047200000: {
        3: { totalCount: 1, 'data-stream-1': 1 },
      },
    });
    expect(oldHeatValue).toEqual({});
  });

  it('returns aggregated data with multiple dataStreams', () => {
    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution: RESOLUTION,
        aggregates: {},
        data: DATA_SET_1,
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-2',
        name: 'some name 2',
        resolution: RESOLUTION,
        aggregates: {},
        data: DATA_SET_2,
        dataType: DataType.NUMBER,
      },
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});
    expect(newHeatValue).toEqual({
      1625047200000: expect.anything(),
      1627639200000: expect.anything(),
      1630231200000: expect.anything(),
    });
  });

  it('returns aggregated data for a dataStream with skipping timestamps', () => {
    const STREAM_3_DATA_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 100 };
    const STREAM_3_DATA_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS, y: Math.random() * 100 };
    const STREAM_3_DATA_POINT_3: DataPoint = { x: START_TIME + MONTH_IN_MS * 5, y: Math.random() * 100 };
    const STREAM_3_DATA_POINT_4: DataPoint = { x: START_TIME + MONTH_IN_MS * 10, y: Math.random() * 100 };
    const STREAM_3_DATA_POINT_5: DataPoint = { x: START_TIME + MONTH_IN_MS * 11, y: Math.random() * 100 };

    const DATA_SET_3 = [
      STREAM_3_DATA_POINT_1,
      STREAM_3_DATA_POINT_2,
      STREAM_3_DATA_POINT_3,
      STREAM_3_DATA_POINT_4,
      STREAM_3_DATA_POINT_5,
    ];

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution: RESOLUTION,
        aggregates: {},
        data: DATA_SET_3,
        dataType: DataType.NUMBER,
      },
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});;
    expect(newHeatValue).toEqual({
      1625047200000: expect.anything(),
      1635415200000: expect.anything(),
      1648375200000: expect.anything(),
      1650967200000: expect.anything(),
    });
  });

  it('returns aggregated data for dataStreams with different x-axis bucket ranges', () => {
    const STREAM_1_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 20 };
    const STREAM_1_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS, y: Math.random() * 20 };
    const STREAM_1_POINT_3: DataPoint = { x: START_TIME + MONTH_IN_MS * 5, y: Math.random() * 20 };
    const STREAM_1_POINT_4: DataPoint = { x: START_TIME + MONTH_IN_MS * 8, y: Math.random() * 20 };
    const STREAM_1_POINT_5: DataPoint = { x: START_TIME + MONTH_IN_MS * 10, y: Math.random() * 20 };

    const DATA_1 = [
      STREAM_1_POINT_1,
      STREAM_1_POINT_2,
      STREAM_1_POINT_3,
      STREAM_1_POINT_4,
      STREAM_1_POINT_5
    ]

    const STREAM_2_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 20 };
    const STREAM_2_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS, y: Math.random() * 20 };
    const STREAM_2_POINT_3: DataPoint = { x: START_TIME + MONTH_IN_MS * 3, y: Math.random() * 20 };
    const STREAM_2_POINT_4: DataPoint = { x: START_TIME + MONTH_IN_MS * 7, y: Math.random() * 20 };
    const STREAM_2_POINT_5: DataPoint = { x: START_TIME + MONTH_IN_MS * 8, y: Math.random() * 20 };

    const DATA_2 = [
      STREAM_2_POINT_1,
      STREAM_2_POINT_2,
      STREAM_2_POINT_3,
      STREAM_2_POINT_4,
      STREAM_2_POINT_5
    ]

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution: RESOLUTION,
        aggregates: {},
        data: DATA_1,
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-2',
        name: 'some name 2',
        resolution: RESOLUTION,
        aggregates: {},
        data: DATA_2,
        dataType: DataType.NUMBER,
      },
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});;
    expect(newHeatValue).toEqual({
      1625047200000: expect.anything(),
      1630231200000: expect.anything(),
      1635415200000: expect.anything(),
      1640599200000: expect.anything(),
      1643191200000: expect.anything(),
      1648375200000: expect.anything(),
    });
  });

  it('returns only dataStreams with a nonempty id', () => {
    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: '',
        resolution: RESOLUTION,
        aggregates: {},
        data: DATA_SET_1,
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-1',
        name: 'has name',
        resolution: RESOLUTION,
        aggregates: {},
        data: DATA_SET_1,
        dataType: DataType.NUMBER,
      },
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});
    expect(newHeatValue).toEqual({
      1625047200000: expect.anything(),
      1627639200000: expect.anything(),
      1630231200000: expect.anything(),
    });
  });
});
