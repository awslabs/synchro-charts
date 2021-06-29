import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { a as MONTH_IN_MS } from './time-f374952b.js';

const urlParams = new URLSearchParams(window.location.search);
const componentTag = urlParams.get('componentTag') || 'sc-line-chart';
// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2001, 0, 0);
const DIFF = X_MAX.getTime() - X_MIN.getTime();
const SOME_NUM = 5000;
const POINT_1 = {
    x: new Date(X_MIN.getTime() + DIFF / 5).getTime(),
    y: SOME_NUM / 5,
};
const POINT_2 = {
    x: new Date(X_MIN.getTime() + (DIFF * 2) / 5).getTime(),
    y: SOME_NUM / 4,
};
const POINT_3 = {
    x: new Date(X_MIN.getTime() + (DIFF * 3) / 5).getTime(),
    y: SOME_NUM,
};
const POINT_4 = {
    x: new Date(X_MIN.getTime() + (DIFF * 4) / 5).getTime(),
    y: SOME_NUM * 2,
};
const POINT_5 = {
    x: new Date(X_MIN.getTime() + DIFF).getTime(),
    y: SOME_NUM * 3,
};
const data = [
    {
        id: 'test',
        dataType: DataType.NUMBER,
        color: 'black',
        name: 'test stream',
        aggregates: { [MONTH_IN_MS]: [POINT_1, POINT_2, POINT_3, POINT_4, POINT_5] },
        data: [],
        resolution: MONTH_IN_MS,
    },
];
const ScChartYRange = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.component = componentTag;
    }
    render() {
        return (h("div", null, h(this.component, { widgetId: "widget-id", dataStreams: data, size: {
                height: 500,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null)));
    }
};

export { ScChartYRange as sc_chart_y_range };
