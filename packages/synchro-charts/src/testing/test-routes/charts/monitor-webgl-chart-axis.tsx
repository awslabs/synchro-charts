import { Component, h } from '@stencil/core';
import { Y_MAX, Y_MIN, X_MIN, X_MAX } from './constants';

@Component({
  tag: 'monitor-webgl-chart-axis',
})
export class MonitorWebglChartAnnotations {
  render() {
    return (
      <div>
        <monitor-line-chart
          widgetId="widget-id"
          dataStreams={[]}
          axis={{
            showX: false,
            showY: false,
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
