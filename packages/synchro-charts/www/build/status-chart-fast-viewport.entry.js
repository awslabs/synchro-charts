import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { H as HOUR_IN_MS } from './time-f374952b.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1999, 9, 0, 0, 0);
const X_MAX = new Date(2000, 2, 0, 0, 10);
// test data point dead center of the viewport
const DATA_POINTS = Array.from({ length: 50 }, (_, index) => {
    return {
        x: new Date(2000, 0, index, 0, 0).getTime(),
        y: (Y_MIN + Y_MAX) / 2,
    };
});
const StatusChartFastViewport = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.dataStreams = [];
        this.colorIndex = 0;
        this.start = X_MIN;
        this.end = X_MAX;
        this.idx = 0;
        this.timeRange = [
            [new Date(2000, 2, 0, 0, 0), new Date(2000, 3, 0, 0, 0)],
            [new Date(2010, 4, 0, 0, 0), new Date(2020, 5, 0, 0, 0)],
            [new Date(2030, 6, 0, 0, 0), new Date(2040, 7, 0, 0, 0)],
            [X_MIN, X_MAX],
        ];
        this.changeViewport = () => {
            const [start, end] = this.timeRange[this.idx % this.timeRange.length];
            this.start = start;
            this.end = end;
            this.idx += 1;
        };
    }
    render() {
        return (h("div", null, h("button", { id: "change-viewport", onClick: this.changeViewport }, "Change Viewport"), h("br", null), h("br", null), h("div", { id: "chart-container", style: { border: '1px solid lightgray', height: '500px', width: '500px' } }, h("sc-status-chart", { alarms: { expires: HOUR_IN_MS }, dataStreams: [
                {
                    id: 'test',
                    color: '#264653',
                    name: 'test stream',
                    aggregates: { [HOUR_IN_MS]: DATA_POINTS },
                    data: [],
                    resolution: HOUR_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], widgetId: "widget-id", size: {
                height: 500,
                width: 500,
            }, viewPort: {
                yMin: Y_MIN,
                yMax: Y_MAX,
                start: this.start,
                end: this.end,
            } }), h("sc-webgl-context", null))));
    }
};

export { StatusChartFastViewport as status_chart_fast_viewport };
