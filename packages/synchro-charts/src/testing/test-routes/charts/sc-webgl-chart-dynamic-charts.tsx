import uuid from 'uuid/v4';
import { Component, h, State } from '@stencil/core';
import { DataPoint, DataStream } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

// test data point dead center of the viewport
const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
  y: (Y_MIN + Y_MAX) / 20,
};

const createData = (point: DataPoint<number>, numPoints: number): DataPoint<number>[] =>
  new Array(numPoints).fill(0).map((_, i) => ({
    x: point.x,
    y: point.y + ((Y_MAX - Y_MIN) / 20) * i,
  }));

/**
 * Tests behavior with dynamically adding/removing a chart.
 */

let numPointCounter = 1;

@Component({
  tag: 'sc-webgl-chart-dynamic-charts',
})
export class ScWebglChartStandard {
  @State() chartKeys: { key: string; data: DataStream[] }[] = [];
  @State() width: number = 500;
  @State() xOffset: number = 0;

  shiftLeft = () => {
    this.xOffset -= 100;
  };

  shiftRight = () => {
    this.xOffset += 100;
  };

  increaseWidth = () => {
    this.width += 100;
  };

  decreaseWidth = () => {
    if (this.width > 100) {
      this.width -= 100;
    }
  };

  addChartAtFront = () => {
    const key = uuid();
    this.chartKeys = [
      {
        key,
        data: [
          {
            id: key,

            color: 'black',
            name: 'test stream',
            data: createData(TEST_DATA_POINT, numPointCounter),
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
      },
      ...this.chartKeys,
    ];
    numPointCounter += 1;
  };

  addChartAtBack = () => {
    const key = uuid();
    this.chartKeys = [
      ...this.chartKeys,
      {
        key,
        data: [
          {
            id: key,
            color: 'black',
            name: 'test stream',
            data: createData(TEST_DATA_POINT, numPointCounter),
            resolution: 0,
            dataType: DataType.NUMBER,
          },
        ],
      },
    ];
    numPointCounter += 1;
  };

  removeFrontChart = () => {
    if (this.chartKeys.length > 0) {
      this.chartKeys = this.chartKeys.slice(1);
    }
  };

  removeBackChart = () => {
    if (this.chartKeys.length > 0) {
      this.chartKeys = this.chartKeys.slice(0, -1);
    }
  };

  render() {
    return (
      <div class="synchro-chart-tests">
        <button id="shift-right" onClick={this.shiftRight}>
          Shift Right
        </button>
        <button id="shift-left" onClick={this.shiftLeft}>
          Shift Left
        </button>
        <button id="increase-width" onClick={this.increaseWidth}>
          Increase Width
        </button>
        <button id="decrease-width" onClick={this.decreaseWidth}>
          Decrease Width
        </button>
        <button id="add-chart-to-front" onClick={this.addChartAtFront}>
          Add Chart To Front
        </button>
        <button id="add-chart-to-back" onClick={this.addChartAtBack}>
          Add Chart To Back
        </button>
        <button id="remove-chart-from-back" onClick={this.removeBackChart}>
          Remove Chart From Back
        </button>
        <button id="remove-chart-from-front" onClick={this.removeFrontChart}>
          Remove Chart From Front
        </button>
        <hr />

        {this.chartKeys.map(({ key, data }) => (
          <div key={key} style={{ marginLeft: `${this.xOffset}px`, width: `${this.width}px`, height: '500px' }}>
            <sc-line-chart
              dataStreams={data}
              widgetId={key}
              viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
            />
          </div>
        ))}
        <sc-webgl-context />
      </div>
    );
  }
}
