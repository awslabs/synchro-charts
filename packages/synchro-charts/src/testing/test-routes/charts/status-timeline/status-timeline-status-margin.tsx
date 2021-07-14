import { Component, h, State } from '@stencil/core';

import { MONTH_IN_MS } from '../../../../utils/time';
import { DataPoint, DataStream } from '../../../../utils/dataTypes';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(1998, 1, 0);
const X_MAX = new Date(1998, 6, 0);

const DATA_STREAM_1: DataStream = {
  id: 'test',
  color: 'red',
  name: 'test stream',
  resolution: MONTH_IN_MS,
  aggregates: {
    [MONTH_IN_MS]: [
      { x: new Date(1998, 3, 0, 0).getTime(), y: 1000 },
      { x: new Date(1998, 4, 0, 0).getTime(), y: 3 },
    ],
  },
  data: [],
  dataType: DataType.NUMBER,
};
const DATA_STREAM_2: DataStream = {
  id: 'test2',
  color: 'orange',
  name: 'test stream2',
  resolution: MONTH_IN_MS,
  data: [
    { x: new Date(1998, 3, 0, 0).getTime(), y: 2000 },
    { x: new Date(1998, 4, 0, 0).getTime(), y: 4 },
  ],
  dataType: DataType.NUMBER,
};

@Component({
  tag: 'status-timeline-margin',
})
export class StatusTimelineStatusMargin {
  @State() data: DataPoint<number>[] = [];

  render() {
    return (
      <div id="chart-container" style={{ height: '500px', width: '500px', marginTop: '20px' }}>
        <sc-status-timeline
          alarms={{ expires: MONTH_IN_MS }}
          widgetId="widget-id"
          dataStreams={[DATA_STREAM_1, DATA_STREAM_2]}
          viewPort={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
