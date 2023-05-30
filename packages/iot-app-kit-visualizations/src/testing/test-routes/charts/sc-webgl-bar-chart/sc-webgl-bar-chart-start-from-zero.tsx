import { Component, h, State } from '@stencil/core';

import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
import { MINUTE_IN_MS } from '../../../../utils/time';
import { DataType } from '../../../../utils/dataConstants';

const X_MIN = new Date(2000, 0, 0, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that bar chart starts from 0
 */

@Component({
  tag: 'iot-app-kit-vis-webgl-bar-chart-start-from-zero',
})
export class ScWebglBarChartStartFromZero {
  @State() testData: DataPoint<number>[] = [
    {
      x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
      y: 4500,
    },
  ];

  changeDataDirection = () => {
    this.testData = this.testData.map(({ x, y }) => {
      return {
        x,
        y: -y,
      };
    });
  };

  render() {
    return (
      <div class="synchro-chart-tests">
        <button id="change-data-direction" onClick={this.changeDataDirection}>
          Change Data Direction
        </button>
        <br />
        <br />
        <div id="chart-container" style={{ width: '500px', height: '500px' }}>
          <iot-app-kit-vis-bar-chart
            dataStreams={[
              {
                id: 'test',
                color: 'purple',
                name: 'test stream',
                data: this.testData,
                aggregationType: AggregateType.AVERAGE,
                resolution: MINUTE_IN_MS,
                dataType: DataType.NUMBER,
              },
            ]}
            widgetId="test-id"
            size={{
              width: 500,
              height: 500,
            }}
            viewport={{ start: X_MIN, end: X_MAX }}
            setViewport={() => {}}
          />
          <iot-app-kit-vis-webgl-context />
        </div>
      </div>
    );
  }
}
