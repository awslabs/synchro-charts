import { Component, h } from '@stencil/core';

import { MINUTE_IN_MS } from '../../../../utils/time';
import { TEST_DATA_POINT_STANDARD, Y_MAX, Y_MIN, X_MIN, X_MAX } from '../constants';
import { COMPARISON_OPERATOR, DataType } from '../../../..';

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a status correctly
 */

@Component({
  tag: 'status-chart-threshold-no-coloration',
})
export class StatusChartThresholdNoColoration {
  render() {
    return (
      <div>
        <sc-status-chart
          alarms={{ expires: MINUTE_IN_MS }}
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              aggregates: { [MINUTE_IN_MS]: [TEST_DATA_POINT_STANDARD] },
              data: [],
              resolution: MINUTE_IN_MS,
              dataType: DataType.NUMBER,
            },
          ]}
          annotations={{
            y: [
              {
                value: 2000,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'blue',
                comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
              },
            ],
            thresholdOptions: {
              showColor: false,
            },
          }}
          widgetId="test-id"
          size={{
            width: 500,
            height: 500,
          }}
          viewPort={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
