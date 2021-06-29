import { r as registerInstance, h } from './index-44bccbc7.js';

const scGridCss = "sc-grid .grid{--widget-min-width:190px;--widget-min-height:100px;display:grid;grid-template-columns:repeat(auto-fit, minmax(var(--widget-min-width), 1fr));grid-auto-rows:minmax(var(--widget-min-height), 1fr);grid-gap:10px;margin:10px}sc-grid .grid-wrapper{display:flex;flex-direction:column;justify-content:center;align-content:center}";

const ScGrid = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", { class: "grid-wrapper" }, h("div", { class: "grid" }, h("slot", null))));
    }
};
ScGrid.style = scGridCss;

export { ScGrid as sc_grid };
