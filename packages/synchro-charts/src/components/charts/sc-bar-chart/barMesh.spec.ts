import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { barMesh, updateBarMesh } from './barMesh';
import { MONTH_IN_MS, DAY_IN_MS } from '../../../utils/time';
import { getBarMargin, getBarWidth } from './displayLogic';
import { getDistanceFromDuration } from '../common/getDistanceFromDuration';
import { DataType } from '../../../utils/dataConstants';
import { DataPoint, DataStream } from '../../../utils/dataTypes';
import { Threshold } from '../common/types';
import { COMPARISON_OPERATOR } from '../common/constants';

const VIEW_PORT = { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };
const toClipSpace = clipSpaceConversion(VIEW_PORT);

const BUFFER_FACTOR = 2;
const MIN_BUFFER_SIZE = 100;

const DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 0).getTime(), y: 200 };
const DATA_POINT_2: DataPoint = { x: new Date(2000, 1, 0).getTime(), y: 300 };
const DATA_POINT_3: DataPoint = { x: new Date(2000, 1, 0).getTime(), y: 400 };

const STREAM_1_DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 0).getTime(), y: 200 };
const STREAM_1_DATA_POINT_2: DataPoint = { x: new Date(2000, 1, 0).getTime(), y: 300 };
const STREAM_2_DATA_POINT_1: DataPoint = { x: new Date(2000, 3, 0).getTime(), y: 400 };
const STREAM_2_DATA_POINT_2: DataPoint = { x: new Date(2000, 4, 0).getTime(), y: 500 };
const STREAM_3_DATA_POINT_1: DataPoint = { x: new Date(2000, 6, 0).getTime(), y: 500 };
const STREAM_3_DATA_POINT_2: DataPoint = { x: new Date(2000, 7, 0).getTime(), y: 400 };

const DATA_STREAMS: DataStream[] = [
  {
    id: 'data-stream',
    name: 'some name',
    resolution: MONTH_IN_MS,
    aggregates: {
      [MONTH_IN_MS]: [DATA_POINT_1, DATA_POINT_2, DATA_POINT_3],
    },
    data: [],
    dataType: DataType.NUMBER,
  },
];

