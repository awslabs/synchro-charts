import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';

const X_MIN = new Date(2000, 0, 0, 0, 0);
const X_MAX = new Date(2000, 0, 0, 0, 10);
const ScWebglBarChartStartFromZero = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.testData = [
            {
                x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
                y: 4500,
            },
        ];
        this.changeDataDirection = () => {
            this.testData = this.testData.map(({ x, y }) => {
                return {
                    x,
                    y: -y,
                };
            });
        };
    }
    render() {
        return (h("div", null, h("button", { id: "change-data-direction", onClick: this.changeDataDirection }, "Change Data Direction"), h("br", null), h("br", null), h("div", { id: "chart-container", style: { width: '500px', height: '500px' } }, h("sc-bar-chart", { dataStreams: [
                {
                    id: 'test',
                    color: 'purple',
                    name: 'test stream',
                    data: [],
                    aggregates: {
                        [MINUTE_IN_MS]: this.testData,
                    },
                    resolution: MINUTE_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], widgetId: "test-id", size: {
                width: 500,
                height: 500,
            }, viewPort: { start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null))));
    }
};

export { ScWebglBarChartStartFromZero as sc_webgl_bar_chart_start_from_zero };
