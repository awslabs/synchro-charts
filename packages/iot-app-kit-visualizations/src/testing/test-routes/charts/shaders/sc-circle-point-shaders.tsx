import { Component, Element, h } from '@stencil/core';
import { webGLRenderer } from '../../../../components/sc-webgl-context/webglContext';
import { chartScene } from '../../../../components/charts/sc-line-chart/chartScene';
import { CHART_SIZE } from './chartSize';
import { DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const Y_MIN = 0;
const Y_MAX = 100;

// test data point dead center of the viewport
const TEST_DATA_POINT: DataPoint<number> = {
  x: (X_MIN.getTime() + X_MAX.getTime()) / 2,
  y: (Y_MIN + Y_MAX) / 2,
};

/**
 * Tests that a single point renders as a circle correctly
 */

@Component({
  tag: 'sc-circle-point-shaders',
})
export class ScCirclePointShaders {
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
          data: [TEST_DATA_POINT],
          resolution: 0,
          dataType: DataType.NUMBER,
        },
      ],
      chartSize: CHART_SIZE,
      container,
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
      <sc-webgl-context>
        <div id="test-container" style={{ width: `${CHART_SIZE.width}px`, height: `${CHART_SIZE.height}px` }} />
      </sc-webgl-context>
    );
  }
}
