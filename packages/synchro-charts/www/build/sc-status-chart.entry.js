import { h, r as registerInstance } from './index-44bccbc7.js';
import { D as DATA_ALIGNMENT } from './constants-4b21170a.js';
import './dataConstants-a26ff694.js';
import './time-f374952b.js';
import './three.module-af3affdd.js';
import './predicates-ced25765.js';
import { S as STATUS_MARGIN_TOP_PX, u as updateChartScene, c as chartScene, H as HEIGHT } from './chartScene-3b908d88.js';
import './_commonjsHelpers-8f072dc7.js';
import './index-07d230d4.js';
import './v4-ea64cdd5.js';
import { i as isThreshold } from './utils-11cae6c8.js';
import './clipSpaceConversion-16977037.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import './getDistanceFromDuration-5c7da5d2.js';
import { D as DEFAULT_CHART_CONFIG } from './chartDefaults-c377c791.js';

const scStatusChartCss = "sc-status-chart .status-timeline{position:relative}sc-threahold-legend{overflow-y:scroll;overflow-x:hidden;-ms-overflow-style:none;scrollbar-width:none}sc-threshold-legend::-webkit-scrollbar{display:none}";

// The initial size of buffers. The larger this is, the more memory allocated up front per chart.
// The lower this number is, more likely that charts will have to re-initialize there buffers which is
// a slow operation (CPU bound).
const DEFAULT_MIN_BUFFER_SIZE = 1000;
const DEFAULT_BUFFER_FACTOR = 4;
const DEFAULT_MARGINS = {
    marginLeft: 10,
    marginTop: 0,
    marginBottom: DEFAULT_CHART_CONFIG.size.marginBottom,
    marginRight: 5,
};
// Fits two rows of legend rows
const THRESHOLD_LEGEND_HEIGHT_PX = 50;
const TOP_TOOLTIP_MARGIN_PX = 4;
const tooltip = (alarms) => (props) => {
    const { size } = props;
    return (h("sc-tooltip", Object.assign({}, props, { dataAlignment: DATA_ALIGNMENT.LEFT, top: -size.height + STATUS_MARGIN_TOP_PX + TOP_TOOLTIP_MARGIN_PX, sortPoints: false, maxDurationFromDate: alarms ? alarms.expires : undefined, showDataStreamColor: false, showBlankTooltipRows: true, visualizesAlarms: true, supportString: true })));
};
const ScStatusChart = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.gestures = true;
        /** Status */
        this.isEditing = false;
        /** Memory Management */
        this.bufferFactor = DEFAULT_BUFFER_FACTOR;
        this.minBufferSize = DEFAULT_MIN_BUFFER_SIZE;
        this.thresholds = () => {
            if (this.annotations == null || this.annotations.y == null) {
                return [];
            }
            return this.annotations.y.filter(isThreshold);
        };
    }
    render() {
        return (h("sc-size-provider", { size: this.size, renderFunc: (size) => {
                const totalSize = Object.assign(Object.assign(Object.assign(Object.assign({}, DEFAULT_CHART_CONFIG.size), DEFAULT_MARGINS), this.size), size);
                const chartHeight = totalSize.height - THRESHOLD_LEGEND_HEIGHT_PX;
                const chartSize = Object.assign(Object.assign({}, totalSize), { height: chartHeight });
                return [
                    h("div", { class: "status-timeline", style: { height: `${chartSize.height}px` } }, h("sc-webgl-base-chart", { axis: Object.assign(Object.assign({}, this.axis), { showY: false }), gestures: this.gestures, configId: this.widgetId, requestData: this.requestData, annotations: Object.assign(Object.assign({}, this.annotations), { show: false, thresholdOptions: {
                                showColor: true,
                            } }), updateChartScene: updateChartScene, createChartScene: chartScene, size: chartSize, dataStreams: this.dataStreams, alarms: this.alarms, viewPort: Object.assign(Object.assign({}, this.viewPort), { yMin: 0, yMax: HEIGHT }), minBufferSize: this.minBufferSize, bufferFactor: this.bufferFactor, isEditing: this.isEditing, tooltip: tooltip(this.alarms), displaysError: false, supportString: true, visualizesAlarms: true, displaysNoDataPresentMsg: false, messageOverrides: this.messageOverrides }), h("sc-status-timeline-overlay", { isEditing: this.isEditing, thresholds: this.thresholds(), date: this.viewPort.end || new Date(), dataStreams: this.dataStreams, size: chartSize, widgetId: this.widgetId })),
                    h("div", { class: "threshold-legend-container", style: { maxHeight: `${THRESHOLD_LEGEND_HEIGHT_PX}px` } }, h("sc-threshold-legend", { thresholds: this.thresholds() })),
                ];
            } }));
    }
};
ScStatusChart.style = scStatusChartCss;

export { ScStatusChart as sc_status_chart };
