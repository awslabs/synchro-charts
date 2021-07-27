import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { bucketMesh, updateBucketMesh, COLOR_PALETTE } from './heatmapMesh';
import { BUCKET_COUNT } from './heatmapConstants';
import {
  calculateXBucketStart,
  calculateBucketIndex,
  getXBucketRange,
  calcHeatValues,
  HeatValueMap,
} from './heatmapUtil';
import { getXBucketWidth } from './displayLogic';
import { DataType } from '../../../utils/dataConstants';
import { MONTH_IN_MS } from '../../../utils/time';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';

const VIEW_PORT: ViewPort = { start: new Date(2000, 0, 0), end: new Date(2000, 0, 1), yMin: 0, yMax: 500 };
const X_BUCKET_RANGE = getXBucketRange(VIEW_PORT);
const BUCKET_HEIGHT = VIEW_PORT.yMax / 10;
const toClipSpace = clipSpaceConversion(VIEW_PORT);

const BUFFER_FACTOR = 2;
const MIN_BUFFER_SIZE = 100;

const DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 0, 1).getTime(), y: 200 };
const DATA_POINT_2: DataPoint = { x: new Date(2000, 0, 0, 4).getTime(), y: 300 };
const DATA_POINT_3: DataPoint = { x: new Date(2000, 0, 1, 1).getTime(), y: 400 };

const DATA_POINT_1_X_BUCKET = calculateXBucketStart({ xValue: DATA_POINT_1.x, xBucketRange: X_BUCKET_RANGE });
const DATA_POINT_2_X_BUCKET = calculateXBucketStart({ xValue: DATA_POINT_2.x, xBucketRange: X_BUCKET_RANGE });
const DATA_POINT_3_X_BUCKET = calculateXBucketStart({ xValue: DATA_POINT_3.x, xBucketRange: X_BUCKET_RANGE });

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

const HEAT_VALUES: HeatValueMap = calcHeatValues({
  oldHeatValue: {},
  dataStreams: DATA_STREAMS,
  xBucketRange: X_BUCKET_RANGE,
  viewport: VIEW_PORT,
  bucketCount: BUCKET_COUNT,
});

describe('create bucket mesh', () => {
  it('sets the width uniform', () => {
    const mesh = bucketMesh({
      dataStreams: DATA_STREAMS,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
      heatValues: HEAT_VALUES,
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
      heatValues: {},
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
      heatValues: HEAT_VALUES,
    });
    expect(mesh.count).toEqual(3);

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
      yMax: 500,
    };
    const dataStreams = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];
    const xBucketRange = getXBucketRange(viewport);
    const heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams,
      xBucketRange,
      viewport,
      bucketCount: BUCKET_COUNT,
    });
    const mesh = bucketMesh({
      dataStreams,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport,
      heatValues,
    });

    expect(mesh.count).toEqual(1);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET + xBucketRange));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    expect(mesh.geometry.attributes.color.array[0]).toBeCloseTo(COLOR_PALETTE.r[7], -1);
    expect(mesh.geometry.attributes.color.array[1]).toBeCloseTo(COLOR_PALETTE.g[7], -1);
    expect(mesh.geometry.attributes.color.array[2]).toBeCloseTo(COLOR_PALETTE.b[7], -1);
  });

  it('draws two buckets with two point data set', () => {
    const dataStreams = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    const heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    const mesh = bucketMesh({
      dataStreams,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
      heatValues,
    });
    expect(mesh.count).toEqual(2);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET + X_BUCKET_RANGE));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    expect(mesh.geometry.attributes.bucket.array[2]).toBe(toClipSpace(DATA_POINT_2_X_BUCKET + X_BUCKET_RANGE));
    expect(mesh.geometry.attributes.bucket.array[3]).toBe(BUCKET_HEIGHT * DATA_POINT_2_Y_BUCKET);

    expect(mesh.geometry.attributes.color.array[0]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[1]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[2]).toBeCloseTo(COLOR_PALETTE.b[0], -1);

    expect(mesh.geometry.attributes.color.array[3]).toBeCloseTo(COLOR_PALETTE.r[0], -1);
    expect(mesh.geometry.attributes.color.array[4]).toBeCloseTo(COLOR_PALETTE.g[0], -1);
    expect(mesh.geometry.attributes.color.array[5]).toBeCloseTo(COLOR_PALETTE.b[0], -1);
  });
});

