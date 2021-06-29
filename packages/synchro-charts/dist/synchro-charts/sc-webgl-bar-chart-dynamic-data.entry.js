import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { a as MONTH_IN_MS } from './time-f374952b.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(2000, 0);
const X_MAX = new Date(2001, 12);
const ScWebglBarChartDynamicData = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.data = [];
        this.monthIndex = 1;
        this.addDataPoint = () => {
            const dataPoint = {
                x: new Date(2000, this.monthIndex).getTime(),
                y: 3000,
            };
            this.data = [dataPoint, ...this.data];
            this.monthIndex += 2;
        };
        this.removeDataPoint = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_firstPoint, ...rest] = this.data;
            this.data = rest;
        };
    }
    render() {
        return (h("div", null, h("button", { id: "add-data-point", onClick: this.addDataPoint }, "Add Data Point"), h("button", { id: "remove-data-point", onClick: this.removeDataPoint }, "Remove Data Point"), h("br", null), h("br", null), h("div", { id: "chart-container", style: { height: '500px', width: '500px' } }, h("sc-bar-chart", { dataStreams: [
                {
                    id: 'test',
                    color: 'red',
                    name: 'test stream',
                    resolution: MONTH_IN_MS,
                    aggregates: {
                        [MONTH_IN_MS]: this.data,
                    },
                    data: [],
                    dataType: DataType.NUMBER,
                },
            ], size: {
                width: 500,
                height: 500,
            }, widgetId: "widget-id", viewPort: {
                yMin: Y_MIN,
                yMax: Y_MAX,
                start: X_MIN,
                end: X_MAX,
            } }), h("sc-webgl-context", null))));
    }
};

export { ScWebglBarChartDynamicData as sc_webgl_bar_chart_dynamic_data };
