import { Component, h, State } from '@stencil/core';

import { MONTH_IN_MS } from '../../../../utils/time';
import { DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a bar chart when adding/removing data points
 */
const WIDTH = X_MAX.getTime() - X_MIN.getTime();

@Component({
  tag: 'sc-webgl-bar-chart-dynamic-buffer',
})
export class ScWebglBarChartDynamicBuffer {
  @State() data: DataPoint<number>[] = [];

  addDataPoint = () => {
    const dataPoint = {
      // To generate new bar with half of the distance.
      x: new Date(X_MIN.getTime() + WIDTH / (2 + this.data.length)).getTime(),
      y: 2500,
    };
    this.data = [dataPoint, ...this.data];
  };

  render() {
    return (
      <div>
        <button id="add-data-point" onClick={this.addDataPoint}>
          Add Data Point
        </button>
        <div id="chart-container" style={{ height: '500px', width: '500px', marginTop: '20px' }}>
          <sc-bar-chart
            widgetId="widget-id"
            dataStreams={[
              {
                id: 'test',
                color: 'red',
                name: 'test stream',
                aggregates: {
                  [MONTH_IN_MS]: this.data,
                },
                data: [],
                resolution: MONTH_IN_MS,
                dataType: DataType.NUMBER,
              },
            ]}
            viewport={{
              yMin: Y_MIN,
              yMax: Y_MAX,
              start: X_MIN,
              end: X_MAX,
            }}
            bufferFactor={1}
            minBufferSize={1}
          />
          <sc-webgl-context />
        </div>
      </div>
    );
  }
}
