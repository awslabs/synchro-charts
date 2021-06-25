import { Component, h } from '@stencil/core';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

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
  tag: 'sc-webgl-chart-annotations-always-in-viewport',
})
export class ScWebglChartAnnotationsAlwaysInViewport {
  render() {
    return (
      <div>
        <sc-line-chart
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
          annotations={{
            x: [
              {
                value: X_MIN,
                label: {
                  text: 'x label',
                  show: true,
                },
                showValue: true,
                color: 'red',
              },
            ],
            y: [
              {
                value: -100,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'blue',
              },
            ],
            thresholdOptions: {
              showColor: false,
            },
          }}
          size={{
            height: 500,
            width: 500,
          }}
          viewPort={{ start: X_MIN, end: X_MAX }}
          widgetId="widget-id"
        />
        <sc-webgl-context />
      </div>
    );
  }
}
