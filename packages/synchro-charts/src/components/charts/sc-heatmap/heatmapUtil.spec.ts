import { DataType } from '../../../utils/dataConstants';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import { HeatValueMap, addCount, calcHeatValues } from './heatmapUtil';
import { MONTH_IN_MS, DAY_IN_MS } from '../../../utils/time';

const ADDCOUNT_HEATVALUE: HeatValueMap = {};
const ADDCOUNT_INPUT_1 = {oldHeatValue: ADDCOUNT_HEATVALUE, xBucketRangeStart: 123, bucketIndex: 1, dataStreamName: 'Asset 1'};

describe('addCount', () => {
  it('addCount has proper structure', () => {
    let heatValue: HeatValueMap = {};
    heatValue = addCount(ADDCOUNT_INPUT_1);

    expect(heatValue).toEqual({
      '123': {
        '1': { totalCount: 1, 'Asset 1': 1 },
      },
    });
  });

  it("addCount isn't destructive", () => {
    let testHeatValue: HeatValueMap = {};
    let heatValue: HeatValueMap = {};
    heatValue = addCount(ADDCOUNT_INPUT_1);

    expect(testHeatValue).toEqual({
      '123': {
        '1': { totalCount: 1, 'Asset 1': 1 },
      },
    });
    expect(heatValue).toEqual({});
  });

  it('multiple addCount calls add on top of each other', () => {
    let heatValue: HeatValueMap = {};
    heatValue = addCount(ADDCOUNT_INPUT_1);
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 123, bucketIndex: 2, dataStreamName: 'Asset 1'});
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 124, bucketIndex: 5, dataStreamName: 'Asset 1'});
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 123, bucketIndex: 1, dataStreamName: 'Asset 2'});
    heatValue = addCount({oldHeatValue: heatValue, xBucketRangeStart: 124, bucketIndex: 6, dataStreamName: 'Asset 2'});

    expect(heatValue).toEqual({
      '123': {
        '1': { totalCount: 2, 'Asset 1': 1, 'Asset 2': 1 },
        '2': { totalCount: 1, 'Asset 1': 1 },
      },
      '124': {
        '5': { totalCount: 1, 'Asset 1': 1 },
        '6': { totalCount: 1, 'Asset 2': 1 },
      },
    });
  });
});

describe('calcHeatValues', () => {
  it('calcHeatValue has proper structure', () => {
    const oldHeatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 30 };
    const resolution = MONTH_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution,
        aggregates: {},
        data: [STREAM_1_DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: 0,
      yMax: 100,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    const testHeatValue = calcHeatValues({oldHeatValue, dataStreams, resolution, startTime, endTime, yMax, yMin});
    expect(testHeatValue).toEqual({
      '1625047200000': {
        '3': { totalCount: 1, 'some name 1': 1 },
      },
    });
    expect(oldHeatValue).toEqual({});
  });

  it('calcHeatValues has individual datastream counts', () => {
    let heatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 2 };
    const STREAM_1_DATA_POINT_2: DataPoint = { x: 1625072400000 + MONTH_IN_MS / 2, y: 4 };
    const STREAM_1_DATA_POINT_3: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 3, y: 3 };
    const STREAM_1_DATA_POINT_4: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 4, y: 8 };
    const STREAM_1_DATA_POINT_5: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 5, y: 5 };

    const STREAM_2_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 2 };
    const STREAM_2_DATA_POINT_2: DataPoint = { x: 1625072400000 + MONTH_IN_MS / 2, y: 4 };
    const STREAM_2_DATA_POINT_3: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 3, y: 3 };
    const STREAM_2_DATA_POINT_4: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 4, y: 8 };
    const STREAM_2_DATA_POINT_5: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 5, y: 5 };

    const resolution = MONTH_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-2',
        name: 'some name 2',
        resolution,
        aggregates: {},
        data: [
          STREAM_2_DATA_POINT_1,
          STREAM_2_DATA_POINT_2,
          STREAM_2_DATA_POINT_3,
          STREAM_2_DATA_POINT_4,
          STREAM_2_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: 0,
      yMax: 10,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    heatValue = calcHeatValues(heatValue, dataStreams, resolution, startTime, endTime, yMax, yMin);
    expect(heatValue).toEqual({
      '1625047200000': {
        '2': { totalCount: 2, 'some name 1': 1, 'some name 2': 1 },
        '4': { totalCount: 2, 'some name 1': 1, 'some name 2': 1 },
      },
      '1627639200000': {
        '3': { totalCount: 2, 'some name 1': 1, 'some name 2': 1 },
      },
      '1630231200000': {
        '5': { totalCount: 2, 'some name 1': 1, 'some name 2': 1 },
        '8': { totalCount: 2, 'some name 1': 1, 'some name 2': 1 },
      },
    });
  });
});

