import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
/**
 * Tests the scenario where a chart is updated to contain more data than the initialized buffers size.
 * The buffers should resize, resulting in the additional points being rendered onto the chart.
 */
const WIDTH = X_MAX.getTime() - X_MIN.getTime();
const ScWebglLineChartDynamicBuffer = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.data = [];
        this.addDataPoint = () => {
            const dataPoint = {
                x: new Date(X_MIN.getTime() + WIDTH / (2 + this.data.length)).getTime(),
                y: 2500,
            };
            this.data = [dataPoint, ...this.data];
        };
    }
    render() {
        return (h("div", null, h("button", { id: "add-data-point", onClick: this.addDataPoint }, "Add Data Point"), h("div", { id: "chart-container", style: { marginTop: '20px', width: '500px', height: '500px' } }, h("sc-line-chart", { widgetId: "widget-id", dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    data: this.data,
                    resolution: 0,
                    dataType: DataType.NUMBER,
                },
            ], size: {
                height: 500,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }, bufferFactor: 1, minBufferSize: 1 }), h("sc-webgl-context", null))));
    }
};

export { ScWebglLineChartDynamicBuffer as sc_webgl_line_chart_dynamic_buffer };
