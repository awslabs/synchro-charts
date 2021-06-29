import { r as registerInstance, h } from './index-44bccbc7.js';
import { C as COMPARISON_OPERATOR } from './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import './terms-d11f73d5.js';
import './index.esm.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';
import { T as TEST_DATA_POINT_STANDARD, a as Y_MIN, b as Y_MAX, X as X_MIN, c as X_MAX } from './constants-c07a73c8.js';

const ScWebglBarChartThresholdNoColoration = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-bar-chart", { dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    data: [],
                    aggregates: {
                        [MINUTE_IN_MS]: [TEST_DATA_POINT_STANDARD],
                    },
                    resolution: MINUTE_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], annotations: {
                y: [
                    {
                        value: 2000,
                        label: {
                            text: 'y label',
                            show: true,
                        },
                        showValue: true,
                        color: 'blue',
                        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
                    },
                ],
                thresholdOptions: {
                    showColor: false,
                },
            }, widgetId: "test-id", size: {
                width: 500,
                height: 500,
            }, viewPort: { yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null)));
    }
};

export { ScWebglBarChartThresholdNoColoration as sc_webgl_bar_chart_threshold_no_coloration };
