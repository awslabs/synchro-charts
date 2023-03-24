import { Component, h, State } from '@stencil/core';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

/**
 * Tests the scenario where a chart is updated to contain more data than the initialized buffers size.
 * The buffers should resize, resulting in the additional points being rendered onto the chart.
 */
const WIDTH = X_MAX.getTime() - X_MIN.getTime();

@Component({
  tag: 'iot-app-kit-vis-webgl-line-chart-dynamic-buffer',
})
export class ScWebglLineChartDynamicBuffer {
  @State() data: DataPoint<number>[] = [];

  addDataPoint = () => {
    const dataPoint = {
      x: new Date(X_MIN.getTime() + WIDTH / (2 + this.data.length)).getTime(),
      y: 2500,
    };
    this.data = [dataPoint, ...this.data];
  };

  render() {
    return (
      <div class="synchro-chart-tests">
        <button id="add-data-point" onClick={this.addDataPoint}>
          Add Data Point
        </button>

        <div id="chart-container" style={{ marginTop: '20px', width: '500px', height: '500px' }}>
          <iot-app-kit-vis-line-chart
            widgetId="widget-id"
            dataStreams={[
              {
                id: 'test',
                color: 'black',
                name: 'test stream',
                data: this.data,
                resolution: 0,
                dataType: DataType.NUMBER,
              },
            ]}
            size={{
              height: 500,
              width: 500,
            }}
            viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
            setViewport={() => {}}
            bufferFactor={1}
            minBufferSize={1}
          />
          <iot-app-kit-vis-webgl-context />
        </div>
      </div>
    );
  }
}
