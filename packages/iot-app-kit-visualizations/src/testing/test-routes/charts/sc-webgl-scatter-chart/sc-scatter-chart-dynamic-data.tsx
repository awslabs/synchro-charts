import { Component, h, State } from '@stencil/core';
import { Y_VALUE } from '../constants';
import { MONTH_IN_MS } from '../../../../utils/time';
import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const Y_MIN = 0;
const Y_MAX = 5000;

const WIDTH = X_MAX.getTime() - X_MIN.getTime();

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a scatter chart when adding/removing data points
 */
@Component({
  tag: 'iot-app-kit-vis-scatter-chart-dynamic-data',
})
export class ScScatterChartDynamicData {
  @State() data: DataPoint<number>[] = [];

  // test data point dead center of the viewport
  addDataPoint = () => {
    const dataPoint = {
      x: X_MIN.getTime() + WIDTH / (2 + this.data.length),
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
          <iot-app-kit-vis-scatter-chart
            widgetId="widget-id"
            dataStreams={[
              {
                id: 'test',
                color: 'red',
                name: 'test stream',
                data: this.data,
                aggregationType: AggregateType.AVERAGE,
                resolution: MONTH_IN_MS,
                dataType: DataType.NUMBER,
              },
            ]}
            size={{
              height: 500,
              width: 500,
            }}
            viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
            setViewport={() => {}}
          />

          <iot-app-kit-vis-webgl-context />
        </div>
      </div>
    );
  }
}
