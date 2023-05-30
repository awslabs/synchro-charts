import { Component, h } from '@stencil/core';

import { YEAR_IN_MS } from '../../../../utils/time';
import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
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
  tag: 'iot-app-kit-vis-webgl-bar-chart-threshold-coloration-multiple-data-stream',
})
export class ScWebglBarChartThresholdMultipleDataStream {
  render() {
    return (
      <div>
        <iot-app-kit-vis-bar-chart
          dataStreams={[
            {
              id: 'test',
              aggregationType: AggregateType.AVERAGE,
              data: [TEST_DATA_POINT, TEST_DATA_POINT_2],
              resolution: YEAR_IN_MS,
              color: 'black',
              name: 'test stream',
              dataType: DataType.NUMBER,
            },
            {
              id: 'test2',
              aggregationType: AggregateType.AVERAGE,
              data: [TEST_2_DATA_POINT, TEST_2_DATA_POINT_2],
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
          viewport={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
          setViewport={() => {}}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
