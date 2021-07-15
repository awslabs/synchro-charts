import { Component, h } from '@stencil/core';

import { MINUTE_IN_MS } from '../../../../utils/time';
import { Annotations } from '../../../../components/charts/common/types';
import { DataPoint } from '../../../../utils/dataTypes';
import { COMPARISON_OPERATOR } from '../../../../components/charts/common/constants';
import { DataType } from '../../../../utils/dataConstants';

// Ten Minute Duration Viewport
const Y_MAX = 100;
const Y_MIN = 0;
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);

const STATUS_ZERO = 'STATUS_ZERO';
const STATUS_ONE = 'STATUS_ONE';
const STATUS_TWO = 'STATUS_TWO';
const STATUS_THREE = 'STATUS_THREE';

const DATA_POINTS: DataPoint<string>[] = [
  { x: X_MIN.getTime(), y: STATUS_ZERO },
  { x: X_MIN.getTime() + 5 * MINUTE_IN_MS, y: STATUS_ONE },
  { x: X_MIN.getTime() + 6 * MINUTE_IN_MS, y: STATUS_TWO },
  { x: X_MIN.getTime() + 6.5 * MINUTE_IN_MS, y: STATUS_THREE },
];

const annotations: Annotations = {
  y: [
    {
      value: STATUS_ZERO,
      color: 'red',
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    },
    {
      value: STATUS_ONE,
      color: 'blue',
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    },
    {
      value: STATUS_TWO,
      color: 'green',
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    },
  ],
};

@Component({
  tag: 'status-timeline-raw-data',
})
export class StatusTimelineRawData {
  render() {
    return (
      <div>
        <sc-status-timeline
          alarms={{ expires: MINUTE_IN_MS }}
          dataStreams={[
            {
              id: 'test',
              data: DATA_POINTS,
              color: 'black',
              name: 'test stream 1',
              resolution: 0,
              dataType: DataType.STRING,
            },
          ]}
          widgetId="test-id"
          size={{
            width: 500,
            height: 500,
          }}
          annotations={annotations}
          viewport={{ yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
