import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { bucketMesh, updateBucketMesh, COLOR_PALETTE, getResolution } from './heatmapMesh';
import { BUCKET_COUNT } from './heatmapConstants';
import { calculateXBucketStart, calculateBucketIndex } from './heatmapUtil';
import { getBucketMargin, getBucketWidth } from './displayLogic';
import { getDistanceFromDuration } from '../common/getDistanceFromDuration';
import { DataType } from '../../../utils/dataConstants';
import { MONTH_IN_MS } from '../../../utils/time';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';

const VIEW_PORT: ViewPort = { start: new Date(2000, 0, 0), end: new Date(2000, 0, 1), yMin: 0, yMax: 500 };
const RESOLUTION = getResolution(VIEW_PORT);
const BUCKET_HEIGHT = VIEW_PORT.yMax / 10;
const toClipSpace = clipSpaceConversion(VIEW_PORT);

const BUFFER_FACTOR = 2;
const MIN_BUFFER_SIZE = 100;

const DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 0, 1).getTime(), y: 200 };
const DATA_POINT_2: DataPoint = { x: new Date(2000, 0, 0, 4).getTime(), y: 300 };
const DATA_POINT_3: DataPoint = { x: new Date(2000, 0, 1, 1).getTime(), y: 400 };

const DATA_POINT_1_X_BUCKET = calculateXBucketStart({ xValue: DATA_POINT_1.x, xAxisBucketRange: RESOLUTION });
const DATA_POINT_2_X_BUCKET = calculateXBucketStart({ xValue: DATA_POINT_2.x, xAxisBucketRange: RESOLUTION });
const DATA_POINT_3_X_BUCKET = calculateXBucketStart({ xValue: DATA_POINT_3.x, xAxisBucketRange: RESOLUTION });

const DATA_POINT_1_Y_BUCKET = calculateBucketIndex({
  yValue: DATA_POINT_1.y as number,
  yMax: VIEW_PORT.yMax,
  yMin: VIEW_PORT.yMin,
  bucketCount: BUCKET_COUNT,
});
const DATA_POINT_2_Y_BUCKET = calculateBucketIndex({
  yValue: DATA_POINT_2.y as number,
  yMax: VIEW_PORT.yMax,
  yMin: VIEW_PORT.yMin,
  bucketCount: BUCKET_COUNT,
});
const DATA_POINT_3_Y_BUCKET = calculateBucketIndex({
  yValue: DATA_POINT_3.y as number,
  yMax: VIEW_PORT.yMax,
  yMin: VIEW_PORT.yMin,
  bucketCount: BUCKET_COUNT,
});

const DATA_STREAMS: DataStream[] = [
  {
    id: 'data-stream',
    name: 'some name',
    resolution: 0,
    data: [DATA_POINT_1, DATA_POINT_2, DATA_POINT_3],
    dataType: DataType.NUMBER,
  },
];

