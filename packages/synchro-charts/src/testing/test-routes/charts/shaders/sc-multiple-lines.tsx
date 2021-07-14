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

const WIDTH = X_MAX.getTime() - X_MIN.getTime();

const STREAM_1_POINT_1: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH / 3,
  y: 75,
};

const STREAM_1_POINT_2: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH * (2 / 3),
  y: 75,
};

const STREAM_2_POINT_1: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH / 3,
  y: 25,
};

const STREAM_2_POINT_2: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH * (2 / 3),
  y: 25,
};

@Component({
  tag: 'sc-multiple-lines',
})
export class ScMultipleLines {
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
          id: 'stream-1',
          data: [STREAM_1_POINT_1, STREAM_1_POINT_2],
          name: 'stream-1-name',
          color: 'black',
          resolution: 0,
          dataType: DataType.NUMBER,
        },
        {
          id: 'stream-2',
          name: 'stream-2-name',
          color: 'black',
          data: [STREAM_2_POINT_1, STREAM_2_POINT_2],
          resolution: 0,
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
