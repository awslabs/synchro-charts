import { Component, h, State } from '@stencil/core';

import { MONTH_IN_MS } from '../../../../utils/time';
import { DataType } from '../../../../utils/dataConstants';
import { DataPoint, DataStream } from '../../../../utils/dataTypes';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(1998, 1, 0);
const X_MAX = new Date(1998, 6, 0);

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a bar chart when adding/removing data points
 */

const DATA_STREAM_1: DataStream = {
  id: 'test',
  color: 'red',
  name: 'test stream',
  resolution: MONTH_IN_MS,
  aggregates: {
    [MONTH_IN_MS]: [
      { x: new Date(1998, 3, 0, 0).getTime(), y: 1000 },
      { x: new Date(1998, 4, 0, 0).getTime(), y: 3000 },
    ],
  },
  data: [],
  dataType: DataType.NUMBER,
};

const DATA_STREAM_2: DataStream = {
  id: 'test2',
  color: 'orange',
  name: 'test stream2',
  resolution: MONTH_IN_MS,
  aggregates: {
    [MONTH_IN_MS]: [
      { x: new Date(1998, 3, 0, 0).getTime(), y: 2000 },
      { x: new Date(1998, 4, 0, 0).getTime(), y: 4000 },
    ],
  },
  data: [],
  dataType: DataType.NUMBER,
};

@Component({
  tag: 'monitor-webgl-bar-chart-margin',
})
export class MonitorWebglBarChartDynamicBuffer {
  @State() data: DataPoint<number>[] = [];

  render() {
    return (
      <div id="chart-container" style={{ height: '500px', width: '500px', marginTop: '20px' }}>
        <sc-bar-chart
          widgetId="widget-id"
          dataStreams={[DATA_STREAM_1, DATA_STREAM_2]}
          viewPort={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
          bufferFactor={1}
          minBufferSize={1}
        />
        <monitor-webgl-context />
      </div>
    );
  }
}
