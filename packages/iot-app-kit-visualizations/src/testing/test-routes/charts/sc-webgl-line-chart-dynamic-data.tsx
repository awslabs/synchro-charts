import { Component, h, State } from '@stencil/core';
import { Y_VALUE } from './constants';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

// test data point dead center of the viewport

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a line chart when adding/removing data points
 */
const WIDTH = X_MAX.getTime() - X_MIN.getTime();

@Component({
  tag: 'iot-app-kit-vis-webgl-line-chart-dynamic-data',
})
export class ScWebglLineChartDynamicData {
  @State() data: DataPoint<number>[] = [];

  addDataPoint = () => {
    const dataPoint = {
      x: new Date(X_MIN.getTime() + WIDTH / (2 + this.data.length)).getTime(),
      y: Y_VALUE,
    };
    this.data = [dataPoint, ...this.data];
  };

  removeDataPoint = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_firstPoint, ...rest] = this.data;
    this.data = rest;
  };

  render() {
    return (
      <div class="synchro-chart-tests">
        <button id="add-data-point" onClick={this.addDataPoint}>
          Add Data Point
        </button>
        <button id="remove-data-point" onClick={this.removeDataPoint}>
          Remove Data Point
        </button>
        <div id="chart-container" style={{ marginTop: '20px', width: '500px', height: '500px' }}>
          <iot-app-kit-vis-line-chart
            widgetId="widget-id"
            dataStreams={[
              {
                id: 'test',
                color: 'red',
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
          />

          <iot-app-kit-vis-webgl-context />
        </div>
      </div>
    );
  }
}
