import { Component, Element, h } from '@stencil/core';
import { webGLRenderer } from '../../../../../components/sc-webgl-context/webglContext';
import { chartScene } from '../../../../../components/charts/sc-status-timeline/chartScene';
import { CHART_SIZE } from '../chartSize';
import { HOUR_IN_MS } from '../../../../../utils/time';
import { HEIGHT } from '../../../../../components/charts/sc-status-timeline/constants';
import { DataPoint } from '../../../../../utils/dataTypes';
import { DataType } from '../../../../../utils/dataConstants';

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);

const WIDTH = X_MAX.getTime() - X_MIN.getTime();

const TEST_DATA_POINT_1: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH / 3,
  y: 25,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: X_MIN.getTime() + WIDTH * (2 / 3),
  y: 50,
};

@Component({
  tag: 'multiple-statuses',
})
export class MultipleStatuses {
  @Element() el!: HTMLElement;

  componentDidLoad() {
    const container = this.el.querySelector('#test-container') as HTMLDivElement;
    const scene = chartScene({
      alarms: { expires: HOUR_IN_MS * 5 },
      viewport: {
        start: X_MIN,
        end: X_MAX,
        yMin: 0,
        yMax: HEIGHT,
      },
      dataStreams: [
        {
          id: 'test-stream',
          aggregates: {
            [HOUR_IN_MS * 5]: [TEST_DATA_POINT_1],
          },
          data: [],
          resolution: HOUR_IN_MS * 5,
          name: 'test-stream-name',
          color: 'black',
          dataType: DataType.NUMBER,
        },
        {
          id: 'test-stream-2',
          aggregates: {
            [HOUR_IN_MS * 5]: [TEST_DATA_POINT_2],
          },
          data: [],
          name: 'test-stream-name-2',
          color: 'red',
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
      <sc-webgl-context>
        <div id="test-container" style={{ width: `${CHART_SIZE.width}px`, height: `${CHART_SIZE.height}px` }} />
      </sc-webgl-context>
    );
  }
}
