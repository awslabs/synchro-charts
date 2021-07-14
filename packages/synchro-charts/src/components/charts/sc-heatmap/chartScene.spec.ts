import { chartScene, updateChartScene } from './chartScene';
import { DataPoint } from '../../../utils/dataTypes';
import { MONTH_IN_MS } from '../../../utils/time';
import { BarChartBarMesh } from './barMesh';
import { DataType } from '../../../utils/dataConstants';

const VIEW_PORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

const TEST_DATA_POINT: DataPoint<number>[] = Array.from({ length: 7 }, (_, index) => {
  return {
    x: new Date(2000, 0, 0, index, 0).getTime(),
    y: 300,
  };
});

const CHART_SIZE = { width: 200, height: 200 };

describe('bars', () => {
  it('increases buffer size when number of data points surpasses min buffer size', () => {
    const container = document.createElement('div');
    const scene = chartScene({
      bufferFactor: 1,
      chartSize: CHART_SIZE,
      container,
      dataStreams: [
        { id: 'data-stream', name: 'some name', resolution: MONTH_IN_MS, data: [], dataType: DataType.NUMBER },
      ],
      minBufferSize: 0,
      viewPort: VIEW_PORT,
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
          resolution: MONTH_IN_MS,
          data: [],
          aggregates: {
            [MONTH_IN_MS]: TEST_DATA_POINT,
          },
          dataType: DataType.NUMBER,
        },
      ],
      hasDataChanged: true,
      minBufferSize: 0,
      scene,
      viewPort: VIEW_PORT,
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

    const bars = (updatedScene.scene.children[0] as unknown) as BarChartBarMesh;
    const { bar, color } = bars.geometry.attributes;

    // Current bar 1
    expect(bar.array[0]).toBeDefined();
    expect(bar.array[1]).toBeDefined();

    // Current bar 2
    expect(bar.array[2]).toBeDefined();
    expect(bar.array[3]).toBeDefined();

    // Color for bar 1 (r, g, b)
    expect(color.array[0]).toBeDefined();
    expect(color.array[1]).toBeDefined();
    expect(color.array[2]).toBeDefined();

    // Color for bar 2 (r, g, b)
    expect(color.array[3]).toBeDefined();
    expect(color.array[4]).toBeDefined();
    expect(color.array[5]).toBeDefined();
  });
});
