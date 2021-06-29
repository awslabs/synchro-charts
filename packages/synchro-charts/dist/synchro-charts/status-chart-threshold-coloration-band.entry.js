import { r as registerInstance, h } from './index-44bccbc7.js';
import { C as COMPARISON_OPERATOR } from './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';
import { T as TEST_DATA_POINT_STANDARD, a as Y_MIN, b as Y_MAX, X as X_MIN, c as X_MAX } from './constants-c07a73c8.js';

const urlParams = new URLSearchParams(window.location.search);
const isDiscreteNumericData = urlParams.get('isDiscreteNumericData');
const isStringData = urlParams.get('isStringData');
const data = TEST_DATA_POINT_STANDARD;
const dataType = isDiscreteNumericData === '1' ? DataType.STRING : DataType.NUMBER;
data.y = 2000;
if (isDiscreteNumericData === '1') {
    data.y = 2000;
}
if (isStringData === '1') {
    data.y = 'test';
}
const StatusChartThresholdBand = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-status-chart", { alarms: { expires: MINUTE_IN_MS }, dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    aggregates: { [MINUTE_IN_MS]: [data] },
                    data: [],
                    resolution: MINUTE_IN_MS,
                    dataType,
                },
            ], annotations: {
                y: [
                    {
                        value: isStringData ? 'test' : 2000,
                        label: {
                            text: 'y label',
                            show: true,
                        },
                        showValue: true,
                        color: 'blue',
                        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
                    },
                ],
                thresholdOptions: {
                    showColor: true,
                },
            }, widgetId: "test-id", size: {
                width: 500,
                height: 500,
            }, viewPort: { yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null)));
    }
};

export { StatusChartThresholdBand as status_chart_threshold_coloration_band };
