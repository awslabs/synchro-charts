import { Component, h, State } from '@stencil/core';

import { DataPoint } from '../../../../utils/dataTypes';
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
  tag: 'sc-webgl-bar-chart-start-from-zero',
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
      <div>
        <button id="change-data-direction" onClick={this.changeDataDirection}>
          Change Data Direction
        </button>
        <br />
        <br />
        <div id="chart-container" style={{ width: '500px', height: '500px' }}>
          <sc-bar-chart
            dataStreams={[
              {
                id: 'test',
                color: 'purple',
                name: 'test stream',
                data: [],
                aggregates: {
                  [MINUTE_IN_MS]: this.testData,
                },
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
          />
          <sc-webgl-context />
        </div>
      </div>
    );
  }
}
