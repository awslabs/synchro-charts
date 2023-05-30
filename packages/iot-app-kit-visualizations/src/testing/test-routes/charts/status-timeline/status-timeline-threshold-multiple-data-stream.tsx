import { Component, h } from '@stencil/core';

import { YEAR_IN_MS } from '../../../../utils/time';
import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
import { COMPARISON_OPERATOR } from '../../../../components/charts/common/constants';
import { DataType } from '../../../../utils/dataConstants';

const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 0);

const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 2000,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 3000,
};

@Component({
  tag: 'status-timeline-threshold-coloration-multiple-data-stream',
})
export class StatusTimelineThresholdMultipleDataStream {
  render() {
    return (
      <div>
        <iot-app-kit-vis-status-timeline
          alarms={{ expires: YEAR_IN_MS }}
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              aggregationType: AggregateType.AVERAGE,
              data: [TEST_DATA_POINT, TEST_DATA_POINT_2],
              resolution: YEAR_IN_MS,
              dataType: DataType.NUMBER,
            },
            {
              id: 'test2',
              color: 'black',
              name: 'test stream',
              aggregationType: AggregateType.AVERAGE,
              data: [TEST_2_DATA_POINT, TEST_2_DATA_POINT_2],
              resolution: YEAR_IN_MS,
              dataType: DataType.NUMBER,
            },
          ]}
          annotations={{
            y: [
              {
                value: 2500,
                label: {
                  text: 'y label',
                  show: true,
                },
                showValue: true,
                color: 'blue',
                comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
              },
            ],
            thresholdOptions: {},
          }}
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
