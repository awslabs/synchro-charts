import { Component, h, Prop } from '@stencil/core';
import { DataPoint, DataStream } from '../../../utils/dataTypes';
import { MONTH_IN_MS } from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';

const urlParams = new URLSearchParams(window.location.search);
const componentTag = urlParams.get('componentTag') || 'sc-line-chart';

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2001, 0, 0);
const DIFF = X_MAX.getTime() - X_MIN.getTime();

const SOME_NUM = 5000;

const POINT_1: DataPoint<number> = {
  x: new Date(X_MIN.getTime() + DIFF / 5).getTime(),
  y: SOME_NUM / 5,
};

const POINT_2: DataPoint<number> = {
  x: new Date(X_MIN.getTime() + (DIFF * 2) / 5).getTime(),
  y: SOME_NUM / 4,
};

const POINT_3: DataPoint<number> = {
  x: new Date(X_MIN.getTime() + (DIFF * 3) / 5).getTime(),
  y: SOME_NUM,
};

const POINT_4: DataPoint<number> = {
  x: new Date(X_MIN.getTime() + (DIFF * 4) / 5).getTime(),
  y: SOME_NUM * 2,
};

const POINT_5: DataPoint<number> = {
  x: new Date(X_MIN.getTime() + DIFF).getTime(),
  y: SOME_NUM * 3,
};

const data: DataStream<number>[] = [
  {
    id: 'test',
    dataType: DataType.NUMBER,
    color: 'black',
    name: 'test stream',
    aggregates: { [MONTH_IN_MS]: [POINT_1, POINT_2, POINT_3, POINT_4, POINT_5] },
    data: [],
    resolution: MONTH_IN_MS,
  },
];

@Component({
  tag: 'sc-chart-y-range',
})
export class ScChartYRange {
  @Prop() component: string = componentTag;

  render() {
    return (
      <div>
        <this.component
          widgetId="widget-id"
          dataStreams={data}
          size={{
            height: 500,
            width: 500,
          }}
          viewPort={{ start: X_MIN, end: X_MAX }}
        />
        <sc-webgl-context />
      </div>
    );
  }
}
