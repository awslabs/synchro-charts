import { h, r as registerInstance } from './index-44bccbc7.js';
import { D as DATA_ALIGNMENT } from './constants-4b21170a.js';
import './dataConstants-a26ff694.js';
import './time-f374952b.js';
import './three.module-af3affdd.js';
import './predicates-ced25765.js';
import './_commonjsHelpers-8f072dc7.js';
import './index-07d230d4.js';
import './v4-ea64cdd5.js';
import './utils-11cae6c8.js';
import './clipSpaceConversion-16977037.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import './getDistanceFromDuration-5c7da5d2.js';
import { u as updateChartScene, c as chartScene } from './chartScene-fa215709.js';
import { D as DEFAULT_CHART_CONFIG } from './chartDefaults-c377c791.js';

// The initial size of buffers. The larger this is, the more memory allocated up front per chart.
// The lower this number is, more likely that charts will have to re-initialize there buffers which is
// a slow operation (CPU bound).
const DEFAULT_MIN_BUFFER_SIZE = 1000;
const DEFAULT_BUFFER_FACTOR = 2;
const tooltip = (props) => (h("sc-tooltip", Object.assign({}, props, { visualizesAlarms: false, supportString: false, dataAlignment: DATA_ALIGNMENT.EITHER })));
const ScBarChart = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.gestures = true;
        /** Status */
        this.isEditing = false;
        /** Memory Management */
        this.bufferFactor = DEFAULT_BUFFER_FACTOR;
        this.minBufferSize = DEFAULT_MIN_BUFFER_SIZE;
    }
    render() {
        return (h("sc-size-provider", { size: this.size, renderFunc: (size) => (h("sc-webgl-base-chart", { axis: this.axis, gestures: this.gestures, configId: this.widgetId, requestData: this.requestData, legend: this.legend, annotations: this.annotations, trends: this.trends, updateChartScene: updateChartScene, createChartScene: chartScene, size: Object.assign(Object.assign(Object.assign({}, DEFAULT_CHART_CONFIG.size), this.size), size), dataStreams: this.dataStreams, alarms: this.alarms, viewPort: this.viewPort, minBufferSize: this.minBufferSize, bufferFactor: this.bufferFactor, isEditing: this.isEditing, yRangeStartFromZero: true, tooltip: tooltip, supportString: false, visualizesAlarms: false, messageOverrides: this.messageOverrides })) }));
    }
};

export { ScBarChart as sc_bar_chart };
