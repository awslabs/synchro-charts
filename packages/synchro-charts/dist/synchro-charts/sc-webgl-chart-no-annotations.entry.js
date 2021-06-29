import { r as registerInstance, h } from './index-44bccbc7.js';
import { X as X_MIN, a as Y_MIN, c as X_MAX, b as Y_MAX } from './constants-c07a73c8.js';

const ScWebglChartNoAnnotations = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("sc-line-chart", { widgetId: "widget-id", dataStreams: [], annotations: {
                x: [
                    {
                        value: X_MIN,
                        label: {
                            text: 'x label',
                            show: true,
                        },
                        showValue: true,
                        color: 'red',
                    },
                ],
                y: [
                    {
                        value: Y_MIN,
                        label: {
                            text: 'y label',
                            show: true,
                        },
                        showValue: true,
                        color: 'blue',
                    },
                ],
                show: false,
            }, size: {
                height: 500,
                width: 500,
            }, viewPort: { start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX } }), h("sc-webgl-context", null)));
    }
};

export { ScWebglChartNoAnnotations as sc_webgl_chart_no_annotations };
