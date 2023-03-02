import { Component, h } from '@stencil/core';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 1);

const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date(2001, 0, 0).getTime(),
  y: 0,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2001, 0, 0).getTime(),
  y: 4000,
};

const TEST_2DATA_POINT: DataPoint<number> = {
  x: new Date(1998, 0, 0).getTime(),
  y: 0,
};

const TEST_2DATA_POINT_2: DataPoint<number> = {
  x: new Date(1998, 0, 0).getTime(),
  y: 4000,
};

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a circle correctly
 */

@Component({
  tag: 'sc-webgl-context-root',
})
export class ScWebglContextRoot {
  render() {
    return (
      <div>
        <div style={{ width: '10000px', height: '10000px' }}>
          <div style={{ height: '500px', width: '500px' }}>
            <sc-line-chart
              widgetId="widget-id"
              dataStreams={[
                {
                  id: 'test',
                  color: 'black',
                  name: 'test stream',
                  data: [TEST_2DATA_POINT, TEST_2DATA_POINT_2, TEST_DATA_POINT, TEST_DATA_POINT_2],
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
          </div>
          <div style={{ height: '500px', width: '500px' }}>
            <sc-line-chart
              widgetId="widget-id"
              dataStreams={[
                {
                  id: 'test',
                  color: 'black',
                  name: 'test stream',
                  data: [TEST_2DATA_POINT, TEST_2DATA_POINT_2, TEST_DATA_POINT, TEST_DATA_POINT_2],
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
          </div>
          <div style={{ height: '500px', width: '500px' }}>
            <sc-line-chart
              widgetId="widget-id"
              dataStreams={[
                {
                  id: 'test',
                  color: 'black',
                  name: 'test stream',
                  data: [TEST_2DATA_POINT, TEST_2DATA_POINT_2, TEST_DATA_POINT, TEST_DATA_POINT_2],
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
          </div>
          <sc-webgl-context />
        </div>
      </div>
    );
  }
}
