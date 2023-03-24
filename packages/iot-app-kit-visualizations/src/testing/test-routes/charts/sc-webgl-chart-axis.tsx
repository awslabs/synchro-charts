import { Component, h } from '@stencil/core';
import { Y_MAX, Y_MIN, X_MIN, X_MAX } from './constants';

@Component({
  tag: 'iot-app-kit-vis-webgl-chart-axis',
})
export class ScWebglChartAnnotations {
  render() {
    return (
      <div>
        <iot-app-kit-vis-line-chart
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
          setViewport={() => {}}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
