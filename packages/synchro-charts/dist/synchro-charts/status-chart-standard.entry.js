import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';
import { T as TEST_DATA_POINT_STANDARD, a as Y_MIN, b as Y_MAX, X as X_MIN, c as X_MAX } from './constants-c07a73c8.js';

const StatusChartStandard = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-status-chart", { alarms: { expires: MINUTE_IN_MS }, dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    data: [Object.assign(Object.assign({}, TEST_DATA_POINT_STANDARD), { y: 70 })],
                    resolution: 0,
                    dataType: DataType.NUMBER,
                },
            ], widgetId: "test-id", size: {
                width: 500,
                height: 500,
            }, viewPort: { yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null)));
    }
};

export { StatusChartStandard as status_chart_standard };
