import { chartScene, updateChartScene } from './chartScene';
import { DataPoint } from '../../../utils/dataTypes';
import { HeatmapBucketMesh } from './heatmapMesh';
import { DataType } from '../../../utils/dataConstants';

const VIEW_PORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

const TEST_DATA_POINT: DataPoint<number>[] = Array.from({ length: 7 }, (_, index) => {
  return {
    x: new Date(2000, 0, 0, index, 0).getTime(),
    y: 300,
  };
});

const CHART_SIZE = { width: 200, height: 200 };

describe('buckets', () => {
  it('increases buffer size when number of data points surpasses min buffer size', () => {
    const container = document.createElement('div');
    const scene = chartScene({
      bufferFactor: 1,
      chartSize: CHART_SIZE,
      container,
      dataStreams: [{ id: 'data-stream', name: 'some name', resolution: 0, data: [], dataType: DataType.NUMBER }],
      minBufferSize: 0,
      viewport: VIEW_PORT,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    const updatedScene = updateChartScene({
      bufferFactor: 1,
      chartSize: CHART_SIZE,
      container,
      dataStreams: [
        {
          id: 'data-stream',
          name: 'some name',
          resolution: 0,
          data: TEST_DATA_POINT,
          dataType: DataType.NUMBER,
        },
      ],
      hasDataChanged: true,
      minBufferSize: 0,
      scene,
      viewport: VIEW_PORT,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
      hasAnnotationChanged: false,
      hasSizeChanged: false,
    });

    // since buffers have resized, a new scene with a new id should be created.
    expect(updatedScene.id).not.toEqual(scene.id);
    expect(scene).not.toBe(updatedScene);

    const buckets = (updatedScene.scene.children[0] as unknown) as HeatmapBucketMesh;
    const { bucket, color } = buckets.geometry.attributes;

    // Current bucket 1
    expect(bucket.array[0]).toBeDefined();
    expect(bucket.array[1]).toBeDefined();

    // Current bucket 2
    expect(bucket.array[2]).toBeDefined();
    expect(bucket.array[3]).toBeDefined();

    // Color for bucket 1 (r, g, b)
    expect(color.array[0]).toBeDefined();
    expect(color.array[1]).toBeDefined();
    expect(color.array[2]).toBeDefined();

    // Color for bucket 2 (r, g, b)
    expect(color.array[3]).toBeDefined();
    expect(color.array[4]).toBeDefined();
    expect(color.array[5]).toBeDefined();
  });
});
