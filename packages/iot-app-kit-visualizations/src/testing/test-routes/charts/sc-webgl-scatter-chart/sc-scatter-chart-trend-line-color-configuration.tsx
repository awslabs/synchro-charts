import { Component, h } from '@stencil/core';
import { SECOND_IN_MS } from '../../../../utils/time';
import { AggregateType, DataPoint } from '../../../../utils/dataTypes';
import { DataType, TREND_TYPE } from '../../../../utils/dataConstants';
import { LEGEND_POSITION } from '../../../../components/charts/common/constants';

// viewport boundaries
const X_MIN = new Date(2018, 0, 0);
const X_MAX = new Date(2020, 0, 0);
const Y_MIN = 0;
const Y_MAX = 5000;

// test data point dead center of the viewport
const TEST_DATA_POINTS: DataPoint[] = [
  {
    x: new Date(2018, 6, 0).getTime(),
    y: 1000,
  },
  {
    x: new Date(2019, 0, 0).getTime(),
    y: 4000,
  },
  {
    x: new Date(2019, 6, 0).getTime(),
    y: 3000,
  },
];

@Component({
  tag: 'iot-app-kit-vis-scatter-chart-trend-line-color-configuration',
})
export class ScScatterChartTrendLineColorConfiguration {
  render() {
    return (
      <div>
        <iot-app-kit-vis-line-chart
          widgetId="widget-id"
          dataStreams={[
            {
              id: 'test',
              color: 'red',
              name: 'test stream',
              aggregationType: AggregateType.AVERAGE,
              data: TEST_DATA_POINTS,
              resolution: SECOND_IN_MS,
              dataType: DataType.NUMBER,
            },
          ]}
          size={{
            height: 500,
            width: 500,
          }}
          viewport={{
            start: X_MIN,
            end: X_MAX,
            yMin: Y_MIN,
            yMax: Y_MAX,
          }}
          setViewport={() => {}}
          legend={{
            position: LEGEND_POSITION.BOTTOM,
            width: 300,
          }}
          trends={[
            {
              dataStreamId: 'test',
              type: TREND_TYPE.LINEAR,
              color: '#123abc',
            },
          ]}
        />
        <iot-app-kit-vis-webgl-context />
      </div>
    );
  }
}
