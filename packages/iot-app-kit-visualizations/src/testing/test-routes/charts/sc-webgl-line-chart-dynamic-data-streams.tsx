import { Component, h, State } from '@stencil/core';
import { Y_VALUE } from './constants';
import { MINUTE_IN_MS } from '../../../utils/time';
import { AggregateType, DataStream } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

// test data point dead center of the viewport

const VIEWPORT_WIDTH = X_MAX.getTime() - X_MIN.getTime();
const LEFT_X = new Date(X_MIN.getTime() + VIEWPORT_WIDTH * (1 / 6)).getTime();
const MIDDLE_X = new Date(X_MIN.getTime() + VIEWPORT_WIDTH * (1 / 3)).getTime();
const RIGHT_X = new Date(X_MIN.getTime() + VIEWPORT_WIDTH * (1 / 2)).getTime();

/**
 * Used to test the behavior of a line chart when adding/removing data streams
 */

@Component({
  tag: 'sc-webgl-line-chart-dynamic-data-streams',
})
export class ScWebglLineChartDynamicDataStreams {
  @State() dataStreams: DataStream<number>[] = [];

  addStream = () => {
    const leftPoint = {
      x: LEFT_X,
      y: Y_VALUE,
    };
    const middlePoint = {
      x: MIDDLE_X,
      y: Y_VALUE,
    };
    const rightPoint = {
      x: RIGHT_X,
      y: Y_VALUE,
    };
    const streamId = `stream-${this.dataStreams.length + 1}`;
    this.dataStreams = [
      {
        id: streamId,
        color: 'black',
        name: `${streamId}-name`,
        aggregationType: AggregateType.AVERAGE,
        aggregates: { [MINUTE_IN_MS]: [leftPoint, middlePoint, rightPoint] },
        data: [],
        resolution: MINUTE_IN_MS,
        dataType: DataType.NUMBER,
      },
      ...this.dataStreams,
    ];
  };

  removeStream = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_firstStream, ...restStreams] = this.dataStreams;
    this.dataStreams = restStreams;
  };

  render() {
    return (
      <div class="synchro-chart-tests">
        <button id="add-stream" onClick={this.addStream}>
          Add Stream
        </button>
        <button id="remove-stream" onClick={this.removeStream}>
          Remove Stream
        </button>
        <br />
        <br />
        <div id="chart-container" style={{ marginTop: '20px', width: '500px', height: '500px' }}>
          <sc-line-chart
            widgetId="widget-id"
            dataStreams={this.dataStreams}
            size={{
              height: 500,
              width: 500,
            }}
            viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
          />
        </div>
        <sc-webgl-context />
      </div>
    );
  }
}
