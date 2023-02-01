import { NUM_STATUS_COMPONENTS, statusMesh, updateStatusMesh } from './statusMesh';
import { DEFAULT_STATUS_BAR_COLOR_1, DEFAULT_STATUS_BAR_COLOR_2, HEIGHT } from './constants';
import { DAY_IN_MS, MINUTE_IN_MS } from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';
import { DataPoint, DataStream } from '../../../utils/dataTypes';
import { Threshold } from '../common/types';
import { COMPARISON_OPERATOR } from '../common/constants';

const toClipSpace = (x: number) => x / DAY_IN_MS;

const BUFFER_FACTOR = 4;
const MIN_BUFFER_SIZE = 100;

const DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 0).getTime(), y: 200 };
const DATA_POINT_2: DataPoint = { x: new Date(2000, 0, 1).getTime(), y: 300 };
const DATA_POINT_3: DataPoint = { x: new Date(2000, 0, 1).getTime(), y: 400 };

const STREAM_1_DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 1).getTime(), y: 200 };
const STREAM_1_DATA_POINT_2: DataPoint = { x: new Date(2000, 0, 2).getTime(), y: 300 };
const STREAM_2_DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 3).getTime(), y: 400 };
const STREAM_2_DATA_POINT_2: DataPoint = { x: new Date(2000, 0, 4).getTime(), y: 500 };

const EXPECTED_WIDTH = MINUTE_IN_MS / DAY_IN_MS;

const CHART_SIZE = { width: 100, height: 400 };

const DATA_STREAMS: DataStream[] = [
  {
    id: 'data-stream',
    color: 'black',
    name: 'data-stream-name',
    resolution: 0,
    data: [DATA_POINT_1, DATA_POINT_2, DATA_POINT_3],
    dataType: DataType.NUMBER,
  },
];

const BASE_PROPS = {
  alarms: { expires: MINUTE_IN_MS },
  chartSize: CHART_SIZE,
  dataStreams: [
    { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_1, DATA_POINT_2] },
  ],
  toClipSpace,
  minBufferSize: MIN_BUFFER_SIZE,
  bufferFactor: BUFFER_FACTOR,
  thresholdOptions: {
    showColor: false,
  },
  thresholds: [],
};

