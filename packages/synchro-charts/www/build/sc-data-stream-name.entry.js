import { r as registerInstance, h, g as getElement } from './index-44bccbc7.js';
import { t as tippy, T as TIPPY_SETTINGS } from './toolTipSettings-1d33e549.js';

const scDataStreamNameCss = "sc-data-stream-name{color:var(--polaris-gray-900)}sc-data-stream-name .awsui{color:inherit}";

const ScDataStreamName = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.displayTooltip = true;
        this.renderTooltip = () => {
            if (this.displayTooltip) {
                const container = this.el.querySelector('sc-expandable-input');
                const tooltip = this.el.querySelector('.data-stream-name-tooltip');
                if (tooltip != null && container != null) {
                    tooltip.style.display = 'block';
                    this.tooltip = tippy(container, Object.assign(Object.assign({}, TIPPY_SETTINGS), { content: tooltip }));
                }
            }
        };
    }
    disconnectedCallback() {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
    }
    render() {
        return (h("div", { class: "awsui" }, h("sc-expandable-input", { isDisabled: !this.isEditing, onValueChange: (value) => {
                this.onNameChange(value);
            }, onMouseOver: this.renderTooltip, onFocus: this.renderTooltip, value: this.label }), h("div", { class: "data-stream-name-tooltip awsui-util-container awsui", style: { display: 'none' } }, h("div", { class: "awsui-util-spacing-v-s" }, h("div", null, h("div", { class: "awsui-util-label" }, this.detailedLabel || this.label), this.pointType && this.pointType === "trend" /* TREND */ && (h("small", null, "This trend line is computed from only visible data."))), this.date && (h("div", null, h("div", { class: "awsui-util-label" }, "Latest value at"), h("div", null, this.date.toLocaleString('en-US', {
            hour12: true,
            minute: 'numeric',
            hour: 'numeric',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }))))))));
    }
    get el() { return getElement(this); }
};
ScDataStreamName.style = scDataStreamNameCss;

export { ScDataStreamName as sc_data_stream_name };