describe('general tests', () => {
  it('lots of data with one data stream', () => {
    let heatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 38 };
    const STREAM_1_DATA_POINT_2: DataPoint = { x: 1625072400000 + DAY_IN_MS / 2, y: 97 };
    const STREAM_1_DATA_POINT_3: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 3, y: 102 };
    const STREAM_1_DATA_POINT_4: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 4, y: 59 };
    const STREAM_1_DATA_POINT_5: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 5, y: 164 };
    const STREAM_1_DATA_POINT_6: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 7, y: 17 };
    const STREAM_1_DATA_POINT_7: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 10, y: 82 };
    const STREAM_1_DATA_POINT_8: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 11, y: 92 };
    const STREAM_1_DATA_POINT_9: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 12, y: 1 };
    const STREAM_1_DATA_POINT_10: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 12, y: 3 };

    const resolution = DAY_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
          STREAM_1_DATA_POINT_6,
          STREAM_1_DATA_POINT_7,
          STREAM_1_DATA_POINT_8,
          STREAM_1_DATA_POINT_9,
          STREAM_1_DATA_POINT_10,
        ],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: 0,
      yMax: 200,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    heatValue = calcHeatValues(heatValue, dataStreams, resolution, startTime, endTime, yMax, yMin);
    expect(heatValue).toEqual({
      '1625047200000': {
        '2': { totalCount: 1, 'some name 1': 1 },
        '5': { totalCount: 1, 'some name 1': 1 },
      },
      '1625133600000': { '6': { totalCount: 1, 'some name 1': 1 } },
      '1625220000000': {
        '3': { totalCount: 1, 'some name 1': 1 },
        '9': { totalCount: 1, 'some name 1': 1 },
      },
      '1625306400000': { '1': { totalCount: 1, 'some name 1': 1 } },
      '1625479200000': { '5': { totalCount: 2, 'some name 1': 2 } },
      '1625565600000': { '1': { totalCount: 2, 'some name 1': 2 } },
    });
  });  

  it('few data with multiple data streams', () => {
    let heatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 38 };
    const STREAM_1_DATA_POINT_2: DataPoint = { x: 1625072400000 + DAY_IN_MS / 2, y: 168 };
    const STREAM_1_DATA_POINT_3: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 3, y: 102 };
    const STREAM_1_DATA_POINT_4: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 4, y: 59 };
    const STREAM_1_DATA_POINT_5: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 5, y: 164 };

    const STREAM_2_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 29 };
    const STREAM_2_DATA_POINT_2: DataPoint = { x: 1625072400000 + DAY_IN_MS / 2, y: 173 };
    const STREAM_2_DATA_POINT_3: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 3, y: 89 };
    const STREAM_2_DATA_POINT_4: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 6, y: 62 };
    const STREAM_2_DATA_POINT_5: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 7, y: 174 };

    const STREAM_3_DATA_POINT_1: DataPoint = { x: 1625072400000 + DAY_IN_MS / 2, y: 170 };
    const STREAM_3_DATA_POINT_2: DataPoint = { x: 1625072400000 + DAY_IN_MS, y: 12 };
    const STREAM_3_DATA_POINT_3: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 3, y: 21 };
    const STREAM_3_DATA_POINT_4: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 4, y: 90 };
    const STREAM_3_DATA_POINT_5: DataPoint = { x: 1625072400000 + (DAY_IN_MS / 2) * 5, y: 71 };

    const STREAM_4_DATA_POINT_1: DataPoint = { x: 1625072400000 + DAY_IN_MS / 2, y: 161 };
    const STREAM_4_DATA_POINT_2: DataPoint = { x: 1625072400000 + DAY_IN_MS * 5, y: 119 };
    const STREAM_4_DATA_POINT_3: DataPoint = { x: 1625072400000 + DAY_IN_MS * 8, y: 82 };
    const STREAM_4_DATA_POINT_4: DataPoint = { x: 1625072400000 + DAY_IN_MS * 8.5, y: 97 };
    const STREAM_4_DATA_POINT_5: DataPoint = { x: 1625072400000 + DAY_IN_MS * 9, y: 183 };

    const resolution = DAY_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-2',
        name: 'some name 2',
        resolution,
        aggregates: {},
        data: [
          STREAM_2_DATA_POINT_1,
          STREAM_2_DATA_POINT_2,
          STREAM_2_DATA_POINT_3,
          STREAM_2_DATA_POINT_4,
          STREAM_2_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-3',
        name: 'some name 3',
        resolution,
        aggregates: {},
        data: [
          STREAM_3_DATA_POINT_1,
          STREAM_3_DATA_POINT_2,
          STREAM_3_DATA_POINT_3,
          STREAM_3_DATA_POINT_4,
          STREAM_3_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-4',
        name: 'some name 4',
        resolution,
        aggregates: {},
        data: [
          STREAM_4_DATA_POINT_1,
          STREAM_4_DATA_POINT_2,
          STREAM_4_DATA_POINT_3,
          STREAM_4_DATA_POINT_4,
          STREAM_4_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: 0,
      yMax: 200,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    heatValue = calcHeatValues(heatValue, dataStreams, resolution, startTime, endTime, yMax, yMin);
    expect(heatValue).toEqual({
      '1625047200000': {
        '2': { totalCount: 2, 'some name 1': 1, 'some name 2': 1 },
        '9': {
          totalCount: 4,
          'some name 1': 1,
          'some name 2': 1,
          'some name 3': 1,
          'some name 4': 1,
        },
      },
      '1625133600000': {
        '1': { totalCount: 1, 'some name 3': 1 },
        '2': { totalCount: 1, 'some name 3': 1 },
        '5': { totalCount: 1, 'some name 2': 1 },
        '6': { totalCount: 1, 'some name 1': 1 },
      },
      '1625220000000': {
        '3': { totalCount: 1, 'some name 1': 1 },
        '4': { totalCount: 1, 'some name 3': 1 },
        '5': { totalCount: 1, 'some name 3': 1 },
        '9': { totalCount: 1, 'some name 1': 1 },
      },
      '1625306400000': {
        '4': { totalCount: 1, 'some name 2': 1 },
        '9': { totalCount: 1, 'some name 2': 1 },
      },
      '1625479200000': { '6': { totalCount: 1, 'some name 4': 1 } },
      '1625738400000': { '5': { totalCount: 2, 'some name 4': 2 } },
      '1625824800000': { '10': { totalCount: 1, 'some name 4': 1 } },
    });
  });

  it('negative yMin', () => {
    let heatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: -4 };
    const STREAM_1_DATA_POINT_2: DataPoint = { x: 1625072400000 + MONTH_IN_MS / 2, y: 4 };
    const STREAM_1_DATA_POINT_3: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 3, y: 0 };
    const STREAM_1_DATA_POINT_4: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 4, y: 2 };
    const STREAM_1_DATA_POINT_5: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 5, y: -1 };

    const resolution = MONTH_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: -5,
      yMax: 5,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    heatValue = calcHeatValues(heatValue, dataStreams, resolution, startTime, endTime, yMax, yMin);;
    
    expect(heatValue).toEqual({
      '1625047200000': {
        '1': { totalCount: 1, 'some name 1': 1 },
        '9': { totalCount: 1, 'some name 1': 1 }
      },
      '1627639200000': { '5': { totalCount: 1, 'some name 1': 1 } },
      '1630231200000': {
        '4': { totalCount: 1, 'some name 1': 1 },
        '7': { totalCount: 1, 'some name 1': 1 }
      }
    });
  });

  it('positive nonzero yMin', () => {
    let heatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 10 };
    const STREAM_1_DATA_POINT_2: DataPoint = { x: 1625072400000 + MONTH_IN_MS / 2, y: 12 };
    const STREAM_1_DATA_POINT_3: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 3, y: 9 };
    const STREAM_1_DATA_POINT_4: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 4, y: 8 };
    const STREAM_1_DATA_POINT_5: DataPoint = { x: 1625072400000 + (MONTH_IN_MS / 2) * 5, y: 13 };

    const resolution = MONTH_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: 5,
      yMax: 15,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    heatValue = calcHeatValues(heatValue, dataStreams, resolution, startTime, endTime, yMax, yMin);;
    
    expect(heatValue).toEqual({
      '1625047200000': {
        '5': { totalCount: 1, 'some name 1': 1 },
        '7': { totalCount: 1, 'some name 1': 1 }
      },
      '1627639200000': { '4': { totalCount: 1, 'some name 1': 1 } },
      '1630231200000': {
        '3': { totalCount: 1, 'some name 1': 1 },
        '8': { totalCount: 1, 'some name 1': 1 }
      }
    });
  });
});

