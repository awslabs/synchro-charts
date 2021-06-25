import { Component, h } from '@stencil/core';

import { MONTH_IN_MS } from '../../../utils/time';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';
import { COMPARISON_OPERATOR } from '../../../components/charts/common/constants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 1);

const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 2000,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 4000,
};

@Component({
  tag: 'monitor-webgl-chart-threshold-coloration-exact-point',
})
export class MonitorWebglChartThresholdColorationExactPoint {
  render() {
    return (
      <div>
        <monitor-line-chart
          widgetId="widget-id"
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              aggregates: { [MONTH_IN_MS]: [TEST_DATA_POINT, TEST_DATA_POINT_2] },
              data: [],
              resolution: MONTH_IN_MS,
              dataType: DataType.NUMBER,
            },
          ]}
          annotations={{
            y: [
              {
                value: 4000,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'red',
                comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
              },
            ],
            thresholdOptions: {},
          }}
          size={{
            height: 500,
            width: 500,
          }}
          viewPort={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
        />
        <monitor-webgl-context />
      </div>
    );
  }
}
