import { Component, Element, h } from '@stencil/core';
import { webGLRenderer } from '../../../../../components/monitor-webgl-context/webglContext';
import { chartScene } from '../../../../../components/charts/monitor-bar-chart/chartScene';
import { CHART_SIZE } from '../chartSize';
import { DAY_IN_MS } from '../../../../../utils/time';
import { DataPoint } from '../../../../../utils/dataTypes';
import { DataType } from '../../../../../utils/dataConstants';

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const Y_MIN = 0;
const Y_MAX = 100;

const WIDTH = X_MAX.getTime() - X_MIN.getTime();
const HEIGHT = Y_MAX - Y_MIN;

const TEST_DATA_POINT_1: DataPoint<number> = {
  x: new Date(X_MIN.getTime() + WIDTH / 3).getTime(),
  y: Y_MIN + HEIGHT / 2,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a colored bar correctly.
 */

@Component({
  tag: 'monitor-single-colored-bar',
})
export class MonitorSingleColoredBar {
  @Element() el!: HTMLElement;

  componentDidLoad() {
    const container = this.el.querySelector('#test-container') as HTMLDivElement;
    const scene = chartScene({
      viewPort: {
        start: X_MIN,
        end: X_MAX,
        yMin: Y_MIN,
        yMax: Y_MAX,
      },
      dataStreams: [
        {
          id: 'test-stream',
          name: 'test-stream-name',
          color: 'red',
          resolution: DAY_IN_MS,
          data: [],
          aggregates: {
            [DAY_IN_MS]: [TEST_DATA_POINT_1],
          },
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
      <monitor-webgl-context>
        <div id="test-container" style={{ width: `${CHART_SIZE.width}px`, height: `${CHART_SIZE.height}px` }} />
      </monitor-webgl-context>
    );
  }
}