describe('edge cases', () => {
  it('dataStream with skipped timestream', () => {
    let heatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 2 };
    const STREAM_1_DATA_POINT_2: DataPoint = { x: 1625072400000 + MONTH_IN_MS, y: 4 };
    const STREAM_1_DATA_POINT_3: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 5, y: 3 };
    const STREAM_1_DATA_POINT_4: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 10, y: 8 };
    const STREAM_1_DATA_POINT_5: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 11, y: 5 };

    const resolution = MONTH_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: 0,
      yMax: 10,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    heatValue = calcHeatValues(heatValue, dataStreams, resolution, startTime, endTime, yMax, yMin);;
    expect(heatValue).toEqual({
      '1625047200000': { '2': { totalCount: 1, 'some name 1': 1 } },
      '1627639200000': { '4': { totalCount: 1, 'some name 1': 1 } },
      '1638007200000': { '3': { totalCount: 1, 'some name 1': 1 } },
      '1650967200000': { '8': { totalCount: 1, 'some name 1': 1 } },
      '1653559200000': { '5': { totalCount: 1, 'some name 1': 1 } },
    });
  });

  it('dataStreams with different x-axis bucket ranges', () => {
    let heatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 2 };
    const STREAM_1_DATA_POINT_2: DataPoint = { x: 1625072400000 + MONTH_IN_MS, y: 2 };
    const STREAM_1_DATA_POINT_3: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 5, y: 1 };
    const STREAM_1_DATA_POINT_4: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 8, y: 9 };
    const STREAM_1_DATA_POINT_5: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 10, y: 5 };

    const STREAM_2_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 2 };
    const STREAM_2_DATA_POINT_2: DataPoint = { x: 1625072400000 + MONTH_IN_MS, y: 4 };
    const STREAM_2_DATA_POINT_3: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 3, y: 3 };
    const STREAM_2_DATA_POINT_4: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 7, y: 9 };
    const STREAM_2_DATA_POINT_5: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 8, y: 5 };

    const resolution = MONTH_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: 'some name 1',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-2',
        name: 'some name 2',
        resolution,
        aggregates: {},
        data: [
          STREAM_2_DATA_POINT_1,
          STREAM_2_DATA_POINT_2,
          STREAM_2_DATA_POINT_3,
          STREAM_2_DATA_POINT_4,
          STREAM_2_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: 0,
      yMax: 10,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    heatValue = calcHeatValues(heatValue, dataStreams, resolution, startTime, endTime, yMax, yMin);;
    expect(heatValue).toEqual({
      '1625047200000': { '2': { totalCount: 2, 'some name 1': 1, 'some name 2': 1 } },
      '1627639200000': {
        '2': { totalCount: 1, 'some name 1': 1 },
        '4': { totalCount: 1, 'some name 2': 1 },
      },
      '1638007200000': { '1': { totalCount: 1, 'some name 1': 1 } },
      '1645783200000': {
        '5': { totalCount: 1, 'some name 2': 1 },
        '9': { totalCount: 1, 'some name 1': 1 },
      },
      '1650967200000': { '5': { totalCount: 1, 'some name 1': 1 } },
      '1632823200000': { '3': { totalCount: 1, 'some name 2': 1 } },
      '1643191200000': { '9': { totalCount: 1, 'some name 2': 1 } },
    });
  });

  it('dataStream with missing name', () => {
    let heatValue: HeatValueMap = {};
    const STREAM_1_DATA_POINT_1: DataPoint = { x: 1625072400000, y: 2 };
    const STREAM_1_DATA_POINT_2: DataPoint = { x: 1625072400000 + MONTH_IN_MS, y: 4 };
    const STREAM_1_DATA_POINT_3: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 2, y: 3 };
    const STREAM_1_DATA_POINT_4: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 3, y: 8 };
    const STREAM_1_DATA_POINT_5: DataPoint = { x: 1625072400000 + MONTH_IN_MS * 4, y: 5 };

    const resolution = MONTH_IN_MS;

    const dataStreams: DataStream[] = [
      {
        id: 'data-stream-1',
        name: '',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-1',
        name: 'has name',
        resolution,
        aggregates: {},
        data: [
          STREAM_1_DATA_POINT_1,
          STREAM_1_DATA_POINT_2,
          STREAM_1_DATA_POINT_3,
          STREAM_1_DATA_POINT_4,
          STREAM_1_DATA_POINT_5,
        ],
        dataType: DataType.NUMBER,
      },
    ];

    const viewPort: ViewPort = {
      start: new Date('June 30, 2021 10:00:00'),
      end: new Date('June 30, 2022 21:00:00'),
      yMin: 0,
      yMax: 10,
    };
    const startTime = viewPort.start.getTime();
    const endTime = viewPort.end.getTime();
    const { yMax, yMin} = viewPort;
    heatValue = calcHeatValues(heatValue, dataStreams, resolution, startTime, endTime, yMax, yMin);
    expect(heatValue).toEqual({
      '1625047200000': { '2': { totalCount: 1, 'has name': 1 } },
      '1627639200000': { '4': { totalCount: 1, 'has name': 1 } },
      '1630231200000': { '3': { totalCount: 1, 'has name': 1 } },
      '1632823200000': { '8': { totalCount: 1, 'has name': 1 } },
      '1635415200000': { '5': { totalCount: 1, 'has name': 1 } },
    });
  });
});
