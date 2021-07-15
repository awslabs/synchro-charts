import { Component, h, State } from '@stencil/core';
import { DataStream } from '../../../../utils/dataTypes';
import { MONTH_IN_MS } from '../../../../utils/time';
import { Y_VALUE } from '../constants';
import { DataType } from '../../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(2000, 0);
const X_MAX = new Date(2001, 3);

const LEFT_X = new Date(2000, 3).getTime();
const MIDDLE_X = new Date(2000, 6).getTime();
const RIGHT_X = new Date(2000, 9).getTime();

/**
 * Used to test the behavior of a bar chart when adding/removing data streams
 */

@Component({
  tag: 'sc-webgl-bar-chart-dynamic-data-streams',
})
export class ScWebglBarChartDynamicDataStreams {
  @State() dataStreams: DataStream<number>[] = [];
  @State() colorIndex: number = 0;

  private colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

  increaseColorIndex = () => {
    this.colorIndex += 1;
  };

  getColor = () => {
    // Modding the  will cycle through the colors array when the color index becomes greater than
    // the colors array length
    return this.colors[this.colorIndex % this.colors.length];
  };
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
      ...this.dataStreams,
      {
        id: streamId,
        color: this.getColor(),
        name: `${streamId}-name`,
        aggregates: {
          [MONTH_IN_MS]: [leftPoint, middlePoint, rightPoint],
        },
        data: [],
        resolution: MONTH_IN_MS,
        dataType: DataType.NUMBER,
      },
    ];
    this.increaseColorIndex();
  };

  removeStream = () => {
    this.dataStreams.pop();
    this.dataStreams = [...this.dataStreams];
    this.colorIndex -= 1;
  };

  render() {
    return (
      <div>
        <button id="add-stream" onClick={this.addStream}>
          Add Stream
        </button>
        <button id="remove-stream" onClick={this.removeStream}>
          Remove Stream
        </button>
        <br />
        <br />
        <div id="chart-container" style={{ marginTop: '20px', width: '500px', height: '500px' }}>
          <sc-bar-chart
            dataStreams={this.dataStreams}
            size={{
              width: 500,
              height: 500,
            }}
            widgetId="widget-id"
            viewport={{
              yMin: Y_MIN,
              yMax: Y_MAX,
              start: X_MIN,
              end: X_MAX,
            }}
          />
        </div>
        <sc-webgl-context />
      </div>
    );
  }
}
