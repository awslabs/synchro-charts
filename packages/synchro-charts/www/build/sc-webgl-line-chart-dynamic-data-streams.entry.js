import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';
import { Y as Y_VALUE } from './constants-c07a73c8.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
// test data point dead center of the viewport
const VIEWPORT_WIDTH = X_MAX.getTime() - X_MIN.getTime();
const LEFT_X = new Date(X_MIN.getTime() + VIEWPORT_WIDTH * (1 / 6)).getTime();
const MIDDLE_X = new Date(X_MIN.getTime() + VIEWPORT_WIDTH * (1 / 3)).getTime();
const RIGHT_X = new Date(X_MIN.getTime() + VIEWPORT_WIDTH * (1 / 2)).getTime();
const ScWebglLineChartDynamicDataStreams = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.dataStreams = [];
        this.addStream = () => {
            const leftPoint = {
                x: LEFT_X,
                y: Y_VALUE,
            };
            const middlePoint = {
                x: MIDDLE_X,
                y: Y_VALUE,
            };
            const rightPoint = {
                x: RIGHT_X,
                y: Y_VALUE,
            };
            const streamId = `stream-${this.dataStreams.length + 1}`;
            this.dataStreams = [
                {
                    id: streamId,
                    color: 'black',
                    name: `${streamId}-name`,
                    aggregates: { [MINUTE_IN_MS]: [leftPoint, middlePoint, rightPoint] },
                    data: [],
                    resolution: MINUTE_IN_MS,
                    dataType: DataType.NUMBER,
                },
                ...this.dataStreams,
            ];
        };
        this.removeStream = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_firstStream, ...restStreams] = this.dataStreams;
            this.dataStreams = restStreams;
        };
    }
    render() {
        return (h("div", null, h("button", { id: "add-stream", onClick: this.addStream }, "Add Stream"), h("button", { id: "remove-stream", onClick: this.removeStream }, "Remove Stream"), h("br", null), h("br", null), h("div", { id: "chart-container", style: { marginTop: '20px', width: '500px', height: '500px' } }, h("sc-line-chart", { widgetId: "widget-id", dataStreams: this.dataStreams, size: {
                height: 500,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX } })), h("sc-webgl-context", null)));
    }
};

export { ScWebglLineChartDynamicDataStreams as sc_webgl_line_chart_dynamic_data_streams };
