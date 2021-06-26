import { Component, h } from '@stencil/core';
import { MONTH_IN_MS, YEAR_IN_MS } from '../../../utils/time';
import { DataStream } from '../../../utils/dataTypes';
import { testCaseParameters } from './testCaseParameters';
import { DataType } from '../../../utils/dataConstants';

const { threshold, latestValue, numDataStreams, isEnabled, labelsConfig, isEditing } = testCaseParameters();

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

const NUM_POINTS = 3;

const DATA_TYPE = typeof latestValue === 'string' ? DataType.STRING : DataType.NUMBER;
// test data point dead center of the viewport
const DATA = new Array(NUM_POINTS).fill(null).map((_, i) => ({
  x: X_MIN.getTime() + MONTH_IN_MS * (i + 1),
  y: i === NUM_POINTS - 1 && latestValue != null ? latestValue : Y_MIN + 100 * (i + 1),
}));

const data: DataStream[] = new Array(numDataStreams).fill(null).map((_, i) => ({
  id: i.toString(),
  data: i === 0 && latestValue != null ? DATA : [],
  color: 'black',
  unit: 'unit',
  name: `Data ${i + 1}`,
  dataType: DATA_TYPE,
  resolution: 0,
}));

@Component({
  tag: 'sc-status-grid-standard',
})
export class ScStatusGridStandard {
  render() {
    const annotations = threshold ? { y: [threshold] } : undefined;
    return (
      <sc-status-grid
        widgetId="test-widget"
        labelsConfig={labelsConfig}
        annotations={annotations}
        dataStreams={data}
        viewPort={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX, duration: isEnabled ? YEAR_IN_MS : undefined }}
        isEditing={isEditing}
      />
    );
  }
}