describe('create status mesh', () => {
  it('draws no status with an empty data set', () => {
    const mesh = statusMesh({
      ...BASE_PROPS,
      dataStreams: [],
    });
    expect(mesh.count).toEqual(0);
  });

  it('increase buffer size when there are more statuses than the minimum buffer size', () => {
    const mesh = statusMesh({
      ...BASE_PROPS,
      dataStreams: DATA_STREAMS,
      minBufferSize: 1,
      bufferFactor: 1,
    });
    expect(mesh.count).toEqual(3);

    // Status points
    expect(mesh.geometry.attributes.status.array[11]).toBeDefined();

    // Status Colors
    expect(mesh.geometry.attributes.color.array[8]).toBeDefined();
  });

  it('status mesh gets extended till present time when `alarms.expires` is undefined', () => {
    const now = Date.now();
    const mesh = statusMesh({
      ...BASE_PROPS,
      alarms: { expires: undefined },
    });
    expect(mesh.count).toEqual(2);

    const bar1X = mesh.geometry.attributes.status.array[0];
    const bar1Width = mesh.geometry.attributes.status.array[2];

    /** First bar is rendered up until the next point */
    expect(bar1X).toBe(toClipSpace(DATA_POINT_1.x));
    expect(bar1Width).toBeCloseTo(toClipSpace(DATA_POINT_2.x - DATA_POINT_1.x), 8);

    const bar2X = mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS];
    expect(bar2X).toBe(toClipSpace(DATA_POINT_2.x));

    /** Second bar, which is also the last bar, gets extended until present time. */
    const bar2Width = mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS + 2];
    expect(bar2Width).toBeCloseTo(toClipSpace(now - DATA_POINT_2.x), 2);
  });

  it('draws one status with single-point data set', () => {
    const mesh = statusMesh({
      alarms: { expires: MINUTE_IN_MS },
      chartSize: CHART_SIZE,
      dataStreams: [
        { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_1] },
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

    expect(mesh.geometry.attributes.status.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(mesh.geometry.attributes.status.array[1]).toBe(0);
    expect(mesh.geometry.attributes.status.array[2]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[3]).toBeLessThan(HEIGHT);
  });

  it('draws adjacent data points as the same gray color when the data points have the same y value', () => {
    const mesh = statusMesh({
      ...BASE_PROPS,
      dataStreams: [
        {
          id: 'data-stream',
          name: 'name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [DATA_POINT_1, { ...DATA_POINT_2, y: DATA_POINT_1.y }], // 2 points with the same y
        },
      ],
    });
    expect(mesh.count).toEqual(2);

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[3]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[4]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[5]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);
  });

  it('draws two statuses with two point data set', () => {
    const mesh = statusMesh({
      ...BASE_PROPS,
      dataStreams: [
        {
          id: 'data-stream',
          name: 'name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [DATA_POINT_1, DATA_POINT_2],
        },
      ],
    });
    expect(mesh.count).toEqual(2);

    expect(mesh.geometry.attributes.status.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(mesh.geometry.attributes.status.array[1]).toBe(0);
    expect(mesh.geometry.attributes.status.array[2]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[3]).toBeLessThan(HEIGHT);

    expect(mesh.geometry.attributes.status.array[4]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(mesh.geometry.attributes.status.array[5]).toBe(0);
    expect(mesh.geometry.attributes.status.array[6]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[7]).toBeLessThan(HEIGHT);

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

    // default status bar color 2
    expect(mesh.geometry.attributes.color.array[3]).toBe(DEFAULT_STATUS_BAR_COLOR_2[0]);
    expect(mesh.geometry.attributes.color.array[4]).toBe(DEFAULT_STATUS_BAR_COLOR_2[1]);
    expect(mesh.geometry.attributes.color.array[5]).toBe(DEFAULT_STATUS_BAR_COLOR_2[2]);
  });

  it('constructs buffers correctly for multiple data streams', () => {
    const mesh = statusMesh({
      ...BASE_PROPS,
      dataStreams: [
        {
          id: 'data-stream-1',
          name: 'some-name',
          resolution: 0,
          data: [STREAM_1_DATA_POINT_1, STREAM_1_DATA_POINT_2],
          color: 'red',
          dataType: DataType.NUMBER,
        },
        {
          id: 'data-stream-2',
          name: 'some-name',
          resolution: 0,
          data: [STREAM_2_DATA_POINT_1, STREAM_2_DATA_POINT_2],
          color: 'blue',
          dataType: DataType.NUMBER,
        },
      ],
    });

    expect(mesh.count).toEqual(4);
    const numStreams = 2;
    const height = HEIGHT / numStreams;

    // Check for stream 1 status 1
    expect(mesh.geometry.attributes.status.array[0]).toBe(toClipSpace(STREAM_1_DATA_POINT_1.x));
    expect(mesh.geometry.attributes.status.array[2]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[3]).toBeLessThan(height);

    // Check for stream 1 status 2
    expect(mesh.geometry.attributes.status.array[4]).toBe(toClipSpace(STREAM_1_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.status.array[6]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[7]).toBeLessThan(height);

    // Check for stream 2 status 1
    expect(mesh.geometry.attributes.status.array[8]).toBe(toClipSpace(STREAM_2_DATA_POINT_1.x));
    expect(mesh.geometry.attributes.status.array[9]).toBe(0);
    expect(mesh.geometry.attributes.status.array[10]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[11]).toBeLessThan(height);

    // Check for stream 2 status 2
    expect(mesh.geometry.attributes.status.array[12]).toBe(toClipSpace(STREAM_2_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.status.array[13]).toBe(0);
    expect(mesh.geometry.attributes.status.array[14]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[15]).toBeLessThan(height);

    // Data stream 1 status 1 is default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

    // Data stream 1 status 1 is default status bar color 2
    expect(mesh.geometry.attributes.color.array[3]).toBe(DEFAULT_STATUS_BAR_COLOR_2[0]);
    expect(mesh.geometry.attributes.color.array[4]).toBe(DEFAULT_STATUS_BAR_COLOR_2[1]);
    expect(mesh.geometry.attributes.color.array[5]).toBe(DEFAULT_STATUS_BAR_COLOR_2[2]);

    // Data stream 2 status 1 is default status bar color 1
    expect(mesh.geometry.attributes.color.array[6]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[7]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[8]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

    // Data stream 2 status 2 is default status bar color 2
    expect(mesh.geometry.attributes.color.array[9]).toBe(DEFAULT_STATUS_BAR_COLOR_2[0]);
    expect(mesh.geometry.attributes.color.array[10]).toBe(DEFAULT_STATUS_BAR_COLOR_2[1]);
    expect(mesh.geometry.attributes.color.array[11]).toBe(DEFAULT_STATUS_BAR_COLOR_2[2]);
  });

  it('constructs buffer correctly for two data streams', () => {
    const mesh = statusMesh({
      alarms: { expires: MINUTE_IN_MS },
      chartSize: CHART_SIZE,
      dataStreams: [
        {
          id: 'data-stream-1',
          name: 'some-name',
          resolution: 0,
          data: [STREAM_1_DATA_POINT_1, STREAM_1_DATA_POINT_2],
          dataType: DataType.NUMBER,
          color: 'blue',
        },
        {
          id: 'data-stream-2',
          name: 'some-name',
          resolution: 0,
          data: [STREAM_2_DATA_POINT_1, STREAM_2_DATA_POINT_2],
          dataType: DataType.NUMBER,
          color: 'red',
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

    expect(mesh.count).toEqual(4);

    // checking just the x values is sufficient to ensure vertex order is specified by infos

    // Check for stream 1 status 1
    expect(mesh.geometry.attributes.status.array[0]).toBe(toClipSpace(STREAM_1_DATA_POINT_1.x));
    // Check for stream 1 status 2
    expect(mesh.geometry.attributes.status.array[4]).toBe(toClipSpace(STREAM_1_DATA_POINT_2.x));
    // Check for stream 2 status 1
    expect(mesh.geometry.attributes.status.array[8]).toBe(toClipSpace(STREAM_2_DATA_POINT_1.x));
    // Check for stream 2 status 2
    expect(mesh.geometry.attributes.status.array[12]).toBe(toClipSpace(STREAM_2_DATA_POINT_2.x));
  });
});

describe('update status mesh', () => {
  it('updates an empty status mesh to contain a status', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        name: 'some-name',
        resolution: 0,
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    const mesh = statusMesh({
      ...BASE_PROPS,
      dataStreams: [],
    });
    expect(mesh.count).toEqual(0);

    updateStatusMesh({
      ...BASE_PROPS,
      statuses: mesh,
      dataStreams: DATA_STREAM_TEMP,
      hasDataChanged: true,
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });
    expect(mesh.count).toEqual(2);

    expect(mesh.geometry.attributes.status.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(mesh.geometry.attributes.status.array[1]).toBe(0);
    expect(mesh.geometry.attributes.status.array[2]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[3]).toBeLessThan(HEIGHT);

    expect(mesh.geometry.attributes.status.array[4]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(mesh.geometry.attributes.status.array[5]).toBe(0);
    expect(mesh.geometry.attributes.status.array[6]).toBeCloseTo(EXPECTED_WIDTH, 8);
    expect(mesh.geometry.attributes.status.array[7]).toBeLessThan(HEIGHT);

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

    // default status bar color 2
    expect(mesh.geometry.attributes.color.array[3]).toBe(DEFAULT_STATUS_BAR_COLOR_2[0]);
    expect(mesh.geometry.attributes.color.array[4]).toBe(DEFAULT_STATUS_BAR_COLOR_2[1]);
    expect(mesh.geometry.attributes.color.array[5]).toBe(DEFAULT_STATUS_BAR_COLOR_2[2]);
  });

  it('updates a non-empty status mesh to an empty one', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        resolution: 0,
        name: 'some-name',
        dataType: DataType.NUMBER,
        data: [DATA_POINT_1, DATA_POINT_2],
      },
    ];
    const mesh = statusMesh({
      alarms: { expires: MINUTE_IN_MS },
      chartSize: CHART_SIZE,
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

    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: [],
      toClipSpace,
      hasDataChanged: true,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });
    expect(mesh.count).toEqual(0);

    expect(mesh.geometry.attributes.status.array[0]).not.toBe(0);
    expect(mesh.geometry.attributes.status.array[3]).not.toBe(0);

    expect(mesh.geometry.attributes.status.array[4]).not.toBe(0);
    expect(mesh.geometry.attributes.status.array[7]).not.toBe(0);
  });

  it('updates a non-empty status mesh to have an additional one status mesh', () => {
    const DATA_STREAM_TEMP = [
      {
        id: 'data-stream',
        resolution: 0,
        name: 'some-name',
        dataType: DataType.NUMBER,
        data: [DATA_POINT_1, DATA_POINT_2],
      },
    ];
    const mesh = statusMesh({
      alarms: { expires: MINUTE_IN_MS },
      chartSize: CHART_SIZE,
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

    // Add one additional data stream
    updateStatusMesh({
      alarms: { expires: MINUTE_IN_MS },
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: DATA_STREAMS,
      toClipSpace,
      hasDataChanged: true,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });
    expect(mesh.count).toEqual(3);

    expect(mesh.geometry.attributes.status.array[8]).toBe(toClipSpace(DATA_POINT_3.x));
    expect(mesh.geometry.attributes.status.array[9]).toBe(0);
    expect(mesh.geometry.attributes.status.array[10]).toBeCloseTo(toClipSpace(MINUTE_IN_MS), 8);
    expect(mesh.geometry.attributes.status.array[11]).toBeLessThan(HEIGHT);
  });

  it('does not update the mesh when the size, data and annotations have not changed', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      { id: 'data-stream', resolution: 0, name: 'some-name', data: [DATA_POINT_1], dataType: DataType.NUMBER },
    ];
    const mesh = statusMesh({
      chartSize: CHART_SIZE,
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
        resolution: 0,
        name: 'some-name',
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: DATA_STREAM_TEMP_2,
      toClipSpace,
      hasDataChanged: false,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });

    expect(mesh.count).toEqual(1);
  });

  it('updates mesh when size has changed', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      { id: 'data-stream', resolution: 0, name: 'some-name', data: [DATA_POINT_1], dataType: DataType.NUMBER },
    ];
    const mesh = statusMesh({
      chartSize: CHART_SIZE,
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
        resolution: 0,
        name: 'some-name',
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];
    updateStatusMesh({
      hasDataChanged: false,
      hasAnnotationChanged: false,
      hasSizeChanged: true,
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: DATA_STREAM_TEMP_2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    // mesh has updated, meaning we have re-ran the webGL visualization update process
    expect(mesh.count).toEqual(2);
  });
});

describe('threshold correctly effects the color buffer', () => {
  it('does not initialize color buffer with threshold color for a single status when threshold coloration is off', () => {
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
      dataStreams: [
        { id: 'data-stream', name: 'name', resolution: 0, data: [DATA_POINT_1], dataType: DataType.NUMBER },
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

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);
  });

  it('initializes color buffer with the correct threshold color for a single status', () => {
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
      dataStreams: [
        { id: 'data-stream', name: 'name', resolution: 0, data: [DATA_POINT_1], dataType: DataType.NUMBER },
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
      dataStreams: [
        {
          id: 'data-stream',
          color: 'purple',
          name: 'name',
          resolution: 0,
          data: [DATA_POINT_1],
          dataType: DataType.NUMBER,
        },
        {
          id: 'data-stream-2',
          color: 'blue',
          name: 'name',
          resolution: 0,
          data: [DATA_POINT_2],
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

    // Default status color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

    // Red
    expect(mesh.geometry.attributes.color.array[3]).toBe(255);
    expect(mesh.geometry.attributes.color.array[4]).toBe(0);
    expect(mesh.geometry.attributes.color.array[5]).toBe(0);
  });

  it('updates the color buffer when threshold coloration is turned off', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_1] },
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
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

    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      thresholds,
      thresholdOptions: {
        showColor: false,
      },
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });
    expect(mesh.count).toEqual(1);

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);
  });

  it('updates the color buffer when point breached threshold, despite the data stream color change', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_1] },
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
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

    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
      hasAnnotationChanged: false,
      hasSizeChanged: false,
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
      dataStreams: [
        { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_1] },
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

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: [
        { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_2] },
      ],
      toClipSpace,
      hasDataChanged: true,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
      hasAnnotationChanged: false,
      hasSizeChanged: false,
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
      dataStreams: [
        { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_2] },
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

    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: [
        { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_1] },
      ],
      toClipSpace,
      hasDataChanged: true,
      thresholds,
      thresholdOptions: {
        showColor: true,
      },
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });
    expect(mesh.count).toEqual(1);

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);
  });

  it('updates the color buffer with the correct threshold color for multiple streams with different colors', () => {
    const dataStreams: DataStream[] = [
      { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_1] },
      { id: 'data-stream-2', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_2] },
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
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

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[0]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[1]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[2]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[3]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[4]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[5]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);

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

    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams,
      toClipSpace,
      hasDataChanged: true,
      thresholds: thresholds2,
      thresholdOptions: {
        showColor: true,
      },
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });
    expect(mesh.count).toEqual(2);

    // Red
    expect(mesh.geometry.attributes.color.array[0]).toBe(255);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(0);

    // default status bar color 1
    expect(mesh.geometry.attributes.color.array[3]).toBe(DEFAULT_STATUS_BAR_COLOR_1[0]);
    expect(mesh.geometry.attributes.color.array[4]).toBe(DEFAULT_STATUS_BAR_COLOR_1[1]);
    expect(mesh.geometry.attributes.color.array[5]).toBe(DEFAULT_STATUS_BAR_COLOR_1[2]);
  });

  it('updates the color buffer with the upper threshold when a positive point breached two threshold', () => {
    const DATA_STREAM_TEMP: DataStream[] = [
      { id: 'data-stream', name: 'name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT_1] },
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
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

    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      thresholds: [...thresholds, ...thresholds2],
      thresholdOptions: {
        showColor: true,
      },
      hasAnnotationChanged: false,
      hasSizeChanged: false,
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

        name: 'name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [{ x: new Date(2000, 0, 0).getTime(), y: -200 }],
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

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
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

    updateStatusMesh({
      chartSize: CHART_SIZE,
      statuses: mesh,
      dataStreams: DATA_STREAM_TEMP,
      toClipSpace,
      hasDataChanged: true,
      thresholds: [...thresholds, ...thresholds2],
      thresholdOptions: {
        showColor: true,
      },
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });
    expect(mesh.count).toEqual(1);

    // Blue
    expect(mesh.geometry.attributes.color.array[0]).toBe(0);
    expect(mesh.geometry.attributes.color.array[1]).toBe(0);
    expect(mesh.geometry.attributes.color.array[2]).toBe(255);
  });

  it('do not add vertical margin if num of data streams exceed max data streams', () => {
    const dataType = DataType.NUMBER;
    const dataStreams = [
      {
        id: 'data-stream-1',
        name: 'name',
        resolution: 0,
        data: [STREAM_1_DATA_POINT_1],
        dataType,
      },
      {
        id: 'data-stream-2',
        name: 'name',
        resolution: 0,
        data: [STREAM_1_DATA_POINT_1],
        dataType,
      },
      {
        id: 'data-stream-3',
        name: 'name',
        resolution: 0,
        data: [STREAM_1_DATA_POINT_1],
        dataType,
      },
      {
        id: 'data-stream-4',
        name: 'name',
        resolution: 0,
        data: [STREAM_1_DATA_POINT_1],
        dataType,
      },
      {
        id: 'data-stream-5',
        name: 'name',
        resolution: 0,
        data: [STREAM_1_DATA_POINT_1],
        dataType,
      },
      {
        id: 'data-stream-6',
        name: 'name',
        resolution: 0,
        data: [STREAM_1_DATA_POINT_1],
        dataType,
      },
      {
        id: 'data-stream-7',
        name: 'name',
        resolution: 0,
        data: [STREAM_1_DATA_POINT_1],
        dataType,
      },
      {
        id: 'data-stream-8',
        name: 'name',
        resolution: 0,
        data: [STREAM_1_DATA_POINT_1],
        dataType,
      },
    ];

    const mesh = statusMesh({
      chartSize: CHART_SIZE,
      dataStreams,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.count).toEqual(dataStreams.length);

    // stream 1
    const height = mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS - 1];

    expect(height).toBeGreaterThan(0);
    expect(height).toBeLessThan(HEIGHT / dataStreams.length);

    // We expect everything to have the same height.

    // stream 2
    expect(mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS * 2 - 1]).toBe(height);
    // stream 3
    expect(mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS * 3 - 1]).toBe(height);
    // stream 4
    expect(mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS * 4 - 1]).toBe(height);
    // stream 5
    expect(mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS * 5 - 1]).toBe(height);
    // stream 6
    expect(mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS * 6 - 1]).toBe(height);
    // stream 7
    expect(mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS * 7 - 1]).toBe(height);
    // stream 8
    expect(mesh.geometry.attributes.status.array[NUM_STATUS_COMPONENTS * 8 - 1]).toBe(height);
  });
});
