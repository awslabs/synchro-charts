import { Component, h } from '@stencil/core';
import { Y_MAX, Y_MIN, X_MIN, X_MAX } from './constants';

@Component({
  tag: 'iot-app-kit-vis-webgl-chart-no-annotations',
})
export class ScWebglChartNoAnnotations {
  render() {
    return (
      <div>
        <iot-app-kit-vis-line-chart
          widgetId="widget-id"
          dataStreams={[]}
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
                value: Y_MIN,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'blue',
              },
            ],
            show: false,
          }}
          size={{
            height: 500,
            width: 500,
          }}
          viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
