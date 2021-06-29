import { r as registerInstance, h } from './index-44bccbc7.js';
import './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import './terms-d11f73d5.js';
import './index.esm.js';
import { M as MINUTE_IN_MS } from './time-f374952b.js';
import { T as TEST_DATA_POINT_STANDARD, a as Y_MIN, b as Y_MAX, X as X_MIN, c as X_MAX } from './constants-c07a73c8.js';

const StatusChartMultipleDataStreams = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-status-chart", { alarms: { expires: MINUTE_IN_MS }, dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream 1',
                    aggregates: { [MINUTE_IN_MS]: [Object.assign(Object.assign({}, TEST_DATA_POINT_STANDARD), { y: 70 })] },
                    data: [],
                    resolution: MINUTE_IN_MS,
                    dataType: DataType.NUMBER,
                },
                {
                    id: 'test2',
                    color: 'blue',
                    name: 'test stream 2',
                    aggregates: { [MINUTE_IN_MS]: [Object.assign(Object.assign({}, TEST_DATA_POINT_STANDARD), { y: 170 })] },
                    data: [],
                    resolution: MINUTE_IN_MS,
                    dataType: DataType.NUMBER,
                },
                {
                    id: 'test3',
                    color: 'red',
                    name: 'test stream 3',
                    aggregates: { [MINUTE_IN_MS]: [Object.assign(Object.assign({}, TEST_DATA_POINT_STANDARD), { y: 60 })] },
                    data: [],
                    resolution: MINUTE_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], widgetId: "test-id", size: {
                width: 500,
                height: 500,
            }, viewPort: { yMin: Y_MIN, yMax: Y_MAX, start: X_MIN, end: X_MAX } }), h("sc-webgl-context", null)));
    }
};

export { StatusChartMultipleDataStreams as status_chart_multiple_data_streams };
