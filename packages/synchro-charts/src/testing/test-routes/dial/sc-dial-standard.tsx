import { Component, h } from '@stencil/core';
import { DataType, StreamType } from '../../../utils/dataConstants';
import { COMPARISON_OPERATOR, StatusIcon } from '../../../components/charts/common/constants';

// Dynamic on number of data points present
// const urlParams = new URLSearchParams(window.location.search);
// const isEnabledParam = urlParams.get('isEnabled');
// const isEnabled = isEnabledParam === 'false';

// const latestValueParam = urlParams.get('latestValue');
// const numChartsParam = urlParams.get('numCharts');

/**
 * Parse Param
 */
// let latestValue: Primitive | null;
// if (latestValueParam == null || latestValueParam === 'null' || latestValueParam === 'undefined') {
//   latestValue = null;
// } else if (isNumeric(latestValueParam)) {
//   latestValue = Number.parseInt(latestValueParam, 10);
// } else {
//   latestValue = latestValueParam;
// }

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

// const NUM_POINTS = 3;

@Component({
  tag: 'sc-dial-standard',
})
export class ScDialStandard {
  dataStream = {
    id: 'car-speed-alarm',
    name: 'Wind temperature',
    data: [
      {
        x: new Date(2001, 0, 0).getTime(),
        y: 1599,
      },
    ],
    unit: '',
    resolution: 0,
    dataType: DataType.NUMBER,
  };
  render() {
    return (
      <sc-dial
        widgetId="test-widget"
        dataStream={this.dataStream}
        size={{
          height: 500,
          width: 500,
        }}
        associatedStreams={[
          {
            id: 'car-speed-alarm',
            type: StreamType.ALARM,
          },
        ]}
        annotations={{
          y: [
            {
              color: '#1d8102',
              value: 15,
              comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
            },
            {
              color: '',
              value: 'Warning',
              comparisonOperator: COMPARISON_OPERATOR.EQUAL,
              dataStreamIds: ['car-speed-alarm'],
              icon: StatusIcon.NORMAL,
            },
          ],
        }}
        viewport={{ yMin: Y_MIN, yMax: Y_MAX, duration: 1000 }}
      />
    );
  }
}
