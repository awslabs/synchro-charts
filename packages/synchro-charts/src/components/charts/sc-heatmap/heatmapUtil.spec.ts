import { stratify } from 'd3-hierarchy';
import { DataType } from '../../../utils/dataConstants';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import { calculateBucketIndex, HeatValueMap, addCount, calcHeatValues, calculateXBucketStart } from './heatmapUtil';
import { MONTH_IN_MS} from '../../../utils/time';

const VIEW_PORT: ViewPort = {
  start: new Date('June 1, 2021 10:00:00'),
  end: new Date('June 3, 2022 21:00:00'),
  yMin: 0,
  yMax: 100,
};

const RESOLUTION: number = MONTH_IN_MS;
const START_TIME = VIEW_PORT.start.getTime(); //162254160000

const STREAM_1_DATA_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 100 };
const STREAM_1_DATA_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS * 2, y: Math.random() * 100 };
const STREAM_1_DATA_POINT_3: DataPoint = { x: START_TIME + MONTH_IN_MS * 5, y: Math.random() * 100 };

const STREAM_2_DATA_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 10 };
const STREAM_2_DATA_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS * 2, y: Math.random() * 100 };
const STREAM_2_DATA_POINT_3: DataPoint = { x: START_TIME + MONTH_IN_MS * 5, y: Math.random() * 100 };

const STREAM_3_DATA_POINT_1: DataPoint = { x: START_TIME, y: Math.random() * 100 };
const STREAM_3_DATA_POINT_2: DataPoint = { x: START_TIME + MONTH_IN_MS, y: Math.random() * 100 };
const STREAM_3_DATA_POINT_3: DataPoint = { x: START_TIME + MONTH_IN_MS * 10, y: Math.random() * 100 };

const DATA_SET_1 = [
  STREAM_1_DATA_POINT_1,
  STREAM_1_DATA_POINT_2,
  STREAM_1_DATA_POINT_3,
];

const DATA_SET_2 = [
  STREAM_2_DATA_POINT_1,
  STREAM_2_DATA_POINT_2,
  STREAM_2_DATA_POINT_3,
];

const DATA_SET_3 = [
  STREAM_3_DATA_POINT_1,
  STREAM_3_DATA_POINT_2,
  STREAM_3_DATA_POINT_3,
];

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

const DATASTREAM_3 = {
  id: 'data-stream-3',
  name: 'some name 3',
  resolution: RESOLUTION,
  data: DATA_SET_3,
  dataType: DataType.NUMBER,
};

const START_TIME_EPOCH = calculateXBucketStart({xValue: START_TIME, xAxisBucketRange: MONTH_IN_MS});
const START_TIME_EPOCH_1 = calculateXBucketStart({xValue: START_TIME + MONTH_IN_MS, xAxisBucketRange: MONTH_IN_MS});
const START_TIME_EPOCH_2 = calculateXBucketStart({xValue: START_TIME + MONTH_IN_MS * 2, xAxisBucketRange: MONTH_IN_MS});
const START_TIME_EPOCH_5 = calculateXBucketStart({xValue: START_TIME + MONTH_IN_MS * 5, xAxisBucketRange: MONTH_IN_MS});
const START_TIME_EPOCH_10 = calculateXBucketStart({xValue: START_TIME + MONTH_IN_MS * 10, xAxisBucketRange: MONTH_IN_MS});

describe.each`
yValue                      | yMax                 | yMin               | bucketCount     | bucketIndex
${100}                      | ${100}               | ${0}               | ${10}           | ${10}    
${62}                       | ${100}               | ${0}               | ${10}           | ${7}
${10}                       | ${15}                | ${5}               | ${10}           | ${5}
${12}                       | ${15}                | ${5}               | ${10}           | ${7}
${-4}                       | ${5}                 | ${-5}              | ${10}           | ${1}
${4}                        | ${5}                 | ${-5}              | ${10}           | ${9}
`('calculateBucketIndex', ({yValue, yMax, yMin, bucketCount, bucketIndex }) => {
  test(`bucket index for ${yValue} with yMax: ${yMax} and yMin: ${yMin}`, () => {
    expect(calculateBucketIndex({yValue, yMax, yMin, bucketCount})).toBe(bucketIndex);
  });
});

