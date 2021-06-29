import { r as registerInstance, h } from './index-44bccbc7.js';
import { C as COMPARISON_OPERATOR } from './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';

// Ten Minute Duration Viewport
const Y_MAX = 100;
const Y_MIN = 0;
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);
const STATUS_ZERO = 'STATUS_ZERO';
const STATUS_ONE = 'STATUS_ONE';
const STATUS_TWO = 'STATUS_TWO';
const STATUS_THREE = 'STATUS_THREE';
const DATA_POINTS = [
    { x: X_MIN.getTime(), y: STATUS_ZERO },
    { x: X_MIN.getTime() + 5 * MINUTE_IN_MS, y: STATUS_ONE },
    { x: X_MIN.getTime() + 6 * MINUTE_IN_MS, y: STATUS_TWO },
    { x: X_MIN.getTime() + 6.5 * MINUTE_IN_MS, y: STATUS_THREE },
];
const annotations = {
    y: [
        {
            value: STATUS_ZERO,
            color: 'red',
            comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        },
        {
            value: STATUS_ONE,
            color: 'blue',
            comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        },
        {
            value: STATUS_TWO,
            color: 'green',
            comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        },
    ],
};
const StatusChartRawData = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-status-chart", { alarms: { expires: MINUTE_IN_MS }, dataStreams: [
                {
                    id: 'test',
                    data: DATA_POINTS,
                    color: 'black',
                    name: 'test stream 1',
                    resolution: 0,
                    dataType: DataType.STRING,
                },
            ], widgetId: "test-id", size: {
                width: 500,
                height: 500,
            }, annotations: annotations, viewPort: { yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null)));
    }
};

export { StatusChartRawData as status_chart_raw_data };
