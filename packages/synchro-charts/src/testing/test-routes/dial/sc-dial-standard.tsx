import { Component, h } from '@stencil/core';
import { DataType, StreamType } from '../../../utils/dataConstants';
import { YEAR_IN_MS } from '../../../utils/time';
import { Primitive } from '../../../utils/dataTypes';
import { isNumeric } from '../../../utils/number';
import { COMPARISON_OPERATOR, StatusIcon } from '../../../components/charts/common/constants';

// Dynamic on number of data points present
const urlParams = new URLSearchParams(window.location.search);
// const isEnabled = isEnabledParam === 'false';

const latestValueParam = urlParams.get('latestValue');
const isloading = urlParams.get('isloading');
const unit = urlParams.get('unit');
const error = urlParams.get('error');
const alarm = urlParams.get('alarm');

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
const Y_MAX = 5000;

const DATA_TYPE = typeof latestValue === 'string' ? DataType.STRING : DataType.NUMBER;

const alarmValue = {
  low: {
    value: 'Critical',
    icon: StatusIcon.ERROR,
  },
  middle: {
    value: 'Warning',
    icon: StatusIcon.LATCHED,
  },
  high: {
    value: 'Normal',
    icon: StatusIcon.NORMAL,
  },
};
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
    unit: unit || '',
    resolution: 0,
    dataType: DATA_TYPE,
    isLoading: JSON.parse(isloading || 'false'),
  };

  annotations = {
    y: [
      {
        color: '',
        value: alarmValue[alarm || 'low'].value,
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        dataStreamIds: ['car-speed-alarm'],
        icon: alarmValue[alarm || 'low'].icon,
      },
    ],
  };

  associatedStreams = [
    {
      id: 'car-speed-alarm',
      type: StreamType.ALARM,
    },
  ];
  render() {
    const props = alarm ? { annotations: this.annotations, associatedStreams: this.associatedStreams } : null;
    const datastream = error ? Object.assign(this.dataStream, { error }) : this.dataStream;
    return (
      <sc-dial
        {...props}
        widgetId="test-widget"
        dataStream={datastream}
        viewport={{ yMin: Y_MIN, yMax: Y_MAX, duration: YEAR_IN_MS }}
      />
    );
  }
}