describe('update bucket mesh', () => {
  it('updates an empty bucket mesh to contain a bucket using hasDataChanged', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];
    const heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: [],
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    const mesh = bucketMesh({
      dataStreams: [],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
      heatValues,
    });
    expect(mesh.count).toEqual(0);
    expect(mesh.material.uniforms.width.value).toEqual(0);

    const newHeatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: DATA_STREAM_TEMP,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      viewport: VIEW_PORT,
      shouldRerender: false,
      heatValues: newHeatValues,
    });
    expect(mesh.count).toEqual(1);
    expect(mesh.material.uniforms.width.value).toBeGreaterThan(0);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET + X_BUCKET_RANGE));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    expect(mesh.geometry.attributes.color.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[1]).toBeDefined();
    expect(mesh.geometry.attributes.color.array[2]).toBeDefined();
  });

  it('updates an empty bucket mesh to contain a bucket using shouldRerender', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];
    const heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: [],
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    const mesh = bucketMesh({
      dataStreams: [],
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
      heatValues,
    });
    expect(mesh.count).toEqual(0);
    expect(mesh.material.uniforms.width.value).toEqual(0);

    const newHeatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: DATA_STREAM_TEMP,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: false,
      viewport: VIEW_PORT,
      shouldRerender: true,
      heatValues: newHeatValues,
    });
    expect(mesh.count).toEqual(1);
    expect(mesh.material.uniforms.width.value).toBeGreaterThan(0);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET + X_BUCKET_RANGE));
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
    const heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: DATA_STREAM_TEMP,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    const mesh = bucketMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
      heatValues,
    });
    expect(mesh.count).toEqual(2);

    updateBucketMesh({
      buckets: mesh,
      dataStreams: [],
      toClipSpace,
      hasDataChanged: true,
      viewport: VIEW_PORT,
      shouldRerender: true,
      heatValues: {},
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
    const heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: DATA_STREAM_TEMP,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });

    const mesh = bucketMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
      heatValues,
    });
    expect(mesh.count).toEqual(2);

    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAMS,
      toClipSpace,
      hasDataChanged: true,
      viewport: VIEW_PORT,
      shouldRerender: true,
      heatValues: HEAT_VALUES,
    });
    expect(mesh.count).toEqual(3);

    expect(mesh.geometry.attributes.bucket.array[0]).toBe(toClipSpace(DATA_POINT_1_X_BUCKET + X_BUCKET_RANGE));
    expect(mesh.geometry.attributes.bucket.array[1]).toBe(BUCKET_HEIGHT * DATA_POINT_1_Y_BUCKET);

    expect(mesh.geometry.attributes.bucket.array[2]).toBe(toClipSpace(DATA_POINT_2_X_BUCKET + X_BUCKET_RANGE));
    expect(mesh.geometry.attributes.bucket.array[3]).toBe(BUCKET_HEIGHT * DATA_POINT_2_Y_BUCKET);

    expect(mesh.geometry.attributes.bucket.array[4]).toBe(toClipSpace(DATA_POINT_3_X_BUCKET + X_BUCKET_RANGE));
    expect(mesh.geometry.attributes.bucket.array[5]).toBe(BUCKET_HEIGHT * DATA_POINT_3_Y_BUCKET);
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
    const xBucketRange = getXBucketRange(VIEW_PORT);
    const oldWidth = getXBucketWidth({
      toClipSpace,
      xBucketRange,
    });
    const heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: DATA_STREAM_TEMP,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    const mesh = bucketMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
      heatValues,
    });
    expect(mesh.count).toEqual(1);
    expect(mesh.material.uniforms.width.value).toBe(oldWidth);

    const newViewport: ViewPort = {
      duration: 60000,
      start: new Date(2000, 0, 0),
      end: new Date(2000, 0, 0, 0, 0, 10),
      yMin: 0,
      yMax: 500,
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
    const newHeatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: DATA_STREAM_TEMP_2,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAM_TEMP_2,
      toClipSpace,
      hasDataChanged: true,
      viewport: newViewport,
      shouldRerender: true,
      heatValues: newHeatValues,
    });

    const newXBucketRange = getXBucketRange(newViewport);
    const newWidth = getXBucketWidth({
      toClipSpace,
      xBucketRange: newXBucketRange,
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
        data: [DATA_POINT_1],
        dataType: DataType.NUMBER,
      },
    ];
    const heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: DATA_STREAM_TEMP,
      xBucketRange: X_BUCKET_RANGE,
      viewport: VIEW_PORT,
      bucketCount: BUCKET_COUNT,
    });
    const mesh = bucketMesh({
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      viewport: VIEW_PORT,
      heatValues,
    });
    expect(mesh.count).toEqual(1);

    updateBucketMesh({
      buckets: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: false,
      viewport: VIEW_PORT,
      shouldRerender: false,
      heatValues,
    });
    expect(mesh.count).toEqual(1);
  });
});
