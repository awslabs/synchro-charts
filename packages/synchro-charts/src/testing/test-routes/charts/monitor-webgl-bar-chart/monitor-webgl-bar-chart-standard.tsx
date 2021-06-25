import { Component, h } from '@stencil/core';

import { MINUTE_IN_MS } from '../../../../utils/time';
import { TEST_DATA_POINT_STANDARD, Y_MAX, Y_MIN, X_MIN, X_MAX } from '../constants';
import { DataType } from '../../../..';

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a bar correctly
 */

@Component({
  tag: 'monitor-webgl-bar-chart-standard',
})
export class MonitorWebglBarChartStandard {
  render() {
    return (
      <div>
        <monitor-bar-chart
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              data: [],
              aggregates: {
                [MINUTE_IN_MS]: [TEST_DATA_POINT_STANDARD],
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
          viewPort={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
        />
        <monitor-webgl-context />
      </div>
    );
  }
}
