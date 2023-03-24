import { Component, h } from '@stencil/core';

import { MINUTE_IN_MS } from '../../../../utils/time';
import { TEST_DATA_POINT_STANDARD, Y_MAX, Y_MIN, X_MIN, X_MAX } from '../constants';
import { COMPARISON_OPERATOR } from '../../../../components/charts/common/constants';
import { AggregateType } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 */

@Component({
  tag: 'iot-app-kit-vis-webgl-bar-chart-threshold-coloration-band',
})
export class ScWebglBarChartThresholdBand {
  render() {
    return (
      <div>
        <iot-app-kit-vis-bar-chart
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              aggregationType: AggregateType.AVERAGE,
              aggregates: {
                [MINUTE_IN_MS]: [TEST_DATA_POINT_STANDARD],
              },
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
              {
                value: 3000,
                label: {
                  text: 'y label2',
                  show: true,
                },
                showValue: true,
                color: 'red',
                comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
              },
            ],
            thresholdOptions: {
              showColor: true,
            },
          }}
          widgetId="test-id"
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
