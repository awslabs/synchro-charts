import { Component, h } from '@stencil/core';
import { DataPoint } from '../../../../utils/dataTypes';
import { TREND_TYPE, DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const Y_MIN = 0;
const Y_MAX = 5000;

const TEST_DATA_POINTS_1: DataPoint[] = [
  {
    x: new Date((3 * X_MIN.getTime() + X_MAX.getTime()) / 4).getTime(),
    y: 2500,
  },
  {
    x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
    y: 1000,
  },
  {
    x: new Date((X_MIN.getTime() + 3 * X_MAX.getTime()) / 4).getTime(),
    y: 4500,
  },
];
const TEST_DATA_POINTS_2: DataPoint[] = [
  {
    x: new Date((3 * X_MIN.getTime() + X_MAX.getTime()) / 4).getTime(),
    y: 2000,
  },
  {
    x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
    y: 2500,
  },
  {
    x: new Date((X_MIN.getTime() + 3 * X_MAX.getTime()) / 4).getTime(),
    y: 1500,
  },
];

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that tooltip will sort the data values and renders them in a descending order.
 */

@Component({
  tag: 'sc-scatter-chart-tooltip-with-multiple-data-streams-and-trends',
})
export class ScScatterChartTooltipWithMultipleDataStreamsAndTrends {
  render() {
    return (
      <div>
        <sc-scatter-chart
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream 1',
              data: TEST_DATA_POINTS_1,
              resolution: 0,
              dataType: DataType.NUMBER,
            },
            {
              id: 'test2',
              color: 'red',
              name: 'test stream 2',
              data: TEST_DATA_POINTS_2,
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
          trends={[
            {
              type: TREND_TYPE.LINEAR,
              dataStreamId: 'test',
            },
            {
              type: TREND_TYPE.LINEAR,
              dataStreamId: 'test2',
            },
          ]}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
