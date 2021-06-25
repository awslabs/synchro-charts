import { Component, h, State } from '@stencil/core';

import { MONTH_IN_MS } from '../../../../utils/time';
import { DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(2000, 0);
const X_MAX = new Date(2001, 12);

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a bar chart when adding/removing data points
 */

@Component({
  tag: 'sc-webgl-bar-chart-dynamic-data',
})
export class ScWebglBarChartDynamicData {
  @State() data: DataPoint<number>[] = [];
  @State() monthIndex: number = 1;

  addDataPoint = () => {
    const dataPoint = {
      x: new Date(2000, this.monthIndex).getTime(),
      y: 3000,
    };
    this.data = [dataPoint, ...this.data];
    this.monthIndex += 2;
  };

  removeDataPoint = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_firstPoint, ...rest] = this.data;
    this.data = rest;
  };

  render() {
    return (
      <div>
        <button id="add-data-point" onClick={this.addDataPoint}>
          Add Data Point
        </button>
        <button id="remove-data-point" onClick={this.removeDataPoint}>
          Remove Data Point
        </button>
        <br />
        <br />
        <div id="chart-container" style={{ height: '500px', width: '500px' }}>
          <sc-bar-chart
            dataStreams={[
              {
                id: 'test',
                color: 'red',
                name: 'test stream',
                resolution: MONTH_IN_MS,
                aggregates: {
                  [MONTH_IN_MS]: this.data,
                },
                data: [],
                dataType: DataType.NUMBER,
              },
            ]}
            size={{
              width: 500,
              height: 500,
            }}
            widgetId="widget-id"
            viewPort={{
              yMin: Y_MIN,
              yMax: Y_MAX,
              start: X_MIN,
              end: X_MAX,
            }}
          />
          <sc-webgl-context />
        </div>
      </div>
    );
  }
}
