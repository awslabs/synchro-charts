import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { a as MONTH_IN_MS } from './time-f374952b.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a status chart when adding/removing data points
 */
const WIDTH = X_MAX.getTime() - X_MIN.getTime();
const StatusChartDynamicBuffer = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.data = [];
        this.addDataPoint = () => {
            const dataPoint = {
                // To generate new status with half of the distance.
                x: X_MIN.getTime() + WIDTH / (2 + this.data.length),
                y: 2.5,
            };
            this.data = [dataPoint, ...this.data];
        };
    }
    render() {
        return (h("div", null, h("button", { id: "add-data-point", onClick: this.addDataPoint }, "Add Data Point"), h("div", { id: "chart-container", style: { height: '500px', width: '500px', marginTop: '20px' } }, h("sc-status-chart", { widgetId: "widget-id", alarms: { expires: MONTH_IN_MS }, dataStreams: [
                {
                    id: 'test',
                    color: 'red',
                    name: 'test stream',
                    aggregates: { [MONTH_IN_MS]: this.data },
                    data: [],
                    resolution: MONTH_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], viewPort: {
                yMin: Y_MIN,
                yMax: Y_MAX,
                start: X_MIN,
                end: X_MAX,
            }, bufferFactor: 1, minBufferSize: 1 }), h("sc-webgl-context", null))));
    }
};

export { StatusChartDynamicBuffer as status_chart_dynamic_buffer };
