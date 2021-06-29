import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DataType, T as TREND_TYPE } from './dataConstants-a26ff694.js';

// viewport boundaries
const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const Y_MIN = 0;
const Y_MAX = 5000;
const TEST_DATA_POINTS_1 = [
    {
        x: new Date((3 * X_MIN.getTime() + X_MAX.getTime()) / 4).getTime(),
        y: 2500,
    },
    {
        x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
        y: 1000,
    },
    {
        x: new Date((X_MIN.getTime() + 3 * X_MAX.getTime()) / 4).getTime(),
        y: 4500,
    },
];
const TEST_DATA_POINTS_2 = [
    {
        x: new Date((3 * X_MIN.getTime() + X_MAX.getTime()) / 4).getTime(),
        y: 2000,
    },
    {
        x: new Date((X_MIN.getTime() + X_MAX.getTime()) / 2).getTime(),
        y: 2500,
    },
    {
        x: new Date((X_MIN.getTime() + 3 * X_MAX.getTime()) / 4).getTime(),
        y: 1500,
    },
];
const ScScatterChartTooltipWithMultipleDataStreamsAndTrends = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-scatter-chart", { dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream 1',
                    data: TEST_DATA_POINTS_1,
                    resolution: 0,
                    dataType: DataType.NUMBER,
                },
                {
                    id: 'test2',
                    color: 'red',
                    name: 'test stream 2',
                    data: TEST_DATA_POINTS_2,
                    resolution: 0,
                    dataType: DataType.NUMBER,
                },
            ], widgetId: "widget-id", size: {
                height: 500,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }, trends: [
                {
                    type: TREND_TYPE.LINEAR,
                    dataStreamId: 'test',
                },
                {
                    type: TREND_TYPE.LINEAR,
                    dataStreamId: 'test2',
                },
            ] }), h("sc-webgl-context", null)));
    }
};

export { ScScatterChartTooltipWithMultipleDataStreamsAndTrends as sc_scatter_chart_tooltip_with_multiple_data_streams_and_trends };
