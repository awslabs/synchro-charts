import { Component, h } from '@stencil/core';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
  y: 2000,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
  y: 3000,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that tooltip will sort the data values and renders them in a descending order.
 */

@Component({
  tag: 'sc-webgl-chart-tooltip-with-multiple-data-streams',
})
export class ScWebglChartTooltipWithMultipleDataStreams {
  render() {
    return (
      <div>
        <sc-line-chart
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              data: [TEST_DATA_POINT],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
            {
              id: 'test2',
              color: 'red',
              name: 'test stream',
              data: [TEST_DATA_POINT_2],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ]}
          widgetId="widget-id"
          size={{
            height: 500,
            width: 500,
          }}
          viewPort={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
