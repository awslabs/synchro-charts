import { Component, h, State } from '@stencil/core';
import { AggregateType, DataPoint, DataStream } from '../../../../utils/dataTypes';
import { HOUR_IN_MS } from '../../../../utils/time';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(1999, 9, 0, 0, 0);
const X_MAX = new Date(2000, 2, 0, 0, 10);

// test data point dead center of the viewport
const DATA_POINTS: DataPoint<number>[] = Array.from({ length: 50 }, (_, index) => {
  return {
    x: new Date(2000, 0, index, 0, 0).getTime(),
    y: (Y_MIN + Y_MAX) / 2,
  };
});

@Component({
  tag: 'status-timeline-fast-viewport',
})
export class StatusTimelineFastViewport {
  @State() dataStreams: DataStream<number>[] = [];
  @State() colorIndex: number = 0;
  @State() start: Date = X_MIN;
  @State() end: Date = X_MAX;

  private idx = 0;

  private timeRange = [
    [new Date(2000, 2, 0, 0, 0), new Date(2000, 3, 0, 0, 0)],
    [new Date(2010, 4, 0, 0, 0), new Date(2020, 5, 0, 0, 0)],
    [new Date(2030, 6, 0, 0, 0), new Date(2040, 7, 0, 0, 0)],
    [X_MIN, X_MAX],
  ];

  changeViewport = () => {
    const [start, end] = this.timeRange[this.idx % this.timeRange.length];
    this.start = start;
    this.end = end;
    this.idx += 1;
  };

  render() {
    return (
      <div class="synchro-chart-tests">
        <button id="change-viewport" onClick={this.changeViewport}>
          Change Viewport
        </button>
        <br />
        <br />
        <div id="chart-container" style={{ border: '1px solid lightgray', height: '500px', width: '500px' }}>
          <sc-status-timeline
            alarms={{ expires: HOUR_IN_MS }}
            dataStreams={[
              {
                id: 'test',
                color: '#264653',
                name: 'test stream',
                aggregationType: AggregateType.AVERAGE,
                aggregates: { [HOUR_IN_MS]: DATA_POINTS },
                data: [],
                resolution: HOUR_IN_MS,
                dataType: DataType.NUMBER,
              },
            ]}
            widgetId="widget-id"
            size={{
              height: 500,
              width: 500,
            }}
            viewport={{
              yMin: Y_MIN,
              yMax: Y_MAX,
              start: this.start,
              end: this.end,
            }}
          />
          <sc-webgl-context />
        </div>
      </div>
    );
  }
}
