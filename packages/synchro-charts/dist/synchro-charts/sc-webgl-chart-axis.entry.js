import { r as registerInstance, h } from './index-44bccbc7.js';
import { X as X_MIN, c as X_MAX, a as Y_MIN, b as Y_MAX } from './constants-c07a73c8.js';

const ScWebglChartAnnotations = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-line-chart", { widgetId: "widget-id", dataStreams: [], axis: {
                showX: false,
                showY: false,
            }, size: {
                height: 500,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX } }), h("sc-webgl-context", null)));
    }
};

export { ScWebglChartAnnotations as sc_webgl_chart_axis };
