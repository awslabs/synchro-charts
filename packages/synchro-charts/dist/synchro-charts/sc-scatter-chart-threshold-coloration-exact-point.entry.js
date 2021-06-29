import { r as registerInstance, h } from './index-44bccbc7.js';
import { C as COMPARISON_OPERATOR } from './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { a as MONTH_IN_MS } from './time-f374952b.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 1);
const TEST_DATA_POINT = {
    x: new Date(1999, 0, 0).getTime(),
    y: 2000,
};
const TEST_DATA_POINT_2 = {
    x: new Date(2000, 0, 0).getTime(),
    y: 4000,
};
const ScScatterChartThresholdColorationExactPoint = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-scatter-chart", { widgetId: "widget-id", dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    aggregates: { [MONTH_IN_MS]: [TEST_DATA_POINT, TEST_DATA_POINT_2] },
                    data: [],
                    resolution: MONTH_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], annotations: {
                y: [
                    {
                        value: 4000,
                        label: {
                            text: 'y label',
                            show: true,
                        },
                        showValue: true,
                        color: 'red',
                        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
                    },
                ],
                thresholdOptions: { showColor: true },
            }, size: {
                height: 500,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX } }), h("sc-webgl-context", null)));
    }
};

export { ScScatterChartThresholdColorationExactPoint as sc_scatter_chart_threshold_coloration_exact_point };
