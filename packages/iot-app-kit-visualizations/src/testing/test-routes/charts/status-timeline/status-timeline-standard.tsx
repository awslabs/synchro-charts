import { Component, h } from '@stencil/core';

import { MINUTE_IN_MS } from '../../../../utils/time';
import { TEST_DATA_POINT_STANDARD, Y_MAX, Y_MIN, X_MIN, X_MAX } from '../constants';
import { DataType } from '../../../../utils/dataConstants';

@Component({
  tag: 'status-timeline-standard',
})
export class StatusTimelineStandard {
  render() {
    return (
      <div>
        <iot-app-kit-vis-status-timeline
          alarms={{ expires: MINUTE_IN_MS }}
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              data: [{ ...TEST_DATA_POINT_STANDARD, y: 70 }],
              resolution: 0,
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
