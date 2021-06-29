import { r as registerInstance, h } from './index-44bccbc7.js';

const scWebglAxisCss = "sc-webgl-axis{font-size:var(--font-size-0)}sc-webgl-axis .axis{font-family:var(--primary-font-family);shape-rendering:crispEdges;position:absolute;overflow:hidden;user-select:none;pointer-events:none}sc-webgl-axis .axis path{display:none}sc-webgl-axis .axis .tick{color:var(--polaris-light-gray)}sc-webgl-axis line.x-axis-separator{color:var(--primary-light);stroke:var(--primary-light);stroke-width:1px}sc-webgl-axis .axis .tick line{color:var(--primary-light)}sc-webgl-axis .axis .tick text{font-size:var(--font-size-0);user-select:none}sc-webgl-axis .x-axis .tick:last-child text{font-weight:var(--font-weight-bold)}";

const ScWebglAxis = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const { width, height, marginLeft, marginRight, marginTop, marginBottom } = this.size;
        return (h("svg", { class: "axis", style: {
                width: `${width + marginLeft + marginRight}px`,
                height: `${height + marginBottom + marginTop}px`,
            } }));
    }
};
ScWebglAxis.style = scWebglAxisCss;

export { ScWebglAxis as sc_webgl_axis };