describe.each`
xValue                             | xAxisBucketRange     | bucketRangeStart
${START_TIME}                      | ${MONTH_IN_MS}       | ${1620000000000}  
${START_TIME + MONTH_IN_MS * 2}    | ${MONTH_IN_MS}       | ${1625184000000}
${START_TIME + MONTH_IN_MS * 5}    | ${MONTH_IN_MS}       | ${1632960000000}
`('calculateXBucketStart', ({ xValue, xAxisBucketRange, bucketRangeStart }) => {
  test(`bucket range start for ${xValue}`, () => {
    expect(calculateXBucketStart({xValue, xAxisBucketRange})).toBe(bucketRangeStart);
  });
});

describe('addCount', () => {
  it('returns aggregated data for one data point', () => {
    const oldHeatValue: HeatValueMap = {};
    const newHeatValue = addCount({heatValue: oldHeatValue, xBucketRangeStart: 123, bucketIndex: 1, dataStreamId: 'data-stream-1'});

    expect(newHeatValue).toEqual({
      123 : {
        1: { totalCount: 1, 
          streamCount: {
            'data-stream-1': 1 
          },
        },
      },
    });
  });

  it('returns aggregated data for multiple calls with the same heatValueMap object passed in', () => {
    let heatValue: HeatValueMap = {};
    heatValue = addCount({heatValue, xBucketRangeStart: 123, bucketIndex: 1, dataStreamId: 'data-stream-1'});
    heatValue = addCount({heatValue, xBucketRangeStart: 123, bucketIndex: 2, dataStreamId: 'data-stream-1'});
    heatValue = addCount({heatValue, xBucketRangeStart: 124, bucketIndex: 5, dataStreamId: 'data-stream-1'});
    heatValue = addCount({heatValue, xBucketRangeStart: 123, bucketIndex: 1, dataStreamId: 'data-stream-2'});
    heatValue = addCount({heatValue, xBucketRangeStart: 124, bucketIndex: 6, dataStreamId: 'data-stream-2'});

    expect(heatValue).toEqual({
      123: {
        1: { 
          totalCount: 2, 
          streamCount: {
            'data-stream-1': 1,
            'data-stream-2': 1 
          },
        },
        2: { 
          totalCount: 1, 
          streamCount: {
            'data-stream-1': 1 
          },
        },
      },
      124: {
        5: {
          totalCount: 1,
          streamCount: {
            'data-stream-1': 1 
          },
        },
        6: {
          totalCount: 1,
          streamCount: {
            'data-stream-2': 1 
          },
        },
      },
    });
  });
});

describe('calcHeatValues', () => {
  it('returns aggregated data with multiple dataStreams', () => {
    const dataStreams: DataStream[] = [
      DATASTREAM_1,
      DATASTREAM_2,
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});
    expect(newHeatValue).toEqual({
      [START_TIME_EPOCH]: expect.anything(),
      [START_TIME_EPOCH_2]: expect.anything(),
      [START_TIME_EPOCH_5]: expect.anything(),        
    });
  });

  it('returns aggregated data for dataStreams with different x-axis bucket ranges', () => {
    const dataStreams: DataStream[] = [
      DATASTREAM_2,
      DATASTREAM_3,
    ];

    const newHeatValue = calcHeatValues({oldHeatValue: {}, dataStreams, resolution: RESOLUTION, viewPort: VIEW_PORT});;
    expect(newHeatValue).toEqual({
      [START_TIME_EPOCH]: expect.anything(),
      [START_TIME_EPOCH_1]: expect.anything(),
      [START_TIME_EPOCH_2]: expect.anything(),
      [START_TIME_EPOCH_5]: expect.anything(),
      [START_TIME_EPOCH_10]: expect.anything(),
    });
  });
});
