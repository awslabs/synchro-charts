import { S as ScaleType, L as LEGEND_POSITION } from './constants-4b21170a.js';

const DEFAULT_BASE_CONFIG = {
    widgetId: 'fake-id',
    viewPort: {
        start: new Date(1995, 0, 0, 0),
        end: new Date(2020, 1, 0, 0),
        yMin: 0,
        yMax: 10000,
    },
    // width is width - marginLeft - marginRight
    size: { width: 400 + 50 + 40, height: 350, marginLeft: 50, marginRight: 40, marginTop: 8, marginBottom: 30 },
};
const DEFAULT_CHART_CONFIG = {
    widgetId: 'fake-id',
    viewPort: {
        start: new Date(1995, 0, 0, 0),
        end: new Date(2020, 1, 0, 0),
        yMin: 0,
        yMax: 10000,
    },
    // width is width - marginLeft - marginRight
    size: { width: 400 + 50 + 25, height: 350, marginLeft: 50, marginRight: 40, marginTop: 24, marginBottom: 30 },
    movement: {
        enableXScroll: true,
        enableYScroll: false,
        zoomMax: Infinity,
        zoomMin: 0.00001,
    },
    layout: {
        xGridVisible: false,
        yGridVisible: true,
        xTicksVisible: true,
        yTicksVisible: true,
    },
    scale: {
        xScaleType: ScaleType.TimeSeries,
        yScaleType: ScaleType.Linear,
        xScaleSide: 'bottom',
        yScaleSide: 'left',
    },
    dataStreams: [],
    legend: {
        position: LEGEND_POSITION.BOTTOM,
        width: 170,
    },
};
const DEFAULT_THRESHOLD_OPTIONS = {
    showColor: true,
};
const DEFAULT_THRESHOLD_OPTIONS_OFF = {
    showColor: false,
};

export { DEFAULT_CHART_CONFIG as D, DEFAULT_THRESHOLD_OPTIONS as a, DEFAULT_THRESHOLD_OPTIONS_OFF as b };
