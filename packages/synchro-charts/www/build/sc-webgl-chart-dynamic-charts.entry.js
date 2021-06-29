import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import './_commonjsHelpers-8f072dc7.js';
import { v as v4_1 } from './v4-ea64cdd5.js';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
// test data point dead center of the viewport
const TEST_DATA_POINT = {
    x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
    y: (Y_MIN + Y_MAX) / 20,
};
const createData = (point, numPoints) => new Array(numPoints).fill(0).map((_, i) => ({
    x: point.x,
    y: point.y + ((Y_MAX - Y_MIN) / 20) * i,
}));
/**
 * Tests behavior with dynamically adding/removing a chart.
 */
let numPointCounter = 1;
const ScWebglChartStandard = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.chartKeys = [];
        this.width = 500;
        this.xOffset = 0;
        this.shiftLeft = () => {
            this.xOffset -= 100;
        };
        this.shiftRight = () => {
            this.xOffset += 100;
        };
        this.increaseWidth = () => {
            this.width += 100;
        };
        this.decreaseWidth = () => {
            if (this.width > 100) {
                this.width -= 100;
            }
        };
        this.addChartAtFront = () => {
            const key = v4_1();
            this.chartKeys = [
                {
                    key,
                    data: [
                        {
                            id: key,
                            color: 'black',
                            name: 'test stream',
                            data: createData(TEST_DATA_POINT, numPointCounter),
                            resolution: 0,
                            dataType: DataType.NUMBER,
                        },
                    ],
                },
                ...this.chartKeys,
            ];
            numPointCounter += 1;
        };
        this.addChartAtBack = () => {
            const key = v4_1();
            this.chartKeys = [
                ...this.chartKeys,
                {
                    key,
                    data: [
                        {
                            id: key,
                            color: 'black',
                            name: 'test stream',
                            data: createData(TEST_DATA_POINT, numPointCounter),
                            resolution: 0,
                            dataType: DataType.NUMBER,
                        },
                    ],
                },
            ];
            numPointCounter += 1;
        };
        this.removeFrontChart = () => {
            if (this.chartKeys.length > 0) {
                this.chartKeys = this.chartKeys.slice(1);
            }
        };
        this.removeBackChart = () => {
            if (this.chartKeys.length > 0) {
                this.chartKeys = this.chartKeys.slice(0, -1);
            }
        };
    }
    render() {
        return (h("div", null, h("button", { id: "shift-right", onClick: this.shiftRight }, "Shift Right"), h("button", { id: "shift-left", onClick: this.shiftLeft }, "Shift Left"), h("button", { id: "increase-width", onClick: this.increaseWidth }, "Increase Width"), h("button", { id: "decrease-width", onClick: this.decreaseWidth }, "Decrease Width"), h("button", { id: "add-chart-to-front", onClick: this.addChartAtFront }, "Add Chart To Front"), h("button", { id: "add-chart-to-back", onClick: this.addChartAtBack }, "Add Chart To Back"), h("button", { id: "remove-chart-from-back", onClick: this.removeBackChart }, "Remove Chart From Back"), h("button", { id: "remove-chart-from-front", onClick: this.removeFrontChart }, "Remove Chart From Front"), h("hr", null), this.chartKeys.map(({ key, data }) => (h("div", { key: key, style: { marginLeft: `${this.xOffset}px`, width: `${this.width}px`, height: '500px' } }, h("sc-line-chart", { dataStreams: data, widgetId: key, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX } })))), h("sc-webgl-context", null)));
    }
};

export { ScWebglChartStandard as sc_webgl_chart_dynamic_charts };
