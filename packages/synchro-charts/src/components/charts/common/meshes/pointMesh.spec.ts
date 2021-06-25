import { pointMesh, updatePointMesh } from './pointMesh';
import { clipSpaceConversion } from '../../sc-webgl-base-chart/clipSpaceConversion';
import { DataType } from '../../../../utils/dataConstants';

describe('sets point mesh uniforms', () => {
  it('sets point diameter', () => {
    const mesh = pointMesh({
      dataStreams: [],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.material.uniforms.pointDiameter.value).toBeGreaterThan(0);
  });

  it('does not change point diameter on update', () => {
    const mesh = pointMesh({
      dataStreams: [],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const pointDiameter = mesh.material.uniforms.pointDiameter.value;
    updatePointMesh([], mesh, z => z);
    const pointDiameterUpdated = mesh.material.uniforms.pointDiameter.value;

    expect(pointDiameterUpdated).toEqual(pointDiameter);
  });

  it('sets devicePixelRatio based on browsers window.devicePixelRatio', () => {
    // NOTE: It's important to take into account device pixel ratio, since otherwise
    // rendered assets for different Scs will have different perceived sizes.
    const MOCKED_DEVICE_PIXEL_RATIO = 3;

    // @ts-ignore
    window.devicePixelRatio = MOCKED_DEVICE_PIXEL_RATIO;
    const mesh = pointMesh({
      dataStreams: [],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.material.uniforms.devicePixelRatio.value).toEqual(MOCKED_DEVICE_PIXEL_RATIO);
  });

  it('does not change device pixel ratio on update', () => {
    const MOCKED_DEVICE_PIXEL_RATIO = 2;

    // @ts-ignore
    window.devicePixelRatio = MOCKED_DEVICE_PIXEL_RATIO;
    const mesh = pointMesh({
      dataStreams: [],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const devicePixelRatio = mesh.material.uniforms.pointDiameter.value;
    updatePointMesh([], mesh, z => z);
    const devicePixelRatioUpdated = mesh.material.uniforms.pointDiameter.value;

    expect(devicePixelRatioUpdated).toEqual(devicePixelRatio);
  });
});

describe('create point mesh', () => {
  it('with an empty data set, draw no vertices', () => {
    const mesh = pointMesh({
      dataStreams: [
        {
          data: [],
          resolution: 0,
          color: 'red',
          id: 'data-stream',
          dataType: DataType.NUMBER,
          name: 'some chart',
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.geometry.drawRange).toEqual({ count: 0, start: 0 });
  });

  it('set color to black if provided an invalid color', () => {
    // With a single point, there are no line segments to draw. Thus this mesh will be drawing no vertices
    const DATA_POINT = { x: Date.now(), y: 200 };
    const points = pointMesh({
      dataStreams: [
        {
          id: 'data-stream',
          color: 'fake-color',
          name: 'some name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [DATA_POINT],
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const pointColor = points.geometry.attributes.pointColor.array;
    expect(pointColor[0]).toBe(0);
    expect(pointColor[1]).toBe(0);
    expect(pointColor[2]).toBe(0);
  });

  it('with a single-point data set, draw one vertices', () => {
    // With a single point, there are no line segments to draw. Thus this mesh will be drawing no vertices
    const DATA_POINT = { x: Date.now(), y: 200 };
    const mesh = pointMesh({
      dataStreams: [
        { id: 'data-stream', name: 'some name', resolution: 0, dataType: DataType.NUMBER, data: [DATA_POINT] },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.geometry.drawRange).toEqual({ count: 1, start: 0 });
  });

  it('with a two point data set, draw two vertices', () => {
    // With two points, we will be drawing a single segment, which is made up of two triangles, thus 6 vertices are drawn.
    const DATA_POINT_1 = { x: new Date(2000, 0, 0).getTime(), y: 200 };
    const DATA_POINT_2 = { x: new Date(2000, 1, 0).getTime(), y: 300 };
    const mesh = pointMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [DATA_POINT_1, DATA_POINT_2],
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.geometry.drawRange).toEqual({ count: 2, start: 0 });
  });

  it('with points in multiple data streams', () => {
    const points = pointMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          name: 'some name',
          color: 'red',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [{ x: Date.now(), y: 100 }],
        },
        {
          id: 'data-stream-2',
          name: 'some-name',
          color: 'blue',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [{ x: Date.now(), y: 100 }, { x: Date.now(), y: 100 }],
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(points.geometry.drawRange).toEqual({ count: 3, start: 0 });
  });

  it('initializes the points buffer with the correct position', () => {
    const x = new Date(2000, 0, 1).getTime();
    const y = 0;

    const toClipSpace = clipSpaceConversion({
      start: new Date(2000, 0, 0),
      end: new Date(2000, 0, 2),
      yMin: -10,
      yMax: 10,
    });

    const points = pointMesh({
      dataStreams: [
        { id: 'data-stream-1', name: 'some name', resolution: 0, dataType: DataType.NUMBER, data: [{ x, y }] },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const positions = points.geometry.attributes.position.array;
    expect(positions[0]).toBe(toClipSpace(x));
    expect(positions[1]).toBe(y);
  });

  it('initializes color buffer with the correct color for a single point', () => {
    const x = Date.now();
    const y = 0;
    const points = pointMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          color: 'red',
          name: 'some name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [{ x, y }],
        },
      ],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const pointColor = points.geometry.attributes.pointColor.array;
    // red -> rgb(255, 0.0, 0.0)
    expect(pointColor[0]).toBe(255);
    expect(pointColor[1]).toBe(0.0);
    expect(pointColor[2]).toBe(0.0);
  });

  it('initializes color buffer with the correct color for multiple streams with different colors', () => {
    const toClipSpace = clipSpaceConversion({
      start: new Date(1999, 0, 0),
      end: new Date(2002, 0, 0),
      yMin: 0,
      yMax: 100,
    });

    const x1 = new Date(2000, 0, 0).getTime();
    const y1 = 0;
    const x2 = new Date(2001, 0, 0).getTime();
    const y2 = 100;

    const points = pointMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          color: 'red',
          name: 'some name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [{ x: x1, y: y1 }],
        },
        {
          id: 'data-stream-2',
          color: 'blue',
          name: 'some name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [{ x: x2, y: y2 }],
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
    const pointColor = points.geometry.attributes.pointColor.array;
    const position = points.geometry.attributes.position.array;

    // red -> rgb(255, 0, 0)
    expect(pointColor[0]).toBe(255);
    expect(pointColor[1]).toBe(0);
    expect(pointColor[2]).toBe(0);
    expect(position[0]).toBe(toClipSpace(x1));
    expect(position[1]).toBe(y1);

    // blue -> rgb(0, 0, 255)
    expect(position[3]).toBe(y2);
    expect(position[2]).toBe(toClipSpace(x2));
    expect(pointColor[3]).toBe(0);
    expect(pointColor[4]).toBe(0);
    expect(pointColor[5]).toBe(255);
  });

  it('creates buffer large enough to fit all data points when the number of points surpasses min buffer size', () => {
    const points = pointMesh({
      dataStreams: [
        {
          id: 'data-stream',
          color: 'red',
          name: 'some-name',
          dataType: DataType.NUMBER,
          resolution: 0,
          data: [{ x: Date.now(), y: 100 }, { x: Date.now(), y: 100 }],
        },
      ],
      minBufferSize: 1,
      bufferFactor: 1,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const pointColor = points.geometry.attributes.pointColor.array;
    const position = points.geometry.attributes.position.array;

    expect(position[0]).toBeDefined();
    expect(position[1]).toBeDefined();
    expect(position[2]).toBeDefined();
    expect(position[3]).toBeDefined();

    expect(pointColor[0]).toBeDefined();
    expect(pointColor[1]).toBeDefined();
    expect(pointColor[2]).toBeDefined();
    expect(pointColor[3]).toBeDefined();

    expect(points.geometry.drawRange).toEqual({ count: 2, start: 0 });
  });
});

describe('update point mesh', () => {
  it('updates the buffer version', () => {
    const points = pointMesh({
      dataStreams: [],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    const originalVersion = points.geometry.attributes.position.version;

    updatePointMesh([], points, z => z);

    const newVersion = points.geometry.attributes.position.version;
    expect(newVersion).not.toBe(originalVersion);
  });

  it('updates geometry draw range which matches the number of data points when there is a single data point', () => {
    const points = pointMesh({
      dataStreams: [],
      minBufferSize: 100,
      bufferFactor: 1,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    updatePointMesh(
      [
        {
          id: 'data-stream',
          name: 'some-name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [{ x: Date.now(), y: 100 }],
        },
      ],
      points,
      z => z
    );

    expect(points.geometry.drawRange).toEqual({ count: 1, start: 0 });
  });

  it('updates the position buffer to match the data streams', () => {
    const viewPort = {
      start: new Date(1999, 11, 0),
      end: new Date(2001, 1, 0),
      yMax: 100,
      yMin: 0,
    };
    const toClipSpace = clipSpaceConversion(viewPort);

    const points = pointMesh({
      dataStreams: [],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const x = new Date(2000, 0, 0).getTime();
    const y = 100;

    updatePointMesh(
      [{ id: 'data-stream', name: 'some-name', resolution: 0, dataType: DataType.NUMBER, data: [{ x, y }] }],
      points,
      toClipSpace
    );
    const positions = points.geometry.attributes.position.array;
    expect(positions[0]).toBe(toClipSpace(x));
    expect(positions[1]).toBe(y);
  });

  it('updates the color buffer to match the data stream info', () => {
    const x = new Date(2000, 0, 0).getTime();
    const y = 100;
    const DATA_STREAM = [
      { id: 'data-stream', name: 'some-name', resolution: 0, dataType: DataType.NUMBER, data: [{ x, y }] },
    ];
    const points = pointMesh({
      dataStreams: [DATA_STREAM[0]],
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace: z => z,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    updatePointMesh([{ ...DATA_STREAM[0], color: 'green' }], points, z => z);

    const pointColor = points.geometry.attributes.pointColor.array;

    // green -> rgb(0, 128, 0)
    expect(pointColor[0]).toBe(0);
    expect(pointColor[1]).toBe(128);
    expect(pointColor[2]).toBe(0);
  });
});
