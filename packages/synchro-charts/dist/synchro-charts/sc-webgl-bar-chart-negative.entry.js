import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';

// viewport boundaries
const Y_MIN = -3000;
const Y_MAX = 1000;
const X_MIN = new Date(2000, 0, 0, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);
// test data point dead center of the viewport
const TEST_DATA_POINT = {
    x: (X_MIN.getTime() + X_MAX.getTime()) / 2,
    y: (Y_MIN - Y_MAX) / 2,
};
const ScWebglBarChartNegative = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", { id: "chart-container", style: { width: '500px', height: '500px' } }, h("sc-bar-chart", { dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    aggregates: {
                        [MINUTE_IN_MS]: [TEST_DATA_POINT],
                    },
                    data: [],
                    resolution: MINUTE_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], widgetId: "widget-id", size: {
                width: 500,
                height: 500,
            }, viewPort: { yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null)));
    }
};

export { ScWebglBarChartNegative as sc_webgl_bar_chart_negative };
