import { Component, h } from '@stencil/core';
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

const TEST_2_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 2000,
};

@Component({
  tag: 'monitor-webgl-chart-threshold-coloration-band',
})
export class MonitorWebglThresholdColorationBand {
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
              data: [TEST_DATA_POINT, TEST_DATA_POINT_2],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
            {
              id: 'test2',

              color: 'red',
              name: 'test stream2',
              data: [TEST_2_DATA_POINT, TEST_2_DATA_POINT_2],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ]}
          annotations={{
            y: [
              {
                value: 3500,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'blue',
                comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
              },
              {
                value: 2500,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'purple',
                comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
              },
            ],
            thresholdOptions: {
              showColor: true,
            },
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
