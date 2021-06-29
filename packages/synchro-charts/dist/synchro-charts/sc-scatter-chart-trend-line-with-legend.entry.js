import { r as registerInstance, h } from './index-44bccbc7.js';
import { L as LEGEND_POSITION } from './constants-4b21170a.js';
import { D as DataType, T as TREND_TYPE } from './dataConstants-a26ff694.js';
import { S as SECOND_IN_MS } from './time-f374952b.js';

// viewport boundaries
const X_MIN = new Date(2018, 0, 0);
const X_MAX = new Date(2020, 0, 0);
const Y_MIN = 0;
const Y_MAX = 5000;
// test data point dead center of the viewport
const TEST_DATA_POINTS = [
    {
        x: new Date(2018, 6, 0).getTime(),
        y: 1000,
    },
    {
        x: new Date(2019, 0, 0).getTime(),
        y: 4000,
    },
    {
        x: new Date(2019, 6, 0).getTime(),
        y: 3000,
    },
];
const ScScatterChartTrendLineWithLegend = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-line-chart", { widgetId: "widget-id", dataStreams: [
                {
                    id: 'test',
                    color: 'black',
                    name: 'test stream',
                    aggregates: { [SECOND_IN_MS]: TEST_DATA_POINTS },
                    data: [],
                    resolution: SECOND_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ], size: {
                height: 500,
                width: 500,
            }, viewPort: {
                start: X_MIN,
                end: X_MAX,
                yMin: Y_MIN,
                yMax: Y_MAX,
            }, legend: {
                position: LEGEND_POSITION.BOTTOM,
                width: 300,
            }, trends: [
                {
                    dataStreamId: 'test',
                    type: TREND_TYPE.LINEAR,
                },
            ] }), h("sc-webgl-context", null)));
    }
};

export { ScScatterChartTrendLineWithLegend as sc_scatter_chart_trend_line_with_legend };
