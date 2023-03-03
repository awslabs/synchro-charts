import { Component, h } from '@stencil/core';

import { MINUTE_IN_MS } from '../../../../utils/time';
import { TEST_DATA_POINT_STANDARD, Y_MAX, Y_MIN, X_MIN, X_MAX } from '../constants';
import { DataType } from '../../../../utils/dataConstants';
import { AggregateType } from '../../../../utils/dataTypes';

@Component({
  tag: 'status-timeline-multiple-data-streams',
})
export class StatusTimelineMultipleDataStreams {
  render() {
    return (
      <div>
        <sc-status-timeline
          alarms={{ expires: MINUTE_IN_MS }}
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream 1',
              aggregationType: AggregateType.AVERAGE,
              aggregates: { [MINUTE_IN_MS]: [{ ...TEST_DATA_POINT_STANDARD, y: 70 }] },
              data: [],
              resolution: MINUTE_IN_MS,
              dataType: DataType.NUMBER,
            },
            {
              id: 'test2',
              color: 'blue',
              name: 'test stream 2',
              aggregationType: AggregateType.AVERAGE,
              aggregates: { [MINUTE_IN_MS]: [{ ...TEST_DATA_POINT_STANDARD, y: 170 }] },
              data: [],
              resolution: MINUTE_IN_MS,
              dataType: DataType.NUMBER,
            },
            {
              id: 'test3',
              color: 'red',
              name: 'test stream 3',
              aggregationType: AggregateType.AVERAGE,
              aggregates: { [MINUTE_IN_MS]: [{ ...TEST_DATA_POINT_STANDARD, y: 60 }] },
              data: [],
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
        />
        <sc-webgl-context />
      </div>
    );
  }
}