describe('create bar mesh', () => {
  it('sets the width uniform', () => {
    const mesh = barMesh({
      dataStreams: DATA_STREAMS,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.material.uniforms.width.value).toBeGreaterThan(0);
  });

  it('draws no bar with an empty data set', () => {
    const mesh = barMesh({
      dataStreams: [],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(0);

    expect(mesh.geometry.attributes.bar.array[0]).toBe(0);
    expect(mesh.geometry.attributes.bar.array[1]).toBe(0);
  });

  it('increase buffer size when there are more bars than the minimum buffer size', () => {
    const mesh = barMesh({
      dataStreams: DATA_STREAMS,
      toClipSpace,
      minBufferSize: 1,
      bufferFactor: 1,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(3);

    // Bar points
    expect(mesh.geometry.attributes.bar.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.bar.array[1]).toBeDefined();

    expect(mesh.geometry.attributes.bar.array[2]).toBeDefined();
    expect(mesh.geometry.attributes.bar.array[3]).toBeDefined();

    expect(mesh.geometry.attributes.bar.array[4]).toBeDefined();
    expect(mesh.geometry.attributes.bar.array[5]).toBeDefined();

    // Bar Colors
    expect(mesh.geometry.attributes.color.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[1]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[2]).toBeDefined();

    expect(mesh.geometry.attributes.color.array[3]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[4]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[5]).toBeDefined();

    expect(mesh.geometry.attributes.color.array[6]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[7]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[8]).toBeDefined();
  });

  it('draws one bar with single-point data set', () => {
    const mesh = barMesh({
      dataStreams: [
        { id: 'data-stream', name: 'some name', resolution: 0, data: [DATA_POINT_1], dataType: DataType.NUMBER },
      ],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(1);

    expect(mesh.geometry.attributes.bar.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(mesh.geometry.attributes.bar.array[1]).toBe(DATA_POINT_1.y);
  });

  it('draws two bars with two point data set', () => {
    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          data: [DATA_POINT_1, DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(2);

    expect(mesh.geometry.attributes.bar.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(mesh.geometry.attributes.bar.array[1]).toBe(DATA_POINT_1.y);

    expect(mesh.geometry.attributes.bar.array[2]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(mesh.geometry.attributes.bar.array[3]).toBe(DATA_POINT_2.y);

    // Black is rgb(0, 0, 0) and both of them are color black
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    expect(mesh.geometry.attributes.color.array[3]).toBe(0);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(0);
  });

  it('draws four bars for two separated data streams with two data points in each data stream', () => {
    const numberOfDataStreams = 2;
    const resolution = MONTH_IN_MS;
    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          color: 'red',
          name: 'some name',
          resolution,
          aggregates: {
            [resolution]: [STREAM_1_DATA_POINT_1, STREAM_1_DATA_POINT_2],
          },
          data: [],
          dataType: DataType.NUMBER,
        },
        {
          id: 'data-stream-2',
          color: 'blue',
          name: 'some name',
          resolution,
          aggregates: {
            [resolution]: [STREAM_2_DATA_POINT_1, STREAM_2_DATA_POINT_2],
          },
          data: [],
          dataType: DataType.NUMBER,
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const width = getBarWidth({
      toClipSpace,
      numDataStreams: numberOfDataStreams,
      resolution,
    });

    expect(getDistanceFromDuration(toClipSpace, resolution) - getBarMargin(toClipSpace, resolution)).toEqual(
      width * numberOfDataStreams
    );
    expect(mesh.count).toEqual(4);

    // Check for stream 1 bar 1
    expect(mesh.geometry.attributes.bar.array[0]).toBe(toClipSpace(STREAM_1_DATA_POINT_1.x));
    expect(mesh.geometry.attributes.bar.array[1]).toBe(STREAM_1_DATA_POINT_1.y);

    // Check for stream 1 bar 2
    expect(mesh.geometry.attributes.bar.array[2]).toBe(toClipSpace(STREAM_1_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.bar.array[3]).toBe(STREAM_1_DATA_POINT_2.y);

    // Check for stream 2 bar 1
    expect(mesh.geometry.attributes.bar.array[4]).toBe(toClipSpace(STREAM_2_DATA_POINT_1.x) - width);
    expect(mesh.geometry.attributes.bar.array[5]).toBe(STREAM_2_DATA_POINT_1.y);

    // Check for stream 2 bar 2
    expect(mesh.geometry.attributes.bar.array[6]).toBe(toClipSpace(STREAM_2_DATA_POINT_2.x) - width);
    expect(mesh.geometry.attributes.bar.array[7]).toBe(STREAM_2_DATA_POINT_2.y);

    // Data stream 1 bar 1 is red, which is rgb(255, 0, 0)
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    // Data stream 1 bar 2 is red, which is rgb(255, 0, 0)
    expect(mesh.geometry.attributes.color.array[3]).toBe(255);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(0);

    // Data stream 2 bar 1 is blue, which is rgb(0, 0, 255)
    expect(mesh.geometry.attributes.color.array[6]).toBe(0);
    expect(mesh.geometry.attributes.color.array[7]).toBe(0);
    expect(mesh.geometry.attributes.color.array[8]).toBe(255);

    // Data stream 2 bar 2 is blue, which is rgb(0, 0, 255)
    expect(mesh.geometry.attributes.color.array[9]).toBe(0);
    expect(mesh.geometry.attributes.color.array[10]).toBe(0);
    expect(mesh.geometry.attributes.color.array[11]).toBe(255);
  });

  it('draws six bars for three separated data streams with two data points in each data stream', () => {
    const numberOfDataStreams = 3;
    const dataType = DataType.NUMBER;
    const resolution = MONTH_IN_MS;
    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          name: 'some name',
          resolution,
          color: 'red',
          aggregates: {
            [resolution]: [STREAM_1_DATA_POINT_1, STREAM_1_DATA_POINT_2],
          },
          data: [],
          dataType,
        },
        {
          id: 'data-stream-2',
          name: 'some name',
          color: 'blue',
          resolution,
          aggregates: {
            [resolution]: [STREAM_2_DATA_POINT_1, STREAM_2_DATA_POINT_2],
          },
          data: [],
          dataType,
        },
        {
          id: 'data-stream-3',
          color: 'black',
          name: 'some name',
          resolution,
          aggregates: {
            [resolution]: [STREAM_3_DATA_POINT_1, STREAM_3_DATA_POINT_2],
          },
          data: [],
          dataType,
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const width = getBarWidth({
      toClipSpace,
      numDataStreams: numberOfDataStreams,
      resolution,
    });

    expect(getDistanceFromDuration(toClipSpace, resolution) - getBarMargin(toClipSpace, resolution)).toEqual(
      width * numberOfDataStreams
    );
    expect(mesh.count).toEqual(6);

    // Check for stream 1 bar 1
    expect(mesh.geometry.attributes.bar.array[0]).toBe(toClipSpace(STREAM_1_DATA_POINT_1.x));
    expect(mesh.geometry.attributes.bar.array[1]).toBe(STREAM_1_DATA_POINT_1.y);

    // Check for stream 1 bar 2
    expect(mesh.geometry.attributes.bar.array[2]).toBe(toClipSpace(STREAM_1_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.bar.array[3]).toBe(STREAM_1_DATA_POINT_2.y);

    // Check for stream 2 bar 1
    expect(mesh.geometry.attributes.bar.array[4]).toBe(toClipSpace(STREAM_2_DATA_POINT_1.x) - width);
    expect(mesh.geometry.attributes.bar.array[5]).toBe(STREAM_2_DATA_POINT_1.y);

    // Check for stream 2 bar 2
    expect(mesh.geometry.attributes.bar.array[6]).toBe(toClipSpace(STREAM_2_DATA_POINT_2.x) - width);
    expect(mesh.geometry.attributes.bar.array[7]).toBe(STREAM_2_DATA_POINT_2.y);

    // Check for stream 3 bar 1. We minus two here because of the offset by the number of data stream
    expect(mesh.geometry.attributes.bar.array[8]).toBe(toClipSpace(STREAM_3_DATA_POINT_1.x) - 2 * width);
    expect(mesh.geometry.attributes.bar.array[9]).toBe(STREAM_3_DATA_POINT_1.y);

    // Check for stream 3 bar 2 We minus two here because of the offset by the number of data stream
    expect(mesh.geometry.attributes.bar.array[10]).toBe(toClipSpace(STREAM_3_DATA_POINT_2.x) - 2 * width);
    expect(mesh.geometry.attributes.bar.array[11]).toBe(STREAM_3_DATA_POINT_2.y);

    // Data stream 1 bar 1 is red, which is rgb(255, 0, 0)
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    // Data stream 1 bar 1 is red, which is rgb(255, 0, 0)
    expect(mesh.geometry.attributes.color.array[3]).toBe(255);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(0);

    // Data stream 2 bar 1 is blue, which is rgb(0, 0, 255)
    expect(mesh.geometry.attributes.color.array[6]).toBe(0);
    expect(mesh.geometry.attributes.color.array[7]).toBe(0);
    expect(mesh.geometry.attributes.color.array[8]).toBe(255);

    // Data stream 2 bar 2 is blue, which is rgb(0, 0, 255)
    expect(mesh.geometry.attributes.color.array[9]).toBe(0);
    expect(mesh.geometry.attributes.color.array[10]).toBe(0);
    expect(mesh.geometry.attributes.color.array[11]).toBe(255);

    // Data stream 3 bar 1 is black, which is rgb(0, 0, 0)
    expect(mesh.geometry.attributes.color.array[12]).toBe(0);
    expect(mesh.geometry.attributes.color.array[13]).toBe(0);
    expect(mesh.geometry.attributes.color.array[14]).toBe(0);

    // Data stream 3 bar 2 is black, which is rgb(0, 0, 0)
    expect(mesh.geometry.attributes.color.array[15]).toBe(0);
    expect(mesh.geometry.attributes.color.array[16]).toBe(0);
    expect(mesh.geometry.attributes.color.array[17]).toBe(0);
  });

  it('draws five bars for three separated data streams with two data points in first and last data stream and one data point in the second data stream ', () => {
    const numberOfDataStreams = 3;
    const resolution = MONTH_IN_MS;
    const dataType = DataType.NUMBER;
    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          resolution,
          data: [],
          aggregates: {
            [resolution]: [STREAM_1_DATA_POINT_1, STREAM_1_DATA_POINT_2],
          },
          color: 'red',
          name: 'data stream 1',
          dataType,
        },
        {
          id: 'data-stream-2',
          resolution,
          data: [],
          aggregates: {
            [resolution]: [STREAM_2_DATA_POINT_1],
          },
          color: 'blue',
          name: 'data stream 2',
          dataType,
        },
        {
          id: 'data-stream-3',
          resolution,
          color: 'black',
          name: 'data stream 3',
          aggregates: {
            [resolution]: [STREAM_3_DATA_POINT_1, STREAM_3_DATA_POINT_2],
          },
          data: [],
          dataType,
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const width = getBarWidth({
      toClipSpace,
      numDataStreams: numberOfDataStreams,
      resolution,
    });

    expect(getDistanceFromDuration(toClipSpace, resolution) - getBarMargin(toClipSpace, resolution)).toEqual(
      width * numberOfDataStreams
    );
    expect(mesh.count).toEqual(5);

    // Check for stream 1 bar 1
    expect(mesh.geometry.attributes.bar.array[0]).toBe(toClipSpace(STREAM_1_DATA_POINT_1.x));
    expect(mesh.geometry.attributes.bar.array[1]).toBe(STREAM_1_DATA_POINT_1.y);

    // Check for stream 1 bar 2
    expect(mesh.geometry.attributes.bar.array[2]).toBe(toClipSpace(STREAM_1_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.bar.array[3]).toBe(STREAM_1_DATA_POINT_2.y);

    // Check for stream 2 bar 1
    expect(mesh.geometry.attributes.bar.array[4]).toBe(toClipSpace(STREAM_2_DATA_POINT_1.x) - width);
    expect(mesh.geometry.attributes.bar.array[5]).toBe(STREAM_2_DATA_POINT_1.y);

    // Check for stream 3 bar 1 We minus two here because of the offset by the number of data stream
    expect(mesh.geometry.attributes.bar.array[6]).toBe(toClipSpace(STREAM_3_DATA_POINT_1.x) - 2 * width);
    expect(mesh.geometry.attributes.bar.array[7]).toBe(STREAM_3_DATA_POINT_1.y);

    // Check for stream 3 bar 2 We minus two here because of the offset by the number of data stream
    expect(mesh.geometry.attributes.bar.array[8]).toBe(toClipSpace(STREAM_3_DATA_POINT_2.x) - 2 * width);
    expect(mesh.geometry.attributes.bar.array[9]).toBe(STREAM_3_DATA_POINT_2.y);

    // Data stream 1 bar 1 is red, which is rgb(255, 0, 0)
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    // Data stream 1 bar 1 is red, which is rgb(255, 0, 0)
    expect(mesh.geometry.attributes.color.array[3]).toBe(255);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(0);

    // Data stream 2 bar 1 is blue, which is rgb(0, 0, 255)
    expect(mesh.geometry.attributes.color.array[6]).toBe(0);
    expect(mesh.geometry.attributes.color.array[7]).toBe(0);
    expect(mesh.geometry.attributes.color.array[8]).toBe(255);

    // Data stream 3 bar 1 is black, which is rgb(0, 0, 0)
    expect(mesh.geometry.attributes.color.array[9]).toBe(0);
    expect(mesh.geometry.attributes.color.array[10]).toBe(0);
    expect(mesh.geometry.attributes.color.array[11]).toBe(0);

    // Data stream 3 bar 2 is black, which is rgb(0, 0, 0)
    expect(mesh.geometry.attributes.color.array[12]).toBe(0);
    expect(mesh.geometry.attributes.color.array[13]).toBe(0);
    expect(mesh.geometry.attributes.color.array[14]).toBe(0);
  });
});

describe('update bar mesh', () => {
  it('updates an empty bar mesh to contain a bar', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: MONTH_IN_MS,
        aggregates: {
          [MONTH_IN_MS]: [DATA_POINT_1, DATA_POINT_2],
        },
        data: [],
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = barMesh({
      dataStreams: [],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(0);
    expect(mesh.material.uniforms.width.value).toEqual(0);

    updateBarMesh({
      bars: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(2);
    expect(mesh.material.uniforms.width.value).toBeGreaterThan(0);

    expect(mesh.geometry.attributes.bar.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(mesh.geometry.attributes.bar.array[1]).toBe(DATA_POINT_1.y);

    expect(mesh.geometry.attributes.bar.array[2]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(mesh.geometry.attributes.bar.array[3]).toBe(DATA_POINT_2.y);

    // Black is rgb(0, 0, 0) and both of them are color black
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    expect(mesh.geometry.attributes.color.array[3]).toBe(0);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(0);
  });

  it('updates a non-empty bar mesh to an empty one', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = barMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(2);

    updateBarMesh({
      bars: mesh,
      dataStreams: [],
      toClipSpace,
      hasDataChanged: true,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(0);

    expect(mesh.geometry.attributes.bar.array[0]).not.toBe(0);
    expect(mesh.geometry.attributes.bar.array[1]).not.toBe(0);

    expect(mesh.geometry.attributes.bar.array[2]).not.toBe(0);
    expect(mesh.geometry.attributes.bar.array[3]).not.toBe(0);
  });

  it('updates a non-empty bar mesh to have an additional one bar mesh', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = barMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(2);

    updateBarMesh({
      bars: mesh,
      dataStreams: DATA_STREAMS,
      toClipSpace,
      hasDataChanged: true,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(3);

    expect(mesh.geometry.attributes.bar.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(mesh.geometry.attributes.bar.array[1]).toBe(DATA_POINT_1.y);

    expect(mesh.geometry.attributes.bar.array[2]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(mesh.geometry.attributes.bar.array[3]).toBe(DATA_POINT_2.y);

    expect(mesh.geometry.attributes.bar.array[4]).toBe(toClipSpace(DATA_POINT_3.x));
    expect(mesh.geometry.attributes.bar.array[5]).toBe(DATA_POINT_3.y);
  });

  it('updates the color of the bar', () => {
    const DATA_STREAM_TEMP: DataStream = {
      id: 'data-stream',
      color: 'black',
      name: 'data-stream-name',
      resolution: MONTH_IN_MS,
      data: [],
      aggregates: {
        [MONTH_IN_MS]: [DATA_POINT_1],
      },
      dataType: DataType.NUMBER,
    };
    const mesh = barMesh({
      dataStreams: [DATA_STREAM_TEMP],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(1);

    // Old bar Colors
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    updateBarMesh({
      bars: mesh,
      dataStreams: [{ ...DATA_STREAM_TEMP, color: 'red' }],
      toClipSpace,
      hasDataChanged: true,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(1);

    // New bar Colors
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);
  });

  it('updates the width of the bar based on resolution of the data', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: MONTH_IN_MS,
        data: [],
        aggregates: {
          [MONTH_IN_MS]: [DATA_POINT_1],
        },
        dataType: DataType.NUMBER,
      },
    ];
    const { resolution } = DATA_STREAM_TEMP[0];
    const oldWidth = getBarWidth({
      toClipSpace,
      numDataStreams: DATA_STREAM_TEMP.length,
      resolution,
    });
    const mesh = barMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(1);
    expect(mesh.material.uniforms.width.value).toBe(oldWidth);

    const DATA_STREAM_TEMP_2 = [
      {
        id: 'data-stream',
        color: 'red',
        name: 'some name',
        resolution: DAY_IN_MS,
        data: [],
        aggregates: {
          [DAY_IN_MS]: [DATA_POINT_1],
        },
        dataType: DataType.NUMBER,
      },
    ];
    updateBarMesh({
      bars: mesh,
      dataStreams: DATA_STREAM_TEMP_2,
      toClipSpace,
      hasDataChanged: true,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const { resolution: newResolution } = DATA_STREAM_TEMP_2[0];
    const newWidth = getBarWidth({
      toClipSpace,
      numDataStreams: DATA_STREAM_TEMP.length,
      resolution: newResolution,
    });
    expect(mesh.count).toEqual(1);
    expect(mesh.material.uniforms.width.value).toBe(newWidth);
  });

  it('does not update the mesh when the data has not changed', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      {
        id: 'data-stream',
        color: 'black',
        name: 'some name',
        resolution: MONTH_IN_MS,
        data: [],
        aggregates: {
          [MONTH_IN_MS]: [DATA_POINT_1],
        },
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = barMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(1);

    const DATA_STREAM_TEMP_2: DataStream[] = [
      {
        id: 'data-stream',
        color: 'red',
        name: 'some name',
        resolution: MONTH_IN_MS,
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    updateBarMesh({
      bars: mesh,
      dataStreams: DATA_STREAM_TEMP_2,
      toClipSpace,
      hasDataChanged: false,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.count).toEqual(1);
  });
});

describe('threshold correctly effects the color buffer', () => {
  it('does not initialize color buffer with threshold color for a single bar when threshold coloration is off', () => {
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 2,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          color: 'black',
          resolution: MONTH_IN_MS,
          data: [],
          aggregates: {
            [MONTH_IN_MS]: [DATA_POINT_1],
          },
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      minBufferSize: 1,
      bufferFactor: 1,
      thresholds,
      thresholdOptions: {
        showColor: false,
      },
    });
    expect(mesh.count).toEqual(1);

    // Black
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);
  });

  it('initializes color buffer with the correct threshold color for a single bar', () => {
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 2,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream',
          color: 'black',
          name: 'some name',
          resolution: MONTH_IN_MS,
          data: [],
          aggregates: {
            [MONTH_IN_MS]: [DATA_POINT_1],
          },
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      minBufferSize: 1,
      bufferFactor: 1,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);
  });

  it('initializes color buffer with the correct threshold color for multiple streams with different colors', () => {
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 250,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some chart',
          color: 'purple',
          resolution: MONTH_IN_MS,
          aggregates: {
            [MONTH_IN_MS]: [DATA_POINT_1],
          },
          data: [],
          dataType: DataType.NUMBER,
        },
        {
          id: 'data-stream-2',
          name: 'some chart 2',
          color: 'blue',
          resolution: MONTH_IN_MS,
          aggregates: {
            [MONTH_IN_MS]: [DATA_POINT_2],
          },
          data: [],
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      minBufferSize: 1,
      bufferFactor: 1,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(2);

    // Purple
    expect(mesh.geometry.attributes.color.array[0]).toBe(128);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(128);

    // Red
    expect(mesh.geometry.attributes.color.array[3]).toBe(255);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(0);
  });

  it('updates the color buffer when threshold coloration is turned off', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      {
        id: 'data-stream',
        color: 'black',
        name: 'some name',
        resolution: MONTH_IN_MS,
        data: [],
        aggregates: {
          [MONTH_IN_MS]: [DATA_POINT_1],
        },
        dataType: DataType.NUMBER,
      },
    ];
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 2,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    updateBarMesh({
      bars: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      thresholds,
      thresholdOptions: {
        showColor: false,
      },
    });
    expect(mesh.count).toEqual(1);

    // black
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);
  });

  it('updates the color buffer when point breached threshold, despite the data stream color change', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      {
        id: 'data-stream',
        color: 'black',
        name: 'some name',
        resolution: MONTH_IN_MS,
        data: [],
        aggregates: {
          [MONTH_IN_MS]: [DATA_POINT_1],
        },
        dataType: DataType.NUMBER,
      },
    ];
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 2,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    updateBarMesh({
      bars: mesh,
      dataStreams: [{ ...DATA_STREAM_TEMP[0], color: 'purple' }],
      toClipSpace,
      hasDataChanged: true,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);
  });

  it('updates the color buffer when value went from non breaching to breaching', () => {
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 250,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream',
          color: 'black',
          name: 'some name',
          resolution: MONTH_IN_MS,
          data: [],
          aggregates: {
            [MONTH_IN_MS]: [DATA_POINT_1],
          },
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Black
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    updateBarMesh({
      bars: mesh,
      dataStreams: [
        {
          id: 'data-stream',
          color: 'black',
          name: 'some name',
          resolution: MONTH_IN_MS,
          data: [],
          aggregates: {
            [MONTH_IN_MS]: [DATA_POINT_2],
          },
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      hasDataChanged: true,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);
  });

  it('updates the color buffer when value went from non breaching to breaching', () => {
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 250,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: [
        {
          id: 'data-stream',
          color: 'black',
          name: 'some name',
          resolution: MONTH_IN_MS,
          data: [],
          aggregates: {
            [MONTH_IN_MS]: [DATA_POINT_2],
          },
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    updateBarMesh({
      bars: mesh,
      dataStreams: [
        {
          id: 'data-stream',
          color: 'black',
          name: 'some name',
          resolution: MONTH_IN_MS,
          data: [],
          aggregates: {
            [MONTH_IN_MS]: [DATA_POINT_1],
          },
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      hasDataChanged: true,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Black
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);
  });

  it('updates the color buffer with the correct threshold color for multiple streams with different colors', () => {
    const dataStreams: DataStream[] = [
      {
        id: 'data-stream',

        color: 'black',
        name: 'data-stream-name',
        resolution: MONTH_IN_MS,
        data: [],
        aggregates: {
          [MONTH_IN_MS]: [DATA_POINT_1],
        },
        dataType: DataType.NUMBER,
      },
      {
        id: 'data-stream-2',
        color: 'blue',
        name: 'data-stream-name',
        resolution: MONTH_IN_MS,
        data: [],
        aggregates: {
          [MONTH_IN_MS]: [DATA_POINT_2],
        },
        dataType: DataType.NUMBER,
      },
    ];
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 2,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(2);

    // Black
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    // Blue
    expect(mesh.geometry.attributes.color.array[3]).toBe(0);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(255);

    const thresholds2: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 250,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
    ];

    updateBarMesh({
      bars: mesh,
      dataStreams,
      toClipSpace,
      hasDataChanged: true,
      thresholds: thresholds2,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(2);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    // Blue
    expect(mesh.geometry.attributes.color.array[3]).toBe(0);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(255);
  });

  it('updates the color buffer with the upper threshold when a positive point breached two threshold', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      {
        id: 'data-stream',
        color: 'purple',
        name: 'some name',
        resolution: MONTH_IN_MS,
        data: [],
        aggregates: {
          [MONTH_IN_MS]: [DATA_POINT_1],
        },
        dataType: DataType.NUMBER,
      },
    ];
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: 2,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    const thresholds2: Threshold[] = [
      {
        color: 'blue',
        label: {
          text: 'HH',
          show: true,
        },
        value: 250,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
    ];

    updateBarMesh({
      bars: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      thresholds: [...thresholds, ...thresholds2],
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Blue
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(255);
  });

  it('updates the color buffer with the lower threshold when a negative point breached two threshold', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [{ x: new Date(2000, 0, 0).getTime(), y: -200 }],
        dataType: DataType.NUMBER,
      },
    ];
    const thresholds: Threshold[] = [
      {
        color: 'red',
        label: {
          text: 'HH',
          show: true,
        },
        value: -2,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      },
    ];

    const mesh = barMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    const thresholds2: Threshold[] = [
      {
        color: 'blue',
        label: {
          text: 'HH',
          show: true,
        },
        value: -250,
        showValue: false,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      },
    ];

    updateBarMesh({
      bars: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      thresholds: [...thresholds, ...thresholds2],
      thresholdOptions: {
        showColor: true,
      },
    });
    expect(mesh.count).toEqual(1);

    // Blue
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(255);
  });
});
