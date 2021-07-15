import { Component, h } from '@stencil/core';
import { DataPoint, ViewPort } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

const VIEWPORT: ViewPort = {
  yMin: 0,
  yMax: 5000,
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
};
// test data point dead center of the viewport
const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date((VIEWPORT.start.getTime() + VIEWPORT.end.getTime()) / 2).getTime(),
  y: (VIEWPORT.yMin + VIEWPORT.yMax) / 2,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a circle correctly
 */

@Component({
  tag: 'sc-webgl-chart-large-viewport',
})
export class ScWebglChartLargeViewport {
  render() {
    return (
      <div>
        <sc-line-chart
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              data: [TEST_DATA_POINT],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ]}
          widgetId="widget-id"
          size={{
            height: 500,
            width: 500,
          }}
          viewport={VIEWPORT}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
