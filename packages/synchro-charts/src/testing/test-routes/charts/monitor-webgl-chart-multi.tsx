import { Component, h } from '@stencil/core';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

const VIEW_PORT_GROUP = 'group';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

// test data point dead center of the viewport
const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
  y: (Y_MIN + Y_MAX) / 2,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a circle correctly
 */

@Component({
  tag: 'monitor-webgl-chart-multi',
})
export class MonitorWebglChartMulti {
  render() {
    return (
      <div id="chart-container" style={{ border: '1px solid lightgray', height: '500px', width: '500px' }}>
        <monitor-line-chart
          widgetId="widget-a"
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              data: [TEST_DATA_POINT],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ]}
          viewPort={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX, group: VIEW_PORT_GROUP }}
        />

        <monitor-line-chart
          widgetId="widget-b"
          dataStreams={[
            {
              id: 'test',

              color: 'black',
              name: 'test stream',
              data: [TEST_DATA_POINT],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ]}
          size={{
            height: 150,
            width: 500,
          }}
          viewPort={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX, group: VIEW_PORT_GROUP }}
        />
        <monitor-webgl-context />
      </div>
    );
  }
}
