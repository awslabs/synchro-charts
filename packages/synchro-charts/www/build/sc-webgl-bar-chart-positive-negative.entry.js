import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';

// viewport boundaries
const Y_MIN = -100;
const Y_MAX = 100;
const X_MIN = new Date(2000, 0, 0, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);
// test data point dead center of the viewport
const TEST_DATA_POINT = {
    x: new Date(2000, 0, 0, 0, 3).getTime(),
    y: 50,
};
const TEST_DATA_POINT_2 = {
    x: new Date(2000, 0, 0, 0, 7).getTime(),
    y: -50,
};
const ScWebglBarChartPositiveNegative = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", { id: "chart-container", style: { width: '500px', height: '500px' } }, h("sc-bar-chart", { dataStreams: [
                {
                    id: 'test',
                    aggregates: { [MINUTE_IN_MS]: [TEST_DATA_POINT, TEST_DATA_POINT_2] },
                    data: [],
                    resolution: MINUTE_IN_MS,
                    color: 'black',
                    name: 'test stream',
                    dataType: DataType.NUMBER,
                },
            ], widgetId: "widget-id", size: {
                width: 500,
                height: 500,
            }, viewPort: { yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null)));
    }
};

export { ScWebglBarChartPositiveNegative as sc_webgl_bar_chart_positive_negative };
