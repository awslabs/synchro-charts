import { Component, h } from '@stencil/core';
import { Y_MAX, Y_MIN, X_MIN, X_MAX } from './constants';

@Component({
  tag: 'sc-webgl-chart-annotation-rescaling',
})
export class ScWebglChartAnnotationRescaling {
  render() {
    return (
      <div style={{ width: '85%', height: '85%' }}>
        <sc-line-chart
          widgetId="widget-id"
          dataStreams={[]}
          annotations={{
            x: [
              {
                value: new Date((X_MAX.getTime() + X_MIN.getTime()) / 2),
                label: {
                  text: 'here is a x label',
                  show: true,
                },
                showValue: true,
                color: 'red',
              },
            ],
            y: [
              {
                value: (Y_MAX - Y_MIN) / 2,
                label: {
                  text: 'here is a y label',
                  show: true,
                },
                showValue: true,
                color: 'blue',
              },
            ],
          }}
          viewPort={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
