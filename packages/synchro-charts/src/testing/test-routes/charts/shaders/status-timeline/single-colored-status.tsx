import { Component, Element, h } from '@stencil/core';
import { webGLRenderer } from '../../../../../components/sc-webgl-context/webglContext';
import { chartScene } from '../../../../../components/charts/sc-status-timeline/chartScene';
import { CHART_SIZE } from '../chartSize';
import { DAY_IN_MS } from '../../../../../utils/time';
import { HEIGHT } from '../../../../../components/charts/sc-status-timeline/constants';
import { DataPoint } from '../../../../../utils/dataTypes';
import { DataType } from '../../../../../utils/dataConstants';

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);

const WIDTH = X_MAX.getTime() - X_MIN.getTime();

const TEST_DATA_POINT_1: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH / 3,
  y: 123,
};

@Component({
  tag: 'single-colored-status',
})
export class SingleColoredStatus {
  @Element() el!: HTMLElement;

  componentDidLoad() {
    const container = this.el.querySelector('#test-container') as HTMLDivElement;
    const scene = chartScene({
      alarms: { expires: DAY_IN_MS },
      viewPort: {
        start: X_MIN,
        end: X_MAX,
        yMin: 0,
        yMax: HEIGHT,
      },
      dataStreams: [
        {
          id: 'test-stream',
          name: 'test-stream-name',
          color: 'red',
          aggregates: {
            [DAY_IN_MS]: [TEST_DATA_POINT_1],
          },
          data: [],
          resolution: DAY_IN_MS,
          dataType: DataType.NUMBER,
        },
      ],
      container,
      chartSize: CHART_SIZE,
      minBufferSize: 100,
      bufferFactor: 2,
      thresholdOptions: {
        showColor: false,
      },
      thresholds: [],
    });

    webGLRenderer.addChartScene(scene);

    const rect = container.getBoundingClientRect() as DOMRect;
    webGLRenderer.setChartRect(scene.id, { density: 1, ...rect.toJSON() });
  }

  render() {
    return (
      <sc-webgl-context>
        <div id="test-container" style={{ width: `${CHART_SIZE.width}px`, height: `${CHART_SIZE.height}px` }} />
      </sc-webgl-context>
    );
  }
}
