import { r as registerInstance, h } from './index-44bccbc7.js';
import { L as LEGEND_POSITION } from './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';

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
const ScWebglChartStandardWithLegendOnRight = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-line-chart", { dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    data: [TEST_DATA_POINT],
                    resolution: 0,
                    dataType: DataType.NUMBER,
                },
            ], widgetId: "widget-id", size: {
                height: 500,
                width: 500,
            }, legend: {
                width: 100,
                position: LEGEND_POSITION.RIGHT,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX } }), h("sc-webgl-context", null)));
    }
};

export { ScWebglChartStandardWithLegendOnRight as sc_webgl_chart_standard_with_legend_on_right };
