import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { a as MONTH_IN_MS } from './time-f374952b.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(2000, 0);
const X_MAX = new Date(2001, 3);
const LEFT_X = new Date(2000, 3).getTime();
const MIDDLE_X = new Date(2000, 6).getTime();
const RIGHT_X = new Date(2000, 9).getTime();
const StatusChartDynamicDataStreams = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.dataStreams = [];
        this.colorIndex = 0;
        this.colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];
        this.increaseColorIndex = () => {
            this.colorIndex += 1;
        };
        this.getColor = () => {
            // Modding the  will cycle through the colors array when the color index becomes greater than
            // the colors array length
            return this.colors[this.colorIndex % this.colors.length];
        };
        this.addStream = () => {
            const leftPoint = {
                x: LEFT_X,
                y: 2.5,
            };
            const middlePoint = {
                x: MIDDLE_X,
                y: 2.5,
            };
            const rightPoint = {
                x: RIGHT_X,
                y: 2.5,
            };
            const streamId = `stream-${this.dataStreams.length + 1}`;
            this.dataStreams = [
                ...this.dataStreams,
                {
                    id: streamId,
                    color: this.getColor(),
                    name: `${streamId}-name`,
                    aggregates: { [MONTH_IN_MS]: [leftPoint, middlePoint, rightPoint] },
                    data: [],
                    resolution: MONTH_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ];
            this.increaseColorIndex();
        };
        this.removeStream = () => {
            this.dataStreams.pop();
            this.dataStreams = [...this.dataStreams];
            this.colorIndex -= 1;
        };
    }
    render() {
        return (h("div", null, h("button", { id: "add-stream", onClick: this.addStream }, "Add Stream"), h("button", { id: "remove-stream", onClick: this.removeStream }, "Remove Stream"), h("br", null), h("br", null), h("div", { id: "chart-container", style: { marginTop: '20px', width: '500px', height: '500px' } }, h("sc-status-chart", { alarms: { expires: MONTH_IN_MS }, dataStreams: this.dataStreams, size: {
                width: 500,
                height: 500,
            }, widgetId: "widget-id", viewPort: {
                yMin: Y_MIN,
                yMax: Y_MAX,
                start: X_MIN,
                end: X_MAX,
            } })), h("sc-webgl-context", null)));
    }
};

export { StatusChartDynamicDataStreams as status_chart_dynamic_data_streams };
