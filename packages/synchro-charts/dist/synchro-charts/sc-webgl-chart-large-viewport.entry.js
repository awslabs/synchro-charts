import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';

const VIEWPORT = {
    yMin: 0,
    yMax: 5000,
    start: new Date(2000, 0, 0),
    end: new Date(2001, 0, 0),
};
// test data point dead center of the viewport
const TEST_DATA_POINT = {
    x: new Date((VIEWPORT.start.getTime() + VIEWPORT.end.getTime()) / 2).getTime(),
    y: (VIEWPORT.yMin + VIEWPORT.yMax) / 2,
};
const ScWebglChartLargeViewport = class {
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
            }, viewPort: VIEWPORT }), h("sc-webgl-context", null)));
    }
};

export { ScWebglChartLargeViewport as sc_webgl_chart_large_viewport };
