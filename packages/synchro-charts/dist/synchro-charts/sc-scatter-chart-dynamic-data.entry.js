import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { a as MONTH_IN_MS } from './time-f374952b.js';
import { Y as Y_VALUE } from './constants-c07a73c8.js';

// viewport boundaries
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const Y_MIN = 0;
const Y_MAX = 5000;
const WIDTH = X_MAX.getTime() - X_MIN.getTime();
const ScScatterChartDynamicData = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.data = [];
        // test data point dead center of the viewport
        this.addDataPoint = () => {
            const dataPoint = {
                x: X_MIN.getTime() + WIDTH / (2 + this.data.length),
                y: Y_VALUE,
            };
            this.data = [dataPoint, ...this.data];
        };
        this.removeDataPoint = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_firstPoint, ...rest] = this.data;
            this.data = rest;
        };
    }
    render() {
        return (h("div", null, h("button", { id: "add-data-point", onClick: this.addDataPoint }, "Add Data Point"), h("button", { id: "remove-data-point", onClick: this.removeDataPoint }, "Remove Data Point"), h("div", { id: "chart-container", style: { marginTop: '20px', width: '500px', height: '500px' } }, h("sc-scatter-chart", { widgetId: "widget-id", dataStreams: [
                {
                    id: 'test',
                    color: 'red',
                    name: 'test stream',
                    data: [],
                    aggregates: {
                        [MONTH_IN_MS]: this.data,
                    },
                    resolution: MONTH_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], size: {
                height: 500,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX } }), h("sc-webgl-context", null))));
    }
};

export { ScScatterChartDynamicData as sc_scatter_chart_dynamic_data };
