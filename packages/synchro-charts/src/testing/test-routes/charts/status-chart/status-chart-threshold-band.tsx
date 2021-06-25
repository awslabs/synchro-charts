import { Component, h } from '@stencil/core';

import { MINUTE_IN_MS } from '../../../../utils/time';
import { TEST_DATA_POINT_STANDARD, X_MAX, X_MIN, Y_MAX, Y_MIN } from '../constants';
import { DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';
import { COMPARISON_OPERATOR } from '../../../../components/charts/common/constants';

const urlParams = new URLSearchParams(window.location.search);
const isDiscreteNumericData = urlParams.get('isDiscreteNumericData');
const isStringData = urlParams.get('isStringData');

const data: DataPoint<string | number> = TEST_DATA_POINT_STANDARD;
const dataType: DataType = isDiscreteNumericData === '1' ? DataType.STRING : DataType.NUMBER;

data.y = 2000;

if (isDiscreteNumericData === '1') {
  data.y = 2000;
}

if (isStringData === '1') {
  data.y = 'test';
}

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 */

@Component({
  tag: 'status-chart-threshold-coloration-band',
})
export class StatusChartThresholdBand {
  render() {
    return (
      <div>
        <monitor-status-chart
          alarms={{ expires: MINUTE_IN_MS }}
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              aggregates: { [MINUTE_IN_MS]: [data] },
              data: [],
              resolution: MINUTE_IN_MS,
              dataType,
            },
          ]}
          annotations={{
            y: [
              {
                value: isStringData ? 'test' : 2000,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'blue',
                comparisonOperator: COMPARISON_OPERATOR.EQUAL,
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
          viewPort={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
        />
        <monitor-webgl-context />
      </div>
    );
  }
}
