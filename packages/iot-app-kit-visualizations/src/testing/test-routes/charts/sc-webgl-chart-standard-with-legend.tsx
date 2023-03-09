import { Component, h } from '@stencil/core';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';
import { LEGEND_POSITION } from '../../../components/charts/common/constants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

// test data point dead center of the viewport
const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
  y: (Y_MIN + Y_MAX) / 2,
};

@Component({
  tag: 'iot-app-kit-vis-webgl-chart-standard-with-legend',
})
export class ScWebglChartStandardWithLegend {
  render() {
    return (
      <div>
        <iot-app-kit-vis-line-chart
          widgetId="widget-id"
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              data: [TEST_DATA_POINT],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ]}
          size={{
            height: 500,
            width: 500,
          }}
          viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
          legend={{
            position: LEGEND_POSITION.BOTTOM,
            width: 300,
          }}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
