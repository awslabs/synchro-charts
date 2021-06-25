import { DataPoint } from '../../../utils/dataTypes';
import { chartScene, updateChartScene } from './chartScene';
import { PointMesh, POINT_MESH_INDEX } from '../common/meshes/pointMesh';
import { DataType } from '../../../utils/dataConstants';

const VIEW_PORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

const DATA_POINT_1: DataPoint = { x: new Date(2000, 0, 0).getTime(), y: 200 };
const DATA_POINT_2: DataPoint = { x: new Date(2000, 1, 0).getTime(), y: 300 };

const CHART_SIZE = { width: 200, height: 200 };

describe('points', () => {
  it('increases buffer size when number of data points surpasses min buffer size', () => {
    const container = document.createElement('div');

    const scene = chartScene({
      viewPort: VIEW_PORT,
      container,
      chartSize: CHART_SIZE,
      dataStreams: [{ id: 'data-stream', name: 'some name', resolution: 0, data: [], dataType: DataType.NUMBER }],
      minBufferSize: 0,
      bufferFactor: 1,
      thresholds: [],
      thresholdOptions: {
        showColor: false,
      },
    });

    const updatedScene = updateChartScene({
      scene,
      viewPort: VIEW_PORT,
      chartSize: CHART_SIZE,
      container,
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          data: [DATA_POINT_1, DATA_POINT_2],
          dataType: DataType.NUMBER,
        },
      ],
      hasDataChanged: true,
      minBufferSize: 0,
      bufferFactor: 1,
      thresholds: [],
      thresholdOptions: {
        showColor: false,
      },
      hasSizeChanged: false,
      hasAnnotationChanged: false,
    });

    // since buffers have resized, a new scene with a new id should be created.
    expect(updatedScene.id).not.toEqual(scene.id);
    expect(scene).not.toBe(updatedScene);

    const points = (updatedScene.scene.children[POINT_MESH_INDEX] as unknown) as PointMesh;

    const pointColor = points.geometry.attributes.pointColor.array;
    const position = points.geometry.attributes.position.array;

    // Point 1 position is defined
    expect(position[0]).toBeDefined();
    expect(position[1]).toBeDefined();

    // Point 2 position is defined
    expect(position[2]).toBeDefined();
    expect(position[3]).toBeDefined();

    // Point 1 color is defined
    expect(pointColor[0]).toBeDefined();
    expect(pointColor[1]).toBeDefined();

    // Point 2 color is defined
    expect(pointColor[2]).toBeDefined();
    expect(pointColor[3]).toBeDefined();

    // Draws 2 points
    expect(points.geometry.drawRange).toEqual({ count: 2, start: 0 });
  });
});
