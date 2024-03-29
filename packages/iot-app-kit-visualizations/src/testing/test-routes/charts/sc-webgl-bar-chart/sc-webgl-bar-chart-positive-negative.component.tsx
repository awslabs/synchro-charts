import { Component, h } from '@stencil/core';
import { MINUTE_IN_MS } from '../../../../utils/time';
import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = -100;
const Y_MAX = 100;

const X_MIN = new Date(2000, 0, 0, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);

// test data point dead center of the viewport
const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date(2000, 0, 0, 0, 3).getTime(),
  y: 50,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0, 0, 7).getTime(),
  y: -50,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a bar correctly
 */

@Component({
  tag: 'iot-app-kit-vis-webgl-bar-chart-positive-negative',
})
export class ScWebglBarChartPositiveNegative {
  render() {
    return (
      <div id="chart-container" style={{ width: '500px', height: '500px' }}>
        <iot-app-kit-vis-bar-chart
          dataStreams={[
            {
              id: 'test',
              aggregationType: AggregateType.AVERAGE,
              data: [TEST_DATA_POINT, TEST_DATA_POINT_2],
              resolution: MINUTE_IN_MS,
              color: 'black',
              name: 'test stream',
              dataType: DataType.NUMBER,
            },
          ]}
          widgetId="widget-id"
          size={{
            width: 500,
            height: 500,
          }}
          viewport={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
          setViewport={() => {}}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
