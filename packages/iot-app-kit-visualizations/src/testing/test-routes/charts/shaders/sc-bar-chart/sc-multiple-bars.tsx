import { Component, Element, h } from '@stencil/core';
import { webGLRenderer } from '../../../../../components/sc-webgl-context/webglContext';
import { chartScene } from '../../../../../components/charts/sc-bar-chart/chartScene';
import { CHART_SIZE } from '../chartSize';
import { HOUR_IN_MS } from '../../../../../utils/time';
import { AggregateType, DataPoint } from '../../../../../utils/dataTypes';
import { DataType } from '../../../../../utils/dataConstants';

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const Y_MIN = 0;
const Y_MAX = 100;

const WIDTH = X_MAX.getTime() - X_MIN.getTime();

const TEST_DATA_POINT_1: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH / 3,
  y: 25,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH * (2 / 3),
  y: 50,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that multiple points renders as multiple bar correctly.
 */

@Component({
  tag: 'iot-app-kit-vis-multiple-bars',
})
export class ScMultipleBars {
  @Element() el!: HTMLElement;

  componentDidLoad() {
    const container = this.el.querySelector('#test-container') as HTMLDivElement;
    const scene = chartScene({
      viewport: {
        start: X_MIN,
        end: X_MAX,
        yMin: Y_MIN,
        yMax: Y_MAX,
      },
      dataStreams: [
        {
          id: 'test-stream',
          name: 'test-stream-name',
          color: 'black',
          aggregationType: AggregateType.AVERAGE,
          data: [TEST_DATA_POINT_1],
          resolution: HOUR_IN_MS * 5,
          dataType: DataType.NUMBER,
        },
        {
          id: 'test-stream-2',
          name: 'test-stream-name-2',
          color: 'red',
          aggregationType: AggregateType.AVERAGE,
          data: [TEST_DATA_POINT_2],
          resolution: HOUR_IN_MS * 5,
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

    webGLRenderer.addChartScene({ manager: scene });

    const rect = container.getBoundingClientRect() as DOMRect;
    webGLRenderer.setChartRect(scene.id, { density: 1, ...rect.toJSON() });
  }

  render() {
    return (
      <iot-app-kit-vis-webgl-context>
        <div id="test-container" style={{ width: `${CHART_SIZE.width}px`, height: `${CHART_SIZE.height}px` }} />
      </iot-app-kit-vis-webgl-context>
    );
  }
}
