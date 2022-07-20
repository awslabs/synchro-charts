import { Component, h } from '@stencil/core';
import { DataType } from '../../../utils/dataConstants';
import { YEAR_IN_MS } from '../../../utils/time';
import { Primitive } from '../../../utils/dataTypes';
import { isNumeric } from '../../../utils/number';

// Dynamic on number of data points present
const urlParams = new URLSearchParams(window.location.search);
// const isEnabled = isEnabledParam === 'false';

const latestValueParam = urlParams.get('latestValue');

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

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 2000;

const DATA_TYPE = typeof latestValue === 'string' ? DataType.STRING : DataType.NUMBER;

@Component({
  tag: 'sc-dial-standard',
})
export class ScDialStandard {
  dataStream = {
    id: 'car-speed-alarm',
    name: 'Wind temperature',
    data: [
      {
        x: new Date(2001, 0, 0).getTime(),
        y: latestValue || Y_MIN + 30,
      },
    ],
    unit: '',
    resolution: 0,
    dataType: DATA_TYPE,
  };
  render() {
    return (
      <sc-dial
        widgetId="test-widget"
        dataStream={this.dataStream}
        viewport={{ yMin: Y_MIN, yMax: Y_MAX, duration: YEAR_IN_MS }}
      />
    );
  }
}
