import { r as registerInstance, h, e as Host } from './index-44bccbc7.js';

const ScExpandableInputStandard = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = '';
    }
    render() {
        return (h(Host, null, h("sc-expandable-input", { onValueChange: (value) => {
                this.value = value;
            }, value: "" }), h("br", null), h("span", { id: "input-value" }, this.value)));
    }
};

export { ScExpandableInputStandard as sc_expandable_input_standard };
