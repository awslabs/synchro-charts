import { Component, h } from '@stencil/core';
import { Y_MAX, Y_MIN, X_MIN, X_MAX } from './constants';

@Component({
  tag: 'monitor-webgl-chart-no-annotations',
})
export class MonitorWebglChartNoAnnotations {
  render() {
    return (
      <div>
        <monitor-line-chart
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
          viewPort={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
        />
        <monitor-webgl-context />
      </div>
    );
  }
}
