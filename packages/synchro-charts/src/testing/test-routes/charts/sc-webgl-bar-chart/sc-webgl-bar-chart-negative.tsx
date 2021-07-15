import { Component, h } from '@stencil/core';
import { MINUTE_IN_MS } from '../../../../utils/time';
import { DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = -3000;
const Y_MAX = 1000;

const X_MIN = new Date(2000, 0, 0, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);

// test data point dead center of the viewport
const TEST_DATA_POINT: DataPoint<number> = {
  x: (X_MIN.getTime() + X_MAX.getTime()) / 2,
  y: (Y_MIN - Y_MAX) / 2,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a bar correctly
 */

@Component({
  tag: 'sc-webgl-bar-chart-negative',
})
export class ScWebglBarChartNegative {
  render() {
    return (
      <div id="chart-container" style={{ width: '500px', height: '500px' }}>
        <sc-bar-chart
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              aggregates: {
                [MINUTE_IN_MS]: [TEST_DATA_POINT],
              },
              data: [],
              resolution: MINUTE_IN_MS,
              dataType: DataType.NUMBER,
            },
          ]}
          widgetId="widget-id"
          size={{
            width: 500,
            height: 500,
          }}
          viewport={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
