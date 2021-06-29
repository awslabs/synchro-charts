import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { a as MONTH_IN_MS } from './time-f374952b.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 1, 0);
const X_MAX = new Date(1998, 6, 0);
/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a bar chart when adding/removing data points
 */
const DATA_STREAM_1 = {
    id: 'test',
    color: 'red',
    name: 'test stream',
    resolution: MONTH_IN_MS,
    aggregates: {
        [MONTH_IN_MS]: [
            { x: new Date(1998, 3, 0, 0).getTime(), y: 1000 },
            { x: new Date(1998, 4, 0, 0).getTime(), y: 3000 },
        ],
    },
    data: [],
    dataType: DataType.NUMBER,
};
const DATA_STREAM_2 = {
    id: 'test2',
    color: 'orange',
    name: 'test stream2',
    resolution: MONTH_IN_MS,
    aggregates: {
        [MONTH_IN_MS]: [
            { x: new Date(1998, 3, 0, 0).getTime(), y: 2000 },
            { x: new Date(1998, 4, 0, 0).getTime(), y: 4000 },
        ],
    },
    data: [],
    dataType: DataType.NUMBER,
};
const ScWebglBarChartDynamicBuffer = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.data = [];
    }
    render() {
        return (h("div", { id: "chart-container", style: { height: '500px', width: '500px', marginTop: '20px' } }, h("sc-bar-chart", { widgetId: "widget-id", dataStreams: [DATA_STREAM_1, DATA_STREAM_2], viewPort: { yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX }, bufferFactor: 1, minBufferSize: 1 }), h("sc-webgl-context", null)));
    }
};

export { ScWebglBarChartDynamicBuffer as sc_webgl_bar_chart_margin };
