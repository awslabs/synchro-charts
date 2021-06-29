import { r as registerInstance, h } from './index-44bccbc7.js';

const VIEW_PORT_GROUP = 'some-group';
const NARROW_VIEWPORT = {
    start: new Date(2000, 0, 0),
    end: new Date(2000, 0, 1),
    group: VIEW_PORT_GROUP,
};
const WIDE_VIEWPORT = {
    start: new Date(2000, 0, 0),
    end: new Date(2001, 0, 0),
    group: VIEW_PORT_GROUP,
};
const LineChartViewportChange = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.viewPort = NARROW_VIEWPORT;
        this.toggleViewPort = () => {
            this.viewPort = this.viewPort !== NARROW_VIEWPORT ? NARROW_VIEWPORT : WIDE_VIEWPORT;
        };
    }
    render() {
        return (h("div", null, h("button", { id: "toggle-view-port", onClick: this.toggleViewPort }, "use ", this.viewPort === NARROW_VIEWPORT ? 'wide' : 'narrow', " viewport"), h("br", null), h("br", null), h("div", { id: "chart-container", style: { marginTop: '20px', width: '500px', height: '500px' } }, h("sc-line-chart", { widgetId: "widget-id", dataStreams: [], viewPort: this.viewPort })), h("sc-webgl-context", null)));
    }
};

export { LineChartViewportChange as line_chart_viewport_change };
