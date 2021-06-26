import { Component, h } from '@stencil/core';

import { DataPoint } from '../../../../utils/dataTypes';
import { MONTH_IN_MS } from '../../../../utils/time';
import { DataType } from '../../../../utils/dataConstants';
import { COMPARISON_OPERATOR } from '../../../../components/charts/common/constants';

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
  tag: 'sc-scatter-chart-threshold-no-coloration',
})
export class ScScatterChartThresholdNoColoration {
  render() {
    return (
      <div>
        <sc-scatter-chart
          widgetId="widget-id"
          dataStreams={[
            {
              id: 'test',
              name: 'test stream',
              color: 'black',
              aggregates: { [MONTH_IN_MS]: [TEST_DATA_POINT, TEST_DATA_POINT_2] },
              data: [],
              resolution: MONTH_IN_MS,
              dataType: DataType.NUMBER,
            },
          ]}
          annotations={{
            y: [
              {
                value: 3000,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'red',
                comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
              },
            ],
            thresholdOptions: { showColor: false },
          }}
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
