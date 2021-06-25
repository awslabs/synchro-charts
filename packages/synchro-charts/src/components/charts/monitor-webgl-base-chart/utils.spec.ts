import { Material, Mesh, Scene } from 'three';
import { constructChartScene, vertices } from './utils';
import { chartScene as lineChartScene } from '../monitor-line-chart/chartScene';
import { LINE_MESH_INDEX, LineChartLineMesh } from '../monitor-line-chart/lineMesh';
import { POINT_MESH_INDEX } from '../common/meshes/pointMesh';
import { Timestamp } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

const CHART_SIZE = {
  width: 200,
  height: 200,
};

describe('construct chart scene', () => {
  const X_MIN = new Date(2000, 0, 0);
  const X_MAX = new Date(2001, 0, 0);
  const Y_MIN = 100;
  const Y_MAX = 5000;
  const VIEW_PORT = { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX };

  it('onUpdate is called when viewport is updated with the new viewport dates', () => {
    const onUpdate = jest.fn();
    const scene = constructChartScene({
      viewPort: VIEW_PORT,
      container: document.createElement('div'),
      scene: new Scene(),
      toClipSpace: z => z,
      onUpdate,
    });

    const UPDATED_START = new Date(2002, 0, 0);
    const UPDATED_END = new Date(2003, 0, 0);

    scene.updateViewPort({ start: UPDATED_START, end: UPDATED_END });
    expect(onUpdate).toBeCalledWith({
      start: UPDATED_START,
      end: UPDATED_END,
    });
  });

  it('initializes the camera with the correct view port based on the x and y domains', () => {
    const scene = constructChartScene({
      viewPort: VIEW_PORT,
      container: document.createElement('div'),
      scene: new Scene(),
      toClipSpace: z => z,
    });
    expect(scene.camera.left).toBe(X_MIN.getTime());
    expect(scene.camera.right).toBe(X_MAX.getTime());
    expect(scene.camera.top).toBe(Y_MAX);
    expect(scene.camera.bottom).toBe(Y_MIN);
  });

  it('creates a unique id', () => {
    const scene1 = constructChartScene({
      viewPort: VIEW_PORT,
      container: document.createElement('div'),
      scene: new Scene(),
      toClipSpace: z => z,
    });
    const scene2 = constructChartScene({
      viewPort: VIEW_PORT,
      container: document.createElement('div'),
      scene: new Scene(),
      toClipSpace: z => z,
    });
    expect(scene1.id).not.toEqual(scene2.id);
  });

  describe('disposal of scene', () => {
    it('disposes top level scene', () => {
      const chartScene = constructChartScene({
        viewPort: VIEW_PORT,
        container: document.createElement('div'),
        scene: new Scene(),
        toClipSpace: z => z,
      });
      jest.spyOn(chartScene.scene, 'dispose');
      chartScene.dispose();
      expect(chartScene.scene.dispose).toBeCalled();
    });

    it('disposes of a single mesh correctly', () => {
      const chartScene = constructChartScene({
        viewPort: VIEW_PORT,
        container: document.createElement('div'),
        scene: new Scene(),
        toClipSpace: z => z,
      });
      const mesh = new Mesh();
      const material = mesh.material as Material;

      chartScene.scene.add(mesh);

      jest.spyOn(chartScene.scene, 'dispose');
      jest.spyOn(material, 'dispose');
      jest.spyOn(mesh.geometry, 'dispose');

      chartScene.dispose();

      expect(chartScene.scene.dispose).toBeCalled();
      expect(mesh.geometry.dispose).toBeCalled();
      expect(material.dispose).toBeCalled();
    });

    it('disposes of multiples meshes correctly', () => {
      const chartScene = lineChartScene({
        dataStreams: [],
        minBufferSize: 100,
        bufferFactor: 2,
        viewPort: VIEW_PORT,
        container: document.createElement('div'),
        chartSize: CHART_SIZE,
        thresholdOptions: {
          showColor: false,
        },
        thresholds: [],
      });

      const lines = (chartScene.scene.children[LINE_MESH_INDEX] as unknown) as LineChartLineMesh;
      const points = (chartScene.scene.children[POINT_MESH_INDEX] as unknown) as LineChartLineMesh;

      jest.spyOn(chartScene.scene, 'dispose');
      jest.spyOn(lines.geometry, 'dispose');
      jest.spyOn(lines.material, 'dispose');
      jest.spyOn(points.geometry, 'dispose');
      jest.spyOn(points.material, 'dispose');

      chartScene.dispose();

      expect(chartScene.scene.dispose).toBeCalled();

      expect(lines.geometry.dispose).toBeCalled();
      expect(lines.material.dispose).toBeCalled();

      expect(points.geometry.dispose).toBeCalled();
      expect(points.material.dispose).toBeCalled();
    });
  });
});

describe('create vertices from data streams', () => {
  it('returns empty array when passed data stream with no data points', () => {
    expect(
      vertices(
        {
          id: 'stream-id',
          name: 'some stream',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [],
        },
        0
      )
    ).toStrictEqual([]);
  });

  it('converts a data point to a single vertex', () => {
    const x = Date.now();
    const y = 100;
    expect(
      vertices(
        {
          id: 'stream',
          name: 'some-stream-1',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [{ x, y }],
        },
        0
      )
    ).toStrictEqual([[x, y, 0, 0, 0]]);
  });

  it('returns two arrays representing on vertex each', () => {
    const x1: Timestamp = new Date(2000).getTime();
    const y1 = 100;

    const x2: Timestamp = new Date(2001).getTime();
    const y2 = 200;

    const x3: Timestamp = new Date(2002).getTime();
    const y3 = 300;

    expect(
      vertices(
        {
          id: 'stream-1',
          name: 'stream 1',
          resolution: 0,
          dataType: DataType.NUMBER,
          color: 'red',
          data: [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }],
        },
        0
      )
    ).toStrictEqual([[x1, y1, 255, 0, 0], [x2, y2, 255, 0, 0], [x3, y3, 255, 0, 0]]);
  });

  it('handles hex colors properly', () => {
    const x = Date.now();
    const y = 100;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_x, _y, r, g, b] = vertices(
      {
        id: 'stream',
        name: 'stream 1',
        color: '#00ff00',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [{ x, y }],
      },
      0
    )[0];

    // (r, g, b) = (0, 255, 0)
    expect(r).toBe(0);
    expect(g).toBe(255);
    expect(b).toBe(0);
  });
});
