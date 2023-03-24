import { Component, h } from '@stencil/core';

import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
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

const TEST_2_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 2000,
};

@Component({
  tag: 'iot-app-kit-vis-scatter-chart-threshold-coloration-multiple-data-stream',
})
export class ScScatterChartThresholdColorationMultipleDataStream {
  render() {
    return (
      <div>
        <iot-app-kit-vis-scatter-chart
          widgetId="widget-id"
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              aggregationType: AggregateType.AVERAGE,
              aggregates: { [MONTH_IN_MS]: [TEST_DATA_POINT, TEST_DATA_POINT_2] },
              data: [],
              resolution: MONTH_IN_MS,
              dataType: DataType.NUMBER,
            },
            {
              id: 'test2',
              name: 'test stream2',
              color: 'red',
              aggregationType: AggregateType.AVERAGE,
              aggregates: { [MONTH_IN_MS]: [TEST_2_DATA_POINT, TEST_2_DATA_POINT_2] },
              data: [],
              resolution: MONTH_IN_MS,
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
                comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
              },
            ],
          }}
          size={{
            height: 500,
            width: 500,
          }}
          viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
          setViewport={() => {}}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
