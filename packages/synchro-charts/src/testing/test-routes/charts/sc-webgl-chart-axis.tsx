import { Component, h } from '@stencil/core';
import { Y_MAX, Y_MIN, X_MIN, X_MAX } from './constants';

@Component({
  tag: 'sc-webgl-chart-axis',
})
export class ScWebglChartAnnotations {
  render() {
    return (
      <div>
        <sc-line-chart
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
          viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
