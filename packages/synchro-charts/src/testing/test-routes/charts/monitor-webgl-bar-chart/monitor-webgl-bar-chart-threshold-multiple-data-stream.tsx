import { Component, h } from '@stencil/core';

import { YEAR_IN_MS } from '../../../../utils/time';
import { DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';
import { COMPARISON_OPERATOR } from '../../../../components/charts/common/constants';

const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 0);

const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 2000,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 3000,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 */
@Component({
  tag: 'monitor-webgl-bar-chart-threshold-coloration-multiple-data-stream',
})
export class MonitorWebglBarChartThresholdMultipleDataStream {
  render() {
    return (
      <div>
        <sc-bar-chart
          dataStreams={[
            {
              id: 'test',
              aggregates: {
                [YEAR_IN_MS]: [TEST_DATA_POINT, TEST_DATA_POINT_2],
              },
              data: [],
              resolution: YEAR_IN_MS,
              color: 'black',
              name: 'test stream',
              dataType: DataType.NUMBER,
            },
            {
              id: 'test2',
              aggregates: {
                [YEAR_IN_MS]: [TEST_2_DATA_POINT, TEST_2_DATA_POINT_2],
              },
              data: [],
              resolution: YEAR_IN_MS,
              color: 'black',
              name: 'test stream',
              dataType: DataType.NUMBER,
            },
          ]}
          annotations={{
            y: [
              {
                value: 2500,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'blue',
                comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
              },
            ],
            thresholdOptions: {},
          }}
          widgetId="test-id"
          size={{
            width: 500,
            height: 500,
          }}
          viewPort={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
        />
        <monitor-webgl-context />
      </div>
    );
  }
}
