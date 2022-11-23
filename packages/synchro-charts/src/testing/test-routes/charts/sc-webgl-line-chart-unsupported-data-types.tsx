import { Component, h } from '@stencil/core';
import { DataType } from '../../../utils/dataConstants';
import { Y_VALUE_STRING } from './constants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

const WIDTH = X_MAX.getTime() - X_MIN.getTime();

@Component({
  tag: 'line-chart-unsupported-data-types',
})
export class LineChartUnsupportedDataTypes {
  render() {
    return (
      <div class="synchro-chart-tests">
        <div id="chart-container" style={{ marginTop: '20px', width: '500px', height: '500px' }}>
          <sc-line-chart
            widgetId="widget-id"
            dataStreams={[
              {
                id: 'test',
                color: 'black',
                name: 'test stream',
                data: [
                  {
                    x: new Date(X_MIN.getTime() + WIDTH / 4).getTime(),
                    y: Y_VALUE_STRING,
                  },
                  {
                    x: new Date(X_MIN.getTime() + WIDTH / 4).getTime(),
                    y: Y_VALUE_STRING,
                  },
                ],
                resolution: 0,
                dataType: DataType.STRING,
              },
            ]}
            size={{
              height: 500,
              width: 500,
            }}
            viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
            bufferFactor={1}
            minBufferSize={1}
          />
          <sc-webgl-context />
        </div>
      </div>
    );
  }
}
