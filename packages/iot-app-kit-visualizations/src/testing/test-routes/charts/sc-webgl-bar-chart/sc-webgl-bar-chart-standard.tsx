import { Component, h } from '@stencil/core';

import { MINUTE_IN_MS } from '../../../../utils/time';
import { AggregateType } from '../../../../utils/dataTypes';
import { TEST_DATA_POINT_STANDARD, Y_MAX, Y_MIN, X_MIN, X_MAX } from '../constants';
import { DataType } from '../../../../utils/dataConstants';

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a bar correctly
 */

@Component({
  tag: 'iot-app-kit-vis-webgl-bar-chart-standard',
})
export class ScWebglBarChartStandard {
  render() {
    return (
      <div>
        <iot-app-kit-vis-bar-chart
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              data: [TEST_DATA_POINT_STANDARD],
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
          viewport={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
          setViewport={() => {}}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
