import { Component, h, State } from '@stencil/core';

import { MONTH_IN_MS } from '../../../../utils/time';
import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const WIDTH = X_MAX.getTime() - X_MIN.getTime();

@Component({
  tag: 'status-timeline-dynamic-buffer',
})
export class StatusTimelineDynamicBuffer {
  @State() data: DataPoint<number>[] = [];

  addDataPoint = () => {
    const dataPoint = {
      // To generate new status with half of the distance.
      x: X_MIN.getTime() + WIDTH / (2 + this.data.length),
      y: 2.5,
    };
    this.data = [dataPoint, ...this.data];
  };

  render() {
    return (
      <div class="synchro-chart-tests">
        <button id="add-data-point" onClick={this.addDataPoint}>
          Add Data Point
        </button>
        <div id="chart-container" style={{ height: '500px', width: '500px', marginTop: '20px' }}>
          <iot-app-kit-vis-status-timeline
            widgetId="widget-id"
            alarms={{ expires: MONTH_IN_MS }}
            dataStreams={[
              {
                id: 'test',
                color: 'red',
                name: 'test stream',
                aggregationType: AggregateType.AVERAGE,
                data: this.data,
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
            setViewport={() => {}}
            bufferFactor={1}
            minBufferSize={1}
          />
          <iot-app-kit-vis-webgl-context />
        </div>
      </div>
    );
  }
}
