import { lineMesh, updateLineMesh } from './lineMesh';
import { DataPoint } from '../../../utils/dataTypes';
import { clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { DataType } from '../../../utils/dataConstants';

const VIEW_PORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };
const toClipSpace = clipSpaceConversion(VIEW_PORT);

const DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 0).getTime(), y: 200 };
const DATA_POINT_2: DataPoint = { x: new Date(2000, 1, 0).getTime(), y: 300 };
const DATA_POINT_3: DataPoint = { x: new Date(2000, 1, 0).getTime(), y: 400 };

const STREAM_1_DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 0).getTime(), y: 200 };
const STREAM_1_DATA_POINT_2: DataPoint = { x: new Date(2000, 1, 0).getTime(), y: 300 };
const STREAM_2_DATA_POINT_1: DataPoint = { x: new Date(2000, 3, 0).getTime(), y: 400 };
const STREAM_2_DATA_POINT_2: DataPoint = { x: new Date(2000, 4, 0).getTime(), y: 500 };

const CHART_SIZE = { width: 100, height: 200 };

describe('create line mesh', () => {
  it('sets the width uniform', () => {
    const mesh = lineMesh({
      dataStreams: [],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.material.uniforms.width.value).toBeGreaterThan(0);
  });

  it('sets the x and y pixel density uniforms', () => {
    const mesh = lineMesh({
      dataStreams: [],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.material.uniforms.xPixelDensity.value).toBe(
      (toClipSpace(VIEW_PORT.end.getTime()) - toClipSpace(VIEW_PORT.start.getTime())) / CHART_SIZE.width
    );
    expect(mesh.material.uniforms.yPixelDensity.value).toBe((VIEW_PORT.yMax - VIEW_PORT.yMin) / CHART_SIZE.height);
  });

  it('with an empty data set, draw no vertices', () => {
    const mesh = lineMesh({
      dataStreams: [],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.count).toEqual(0);

    // vertices should be equal to defaulted value of zero.
    expect(mesh.geometry.attributes.currPoint.array[0]).toBe(0);
    expect(mesh.geometry.attributes.currPoint.array[1]).toBe(0);

    expect(mesh.geometry.attributes.nextPoint.array[0]).toBe(0);
    expect(mesh.geometry.attributes.nextPoint.array[1]).toBe(0);
  });

  it('increases initial buffer size when more points present than minimum buffer size', () => {
    // With a single point, there are no line segments to draw. Thus this mesh will be drawing no vertices
    const mesh = lineMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          data: [DATA_POINT_1, DATA_POINT_2, DATA_POINT_3],
          dataType: DataType.NUMBER,
        },
      ],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 1,
      bufferFactor: 1,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });
    expect(mesh.count).toEqual(3);

    // Current Points
    expect(mesh.geometry.attributes.currPoint.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.currPoint.array[1]).toBeDefined();

    expect(mesh.geometry.attributes.currPoint.array[2]).toBeDefined();
    expect(mesh.geometry.attributes.currPoint.array[3]).toBeDefined();

    expect(mesh.geometry.attributes.currPoint.array[4]).toBeDefined();
    expect(mesh.geometry.attributes.currPoint.array[5]).toBeDefined();

    // Next Points
    expect(mesh.geometry.attributes.nextPoint.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.nextPoint.array[1]).toBeDefined();

    expect(mesh.geometry.attributes.nextPoint.array[2]).toBeDefined();
    expect(mesh.geometry.attributes.nextPoint.array[3]).toBeDefined();

    expect(mesh.geometry.attributes.nextPoint.array[4]).toBeDefined();
    expect(mesh.geometry.attributes.nextPoint.array[5]).toBeDefined();

    // Segment Colors
    expect(mesh.geometry.attributes.segmentColor.array[0]).toBeDefined();
    expect(mesh.geometry.attributes.segmentColor.array[1]).toBeDefined();
    expect(mesh.geometry.attributes.segmentColor.array[2]).toBeDefined();

    expect(mesh.geometry.attributes.segmentColor.array[3]).toBeDefined();
    expect(mesh.geometry.attributes.segmentColor.array[4]).toBeDefined();
    expect(mesh.geometry.attributes.segmentColor.array[5]).toBeDefined();
  });

  it('with a single-point data set, draw no vertices', () => {
    // With a single point, there are no line segments to draw. Thus this mesh will be drawing no verticies
    const DATA_POINT = { x: Date.now(), y: 200 };
    const mesh = lineMesh({
      dataStreams: [
        { id: 'data-stream', name: 'some name', resolution: 0, data: [DATA_POINT], dataType: DataType.NUMBER },
      ],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.count).toEqual(1);

    expect(mesh.geometry.attributes.currPoint.array[0]).toBe(toClipSpace(DATA_POINT.x));
    expect(mesh.geometry.attributes.currPoint.array[1]).toBe(DATA_POINT.y);

    expect(mesh.geometry.attributes.currPoint.array[2]).toBe(0);
    expect(mesh.geometry.attributes.currPoint.array[3]).toBe(0);
  });

  it('with a two point data set, draw six vertices making up one segment', () => {
    // With two points, we will be drawing a single segment, which is made up of two triangles, thus 6 vertices are drawn.
    const mesh = lineMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          color: 'red',
          resolution: 0,
          data: [DATA_POINT_1, DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
      ],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.count).toEqual(2);

    // Current Points
    // (x1, y1), (x2, y2)
    expect(mesh.geometry.attributes.currPoint.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(mesh.geometry.attributes.currPoint.array[1]).toBe(DATA_POINT_1.y);

    expect(mesh.geometry.attributes.currPoint.array[2]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(mesh.geometry.attributes.currPoint.array[3]).toBe(DATA_POINT_2.y);

    // Next Points
    // (x2, y2), (x2, y2)
    expect(mesh.geometry.attributes.nextPoint.array[0]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(mesh.geometry.attributes.nextPoint.array[1]).toBe(DATA_POINT_2.y);

    // Segment Colors
    // rgb(255, 0, 0) for all
    expect(mesh.geometry.attributes.segmentColor.array[0]).toBe(255);
    expect(mesh.geometry.attributes.segmentColor.array[1]).toBe(0);
    expect(mesh.geometry.attributes.segmentColor.array[2]).toBe(0);

    expect(mesh.geometry.attributes.segmentColor.array[3]).toBe(255);
    expect(mesh.geometry.attributes.segmentColor.array[4]).toBe(0);
    expect(mesh.geometry.attributes.segmentColor.array[5]).toBe(0);
  });

  it('draw two disjointed lines for separated data streams', () => {
    // With two points, we will be drawing a single segment, which is made up of two triangles, thus 6 vertices are drawn.
    const mesh = lineMesh({
      dataStreams: [
        {
          id: 'data-stream-1',
          color: 'red',
          name: 'some name',
          resolution: 0,
          data: [STREAM_1_DATA_POINT_1, STREAM_1_DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
        {
          id: 'data-stream-2',
          color: 'blue',
          name: 'some name',
          resolution: 0,
          data: [STREAM_2_DATA_POINT_1, STREAM_2_DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
      ],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    expect(mesh.count).toEqual(4);

    // Current Points
    // (s1_x1, s1_y1), (s1_x2, s1_y2), (s2_x1, s2_y1), (s2_x2, s2_y2)
    expect(mesh.geometry.attributes.currPoint.array[0]).toBe(toClipSpace(STREAM_1_DATA_POINT_1.x));
    expect(mesh.geometry.attributes.currPoint.array[1]).toBe(STREAM_1_DATA_POINT_1.y);

    expect(mesh.geometry.attributes.currPoint.array[2]).toBe(toClipSpace(STREAM_1_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.currPoint.array[3]).toBe(STREAM_1_DATA_POINT_2.y);

    expect(mesh.geometry.attributes.currPoint.array[4]).toBe(toClipSpace(STREAM_2_DATA_POINT_1.x));
    expect(mesh.geometry.attributes.currPoint.array[5]).toBe(STREAM_2_DATA_POINT_1.y);

    expect(mesh.geometry.attributes.currPoint.array[6]).toBe(toClipSpace(STREAM_2_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.currPoint.array[7]).toBe(STREAM_2_DATA_POINT_2.y);

    // Next Points
    // (s1_x2, s1_y2), (s1_x2, s1_y2), (s2_x2, s2_y2), (s2_x2, s2_y2)
    expect(mesh.geometry.attributes.nextPoint.array[0]).toBe(toClipSpace(STREAM_1_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.nextPoint.array[1]).toBe(STREAM_1_DATA_POINT_2.y);

    expect(mesh.geometry.attributes.nextPoint.array[2]).toBe(toClipSpace(STREAM_1_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.nextPoint.array[3]).toBe(STREAM_1_DATA_POINT_2.y);

    expect(mesh.geometry.attributes.nextPoint.array[4]).toBe(toClipSpace(STREAM_2_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.nextPoint.array[5]).toBe(STREAM_2_DATA_POINT_2.y);

    expect(mesh.geometry.attributes.nextPoint.array[6]).toBe(toClipSpace(STREAM_2_DATA_POINT_2.x));
    expect(mesh.geometry.attributes.nextPoint.array[7]).toBe(STREAM_2_DATA_POINT_2.y);

    // Segment Colors
    // rgb(255, 0, 0), rgb(255, 0, 0), rgb(0, 0, 255), rgb(0, 0, 255) - the different lines have different colors
    expect(mesh.geometry.attributes.segmentColor.array[0]).toBe(255);
    expect(mesh.geometry.attributes.segmentColor.array[1]).toBe(0);
    expect(mesh.geometry.attributes.segmentColor.array[2]).toBe(0);

    expect(mesh.geometry.attributes.segmentColor.array[3]).toBe(255);
    expect(mesh.geometry.attributes.segmentColor.array[4]).toBe(0);
    expect(mesh.geometry.attributes.segmentColor.array[5]).toBe(0);

    expect(mesh.geometry.attributes.segmentColor.array[6]).toBe(0);
    expect(mesh.geometry.attributes.segmentColor.array[7]).toBe(0);
    expect(mesh.geometry.attributes.segmentColor.array[8]).toBe(255);

    expect(mesh.geometry.attributes.segmentColor.array[9]).toBe(0);
    expect(mesh.geometry.attributes.segmentColor.array[10]).toBe(0);
    expect(mesh.geometry.attributes.segmentColor.array[11]).toBe(255);
  });
});

describe('update line mesh', () => {
  it('updates empty line mesh to contain a line segment', () => {
    const DATA_STREAMS = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1, DATA_POINT_2],
        color: 'blue',
        dataType: DataType.NUMBER,
      },
    ];
    const lines = lineMesh({
      dataStreams: [],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    updateLineMesh({
      lines,
      dataStreams: DATA_STREAMS,
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      hasDataChanged: true,
      toClipSpace,
    });

    expect(lines.count).toEqual(2);

    // Current Points
    // (x1, y1), (x2, y2)
    expect(lines.geometry.attributes.currPoint.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(lines.geometry.attributes.currPoint.array[1]).toBe(DATA_POINT_1.y);

    expect(lines.geometry.attributes.currPoint.array[2]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(lines.geometry.attributes.currPoint.array[3]).toBe(DATA_POINT_2.y);

    // Next Points
    // (x2, y2), (x2, y2)
    expect(lines.geometry.attributes.nextPoint.array[0]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(lines.geometry.attributes.nextPoint.array[1]).toBe(DATA_POINT_2.y);

    expect(lines.geometry.attributes.nextPoint.array[2]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(lines.geometry.attributes.nextPoint.array[3]).toBe(DATA_POINT_2.y);

    // Segment Colors
    // rgb(0, 0, 255) for all
    expect(lines.geometry.attributes.segmentColor.array[0]).toBe(0);
    expect(lines.geometry.attributes.segmentColor.array[1]).toBe(0);
    expect(lines.geometry.attributes.segmentColor.array[2]).toBe(255);

    expect(lines.geometry.attributes.segmentColor.array[3]).toBe(0);
    expect(lines.geometry.attributes.segmentColor.array[4]).toBe(0);
    expect(lines.geometry.attributes.segmentColor.array[5]).toBe(255);
  });

  it('updates non-empty mesh to become empty', () => {
    const DATA_STREAMS = [
      {
        id: 'data-stream',
        name: 'some name',
        resolution: 0,
        data: [DATA_POINT_1, DATA_POINT_2],
        dataType: DataType.NUMBER,
      },
    ];

    const lines = lineMesh({
      dataStreams: DATA_STREAMS,
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    updateLineMesh({
      lines,
      dataStreams: [],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      hasDataChanged: true,
      toClipSpace,
    });

    expect(lines.count).toEqual(0);

    // Don't bother overwriting unrendered points.
    expect(lines.geometry.attributes.currPoint.array[0]).not.toBe(0);
    expect(lines.geometry.attributes.currPoint.array[1]).not.toBe(0);

    expect(lines.geometry.attributes.nextPoint.array[0]).not.toBe(0);
    expect(lines.geometry.attributes.nextPoint.array[1]).not.toBe(0);
  });

  it('updates non-empty mesh to have additional line segments', () => {
    const lines = lineMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          data: [DATA_POINT_1, DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
      ],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    updateLineMesh({
      lines,
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          data: [DATA_POINT_1, DATA_POINT_2, DATA_POINT_3],
          dataType: DataType.NUMBER,
        },
      ],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      hasDataChanged: true,
      toClipSpace,
    });

    expect(lines.count).toEqual(3);

    // Current Points
    // (x1, y1), (x2, y2), (x3, y3), (x4, y4), (x5, y5)
    expect(lines.geometry.attributes.currPoint.array[0]).toBe(toClipSpace(DATA_POINT_1.x));
    expect(lines.geometry.attributes.currPoint.array[1]).toBe(DATA_POINT_1.y);

    expect(lines.geometry.attributes.currPoint.array[2]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(lines.geometry.attributes.currPoint.array[3]).toBe(DATA_POINT_2.y);

    expect(lines.geometry.attributes.currPoint.array[4]).toBe(toClipSpace(DATA_POINT_3.x));
    expect(lines.geometry.attributes.currPoint.array[5]).toBe(DATA_POINT_3.y);

    // Next Points
    // (x2, y2), (x3, y3), (x4, y4), (x5, y5), (x5, y5)
    expect(lines.geometry.attributes.nextPoint.array[0]).toBe(toClipSpace(DATA_POINT_2.x));
    expect(lines.geometry.attributes.nextPoint.array[1]).toBe(DATA_POINT_2.y);

    expect(lines.geometry.attributes.nextPoint.array[2]).toBe(toClipSpace(DATA_POINT_3.x));
    expect(lines.geometry.attributes.nextPoint.array[3]).toBe(DATA_POINT_3.y);

    expect(lines.geometry.attributes.nextPoint.array[4]).toBe(toClipSpace(DATA_POINT_3.x));
    expect(lines.geometry.attributes.nextPoint.array[5]).toBe(DATA_POINT_3.y);
  });

  it('updates the x and y pixel density uniforms', () => {
    const chartSize = {
      width: 100,
      height: 200,
    };

    const updatedChartSize = {
      width: 500,
      height: 700,
    };

    const lines = lineMesh({
      dataStreams: [],
      chartSize,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    updateLineMesh({
      lines,
      dataStreams: [],
      chartSize: updatedChartSize,
      viewPort: VIEW_PORT,
      hasDataChanged: false,
      toClipSpace,
    });

    expect(lines.material.uniforms.xPixelDensity.value).toBe(
      (toClipSpace(VIEW_PORT.end.getTime()) - toClipSpace(VIEW_PORT.start.getTime())) / updatedChartSize.width
    );
    expect(lines.material.uniforms.yPixelDensity.value).toBe(
      (VIEW_PORT.yMax - VIEW_PORT.yMin) / updatedChartSize.height
    );
  });

  it('updates the color of line segments', () => {
    const lines = lineMesh({
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          color: 'black',
          data: [DATA_POINT_1, DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
      ],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      minBufferSize: 100,
      bufferFactor: 2,
      toClipSpace,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    updateLineMesh({
      lines,
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          color: 'red',
          data: [DATA_POINT_1, DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
      ],
      chartSize: CHART_SIZE,
      viewPort: VIEW_PORT,
      hasDataChanged: true,
      toClipSpace,
    });

    // Segment Colors
    // rgb(255, 0, 0) for all
    expect(lines.geometry.attributes.segmentColor.array[0]).toBe(255);
    expect(lines.geometry.attributes.segmentColor.array[1]).toBe(0);
    expect(lines.geometry.attributes.segmentColor.array[2]).toBe(0);

    expect(lines.geometry.attributes.segmentColor.array[3]).toBe(255);
    expect(lines.geometry.attributes.segmentColor.array[4]).toBe(0);
    expect(lines.geometry.attributes.segmentColor.array[5]).toBe(0);
  });
});
