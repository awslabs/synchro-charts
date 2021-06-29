import { r as registerInstance, h } from './index-44bccbc7.js';

const ScThresholdLegendRow = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", null, h("div", { class: "box", style: { backgroundColor: this.color } }), " ", this.label));
    }
};

export { ScThresholdLegendRow as sc_threshold_legend_row };