describe('create bucket mesh', () => {
  it('sets the width uniform', () => {
    const mesh = bucketMesh({
      dataStreams: DATA_STREAMS,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
    });

    expect(mesh.material.uniforms.width.value).toBeGreaterThan(0);
    expect(mesh.material.uniforms.bucketHeight.value).toBeGreaterThan(0);
  });

  it('draws no buckets with an empty data set', () => {
    const mesh = bucketMesh({
      dataStreams: [],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(0);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(0);
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(0);
  });

  it('increase buffer size when there are more buckets than the minimum buffer size', () => {
    const mesh = bucketMesh({
      dataStreams: DATA_STREAMS,
      toClipSpace,
      minBufferSize: 1,
      bufferFactor: 1,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(3 * BUCKET_COUNT);

    // bucket points
    expect(mesh.geometry.attributes.bucket.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.bucket.array[1]).toBeDefined();

    expect(mesh.geometry.attributes.bucket.array[2]).toBeDefined();
    expect(mesh.geometry.attributes.bucket.array[3]).toBeDefined();

    expect(mesh.geometry.attributes.bucket.array[4]).toBeDefined();
    expect(mesh.geometry.attributes.bucket.array[5]).toBeDefined();

    // bucket Colors
    expect(mesh.geometry.attributes.color.array[0]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[1]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[2]).toBeCloseTo(COLOR_PALETTE.b[0], -1);

    expect(mesh.geometry.attributes.color.array[3]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[4]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[5]).toBeCloseTo(COLOR_PALETTE.b[0], -1);

    expect(mesh.geometry.attributes.color.array[6]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[7]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[8]).toBeCloseTo(COLOR_PALETTE.b[0], -1);
  });

  it('draws one bucket with darkest opacity', () => {
    const viewport: ViewPort = {
      duration: 1000,
      start: new Date(2000, 0, 0),
      end: new Date(2000, 0, 0, 0, 0, 10),
      yMin: 0,
      yMax: 500
    };
    const mesh = bucketMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          data: [DATA_POINT_1],
          dataType: DataType.NUMBER,
        },
      ],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport,
    }); 

    expect(mesh.count).toEqual(1 * BUCKET_COUNT);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    expect(mesh.geometry.attributes.color.array[0]).toBeCloseTo(COLOR_PALETTE.r[7], -1);
    expect(mesh.geometry.attributes.color.array[1]).toBeCloseTo(COLOR_PALETTE.g[7], -1);
    expect(mesh.geometry.attributes.color.array[2]).toBeCloseTo(COLOR_PALETTE.b[7], -1);
  });

  it('draws two buckets with two point data set', () => {
    const mesh = bucketMesh({
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
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(2 * BUCKET_COUNT);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    expect(mesh.geometry.attributes.bucket.array[2]).toBe(toClipSpace(DATA_POINT_2_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[3]).toBe(BUCKET_HEIGHT * DATA_POINT_2_Y_BUCKET);

    expect(mesh.geometry.attributes.color.array[0]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[1]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[2]).toBeCloseTo(COLOR_PALETTE.b[0], -1);

    expect(mesh.geometry.attributes.color.array[3]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[4]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[5]).toBeCloseTo(COLOR_PALETTE.b[0], -1);
  });

  it('draws three buckets for two separated data streams with two data points in each data stream', () => {
    const mesh = bucketMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          color: 'red',
          name: 'some name',
          resolution: 0,
          data: [DATA_POINT_1, DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
        {
          id: 'data-stream-2',
          color: 'blue',
          name: 'some name',
          resolution: 0,
          data: [DATA_POINT_2, DATA_POINT_3],
          dataType: DataType.NUMBER,
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      viewport: VIEW_PORT,
    });

    const width = getBucketWidth({
      toClipSpace,
      resolution: RESOLUTION,
    });

    expect(getDistanceFromDuration(toClipSpace, RESOLUTION) - getBucketMargin(toClipSpace, RESOLUTION)).toEqual(width);
    expect(mesh.count).toEqual(3 * BUCKET_COUNT);

    // Check for stream 1 bucket 1
    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    // Check for stream 1 bucket 2
    expect(mesh.geometry.attributes.bucket.array[2]).toBe(toClipSpace(DATA_POINT_2_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[3]).toBe(BUCKET_HEIGHT * DATA_POINT_2_Y_BUCKET);

    // Check for stream 2 bucket 1, bucket 1 same as stream 1 bucket 2
    expect(mesh.geometry.attributes.bucket.array[4]).toBe(toClipSpace(DATA_POINT_3_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[5]).toBe(BUCKET_HEIGHT * DATA_POINT_3_Y_BUCKET);

    // Data stream buckets are all lightest opacity
    expect(mesh.geometry.attributes.color.array[0]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[1]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[2]).toBeCloseTo(COLOR_PALETTE.b[0], -1);

    expect(mesh.geometry.attributes.color.array[3]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[4]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[5]).toBeCloseTo(COLOR_PALETTE.b[0], -1);

    expect(mesh.geometry.attributes.color.array[6]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[7]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[8]).toBeCloseTo(COLOR_PALETTE.b[0], -1);
  });

  it('draws three buckets for three separated data streams with two data points in first and last data stream and one data point in the second data stream ', () => {
    const numberOfDataStreams = 3;
    const dataType = DataType.NUMBER;
    const mesh = bucketMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          color: 'red',
          name: 'some name',
          resolution: 0,
          data: [
            DATA_POINT_1,
            DATA_POINT_2,
          ],
          dataType: DataType.NUMBER,
        },
        {
          id: 'data-stream-2',
          color: 'blue',
          name: 'some name',
          resolution: 0,
          data: [
            DATA_POINT_1
          ],
          dataType: DataType.NUMBER,
        },
        {
          id: 'data-stream-3',
          name: 'some name',
          resolution: 0,
          data: [
            DATA_POINT_2,
            DATA_POINT_3
          ],
          dataType: DataType.NUMBER,
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      viewport: VIEW_PORT,
    });

    const width = getBucketWidth({
      toClipSpace,
      resolution: RESOLUTION,
    });

    expect(getDistanceFromDuration(toClipSpace, RESOLUTION) - getBucketMargin(toClipSpace, RESOLUTION)).toEqual(
      width
    );
    expect(mesh.count).toEqual(3 * BUCKET_COUNT);

    // Check for data point 1
    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    // Check for data point 2
    expect(mesh.geometry.attributes.bucket.array[2]).toBe(toClipSpace(DATA_POINT_2_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[3]).toBe(BUCKET_HEIGHT * DATA_POINT_2_Y_BUCKET);

    // Check for data point 3
    expect(mesh.geometry.attributes.bucket.array[4]).toBe(toClipSpace(DATA_POINT_3_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[5]).toBe(BUCKET_HEIGHT * DATA_POINT_3_Y_BUCKET);

    // only 3 buckets, 4th should be empty
    expect(mesh.geometry.attributes.bucket.array[6]).toBe(0);
    expect(mesh.geometry.attributes.bucket.array[7]).toBe(0);

    expect(mesh.geometry.attributes.color.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[1]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[2]).toBeDefined();

    expect(mesh.geometry.attributes.color.array[3]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[4]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[5]).toBeDefined();

    expect(mesh.geometry.attributes.color.array[6]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[7]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[8]).toBeDefined();

    // only 3 buckets, 4th bucket should be empty
    expect(mesh.geometry.attributes.color.array[0]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[1]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[2]).toBeCloseTo(COLOR_PALETTE.b[0], -1);
  });
});

describe('update bucket mesh', () => {
  it('updates an empty bucket mesh to contain a bucket', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = bucketMesh({
      dataStreams: [],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(0);
    expect(mesh.material.uniforms.width.value).toEqual(0);

    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(1 * BUCKET_COUNT);
    expect(mesh.material.uniforms.width.value).toBeGreaterThan(0);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    expect(mesh.geometry.attributes.color.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[1]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[2]).toBeDefined();
  });

  it('updates a non-empty bucket mesh to an empty one', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = bucketMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(2 * BUCKET_COUNT);

    updateBucketMesh({
      buckets: mesh,
      dataStreams: [],
      toClipSpace,
      hasDataChanged: true,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(0);

    expect(mesh.geometry.attributes.bucket.array[0]).not.toBe(0);
    expect(mesh.geometry.attributes.bucket.array[1]).not.toBe(0);

    expect(mesh.geometry.attributes.bucket.array[2]).not.toBe(0);
    expect(mesh.geometry.attributes.bucket.array[3]).not.toBe(0);
  });

  it('updates a non-empty bucket mesh to have an additional one bucket mesh', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = bucketMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(2 * BUCKET_COUNT);

    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAMS,
      toClipSpace,
      hasDataChanged: true,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(3 * BUCKET_COUNT);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    expect(mesh.geometry.attributes.bucket.array[2]).toBe(toClipSpace(DATA_POINT_2_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[3]).toBe(BUCKET_HEIGHT * DATA_POINT_2_Y_BUCKET);

    expect(mesh.geometry.attributes.bucket.array[4]).toBe(toClipSpace(DATA_POINT_3_X_BUCKET));
    expect(mesh.geometry.attributes.bucket.array[5]).toBe(BUCKET_HEIGHT * DATA_POINT_3_Y_BUCKET);
  });

  it('updates the color of the bucket', () => {
    const viewport: ViewPort = {
      duration: 1000,
      start: new Date(2000, 0, 0),
      end: new Date(2000, 0, 0, 0, 0, 10),
      yMin: 0,
      yMax: 500
    };
    const DATA_STREAM_TEMP_1: DataStream = {
      id: 'data-stream',
      color: 'black',
      name: 'data-stream-name',
      resolution: 0,
      data: [DATA_POINT_1],
      dataType: DataType.NUMBER,
    };
    const DATA_STREAM_TEMP_2: DataStream = {
      id: 'data-stream',
      color: 'black',
      name: 'data-stream-name',
      resolution: 0,
      data: [],
      dataType: DataType.NUMBER,
    };
    const mesh = bucketMesh({
      dataStreams: [DATA_STREAM_TEMP_1],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport,
    });
    expect(mesh.count).toEqual(1 * BUCKET_COUNT);

    // Old bucket Colors
    expect(mesh.geometry.attributes.color.array[0]).toBeCloseTo(COLOR_PALETTE.r[7], -1);
    expect(mesh.geometry.attributes.color.array[1]).toBeCloseTo(COLOR_PALETTE.g[7], -1);
    expect(mesh.geometry.attributes.color.array[2]).toBeCloseTo(COLOR_PALETTE.b[7], -1);

    updateBucketMesh({
      buckets: mesh,
      dataStreams: [DATA_STREAM_TEMP_1, DATA_STREAM_TEMP_2],
      toClipSpace,
      hasDataChanged: true,
      viewport,
    });
    expect(mesh.count).toEqual(1 * BUCKET_COUNT);

    // New bucket Colors
    expect(mesh.geometry.attributes.color.array[0]).toBe(COLOR_PALETTE.r[4]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(COLOR_PALETTE.g[4]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(COLOR_PALETTE.b[4]);
  });

  it('updates the width of the bucket based on resolution of the data', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];
    const resolution = getResolution(VIEW_PORT);
    const oldWidth = getBucketWidth({
      toClipSpace,
      resolution,
    });
    const mesh = bucketMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(1 * BUCKET_COUNT);
    expect(mesh.material.uniforms.width.value).toBe(oldWidth);

    const newViewport: ViewPort = {
      duration: 60000,
      start: new Date(2000, 0, 0),
      end: new Date(2000, 0, 0, 0, 0, 10),
      yMin: 0,
      yMax: 500
    };
    const DATA_STREAM_TEMP_2 = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];
    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAM_TEMP_2,
      toClipSpace,
      hasDataChanged: true,
      viewport: newViewport,
    });

    const newResolution = getResolution(newViewport);
    const newWidth = getBucketWidth({
      toClipSpace,
      resolution: newResolution,
    });
    expect(mesh.count).toEqual(1 * BUCKET_COUNT);
    expect(mesh.material.uniforms.width.value).toBe(newWidth);
  });

  it('does not update the mesh when the data has not changed', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      {
        id: 'data-stream',
        color: 'black',
        name: 'some name',
        resolution: MONTH_IN_MS,
        data: [DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = bucketMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(1 * BUCKET_COUNT);

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
    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAM_TEMP_2,
      toClipSpace,
      hasDataChanged: false,
      viewport: VIEW_PORT,
    });
    expect(mesh.count).toEqual(1 * BUCKET_COUNT);
  });
});
