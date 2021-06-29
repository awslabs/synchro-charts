import { r as registerInstance, h } from './index-44bccbc7.js';

const DEFAULT_SIZE = {
    width: 500,
    height: 600,
};
const SHIFT_X_DIFF = 50;

const ScSizeProviderStandard = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.marginLeft = 0;
        this.onShiftRight = () => {
            this.marginLeft += SHIFT_X_DIFF;
        };
    }
    render() {
        return (h("div", { style: { width: '2000px', height: '2000px' } }, h("div", null, h("button", { id: "shift-right", onClick: this.onShiftRight }, "Shift Right")), h("div", { id: "container", style: {
                marginLeft: `${this.marginLeft}px`,
                height: `${DEFAULT_SIZE.height}px`,
                width: `${DEFAULT_SIZE.width}px`,
            } }, h("sc-size-provider", { renderFunc: size => h("sc-box", { someObject: size, size: size }) }))));
    }
};

export { ScSizeProviderStandard as sc_size_provider_standard };
