import { Component, h } from '@stencil/core';
import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
import { MONTH_IN_MS } from '../../../../utils/time';
import { DataType } from '../../../../utils/dataConstants';
import { Y_VALUE_STRING } from '../constants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 1);

const TEST_DATA_POINT: DataPoint<string> = {
  x: new Date(1999, 0, 0).getTime(),
  y: Y_VALUE_STRING,
};

const TEST_DATA_POINT_2: DataPoint<string> = {
  x: new Date(2000, 0, 0).getTime(),
  y: Y_VALUE_STRING,
};

@Component({
  tag: 'iot-app-kit-vis-scatter-chart-unsupported-data-types',
})
export class ScScatterChartUnsupportedDataTypes {
  render() {
    return (
      <div>
        <iot-app-kit-vis-scatter-chart
          widgetId="widget-id"
          dataStreams={[
            {
              id: 'test',
              name: 'test stream',
              color: 'black',
              aggregationType: AggregateType.AVERAGE,
              aggregates: { [MONTH_IN_MS]: [TEST_DATA_POINT, TEST_DATA_POINT_2] },
              data: [],
              resolution: MONTH_IN_MS,
              dataType: DataType.STRING,
            },
          ]}
          annotations={{}}
          viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
