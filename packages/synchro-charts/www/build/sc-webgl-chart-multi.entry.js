import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';

const VIEW_PORT_GROUP = 'group';
// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
// test data point dead center of the viewport
const TEST_DATA_POINT = {
    x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
    y: (Y_MIN + Y_MAX) / 2,
};
const ScWebglChartMulti = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", { id: "chart-container", style: { border: '1px solid lightgray', height: '500px', width: '500px' } }, h("sc-line-chart", { widgetId: "widget-a", dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    data: [TEST_DATA_POINT],
                    resolution: 0,
                    dataType: DataType.NUMBER,
                },
            ], viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX, group: VIEW_PORT_GROUP } }), h("sc-line-chart", { widgetId: "widget-b", dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    data: [TEST_DATA_POINT],
                    resolution: 0,
                    dataType: DataType.NUMBER,
                },
            ], size: {
                height: 150,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX, group: VIEW_PORT_GROUP } }), h("sc-webgl-context", null)));
    }
};

export { ScWebglChartMulti as sc_webgl_chart_multi };
