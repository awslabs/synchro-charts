import { Component, h } from '@stencil/core';
import { MONTH_IN_MS, YEAR_IN_MS } from '../../../utils/time';
import { DataStream, Primitive } from '../../../utils/dataTypes';
import { isNumeric } from '../../../utils/number';
import { DataType } from '../../../utils/dataConstants';

// Dynamic on number of data points present
const urlParams = new URLSearchParams(window.location.search);
const isEnabledParam = urlParams.get('isEnabled');
const isEnabled = isEnabledParam === 'true';

const latestValueParam = urlParams.get('latestValue');
const numChartsParam = urlParams.get('numCharts');

/**
 * Parse Param
 */
let latestValue: Primitive | null;
if (latestValueParam == null || latestValueParam === 'null' || latestValueParam === 'undefined') {
  latestValue = null;
} else if (isNumeric(latestValueParam)) {
  latestValue = Number.parseInt(latestValueParam, 10);
} else {
  latestValue = latestValueParam;
}

const numCharts = numChartsParam && isNumeric(numChartsParam) ? Number.parseInt(numChartsParam, 10) : 1;

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);

const NUM_POINTS = 3;

// test data point dead center of the viewport
const DATA = new Array(NUM_POINTS).fill(null).map((_, i) => ({
  x: X_MIN.getTime() + MONTH_IN_MS * (i + 1),
  y: i === NUM_POINTS - 1 && latestValue != null ? latestValue : Y_MIN + 30 * (i + 1),
}));

const DATA_TYPE = typeof latestValue === 'string' ? DataType.STRING : DataType.NUMBER;

const dataStreams: DataStream<Primitive>[] = new Array(numCharts).fill(null).map((_, i) => ({
  id: i.toString(),
  resolution: 0,
  data: i === 0 ? DATA : [],
  color: 'black',
  name: `Quality ${i + 1}`,
  detailedName: `/BellevueWA/QualitySmogIndex-${i}`,
  unit: '%',
  dataType: DATA_TYPE,
}));

@Component({
  tag: 'sc-kpi-standard',
})
export class ScKpiStandard {
  render() {
    return (
      <sc-kpi
        widgetId="test-widget"
        dataStreams={dataStreams}
        viewPort={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX, duration: isEnabled ? YEAR_IN_MS : undefined }}
      />
    );
  }
}
