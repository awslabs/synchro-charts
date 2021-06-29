import { r as registerInstance, h, g as getElement } from './index-44bccbc7.js';
import './terms-d11f73d5.js';
import './number-0c56420d.js';
import { V as Value } from './Value-c253e0f4.js';
import { t as tippy, T as TIPPY_SETTINGS } from './toolTipSettings-1d33e549.js';

const ScGridTooltip = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.displayToolTip = () => {
            const container = this.el.querySelector('.tooltip-container');
            const tooltip = this.el.querySelector('.cell-tooltip');
            if (tooltip != null && container != null) {
                tooltip.style.display = 'block';
                this.tooltip = tippy(container, Object.assign(Object.assign({}, TIPPY_SETTINGS), { placement: 'left', content: tooltip }));
            }
        };
    }
    componentDidLoad() {
        this.displayToolTip();
    }
    disconnectedCallback() {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
    }
    render() {
        const thereIsSomeData = this.propertyPoint != null || this.alarmPoint != null;
        const color = this.breachedThreshold ? this.breachedThreshold.color : undefined;
        const displaysMoreThanTitle = thereIsSomeData && this.isEnabled;
        return (h("div", { onMouseOver: this.displayToolTip, onFocus: this.displayToolTip, class: "tooltip-container" }, h("div", { class: "cell-tooltip awsui-util-container awsui", style: { display: 'none' } }, h("div", { class: { 'awsui-util-container-header': true, 'awsui-util-mb-m': displaysMoreThanTitle } }, h("h3", null, this.title)), displaysMoreThanTitle && (h("div", null, h("div", { class: "awsui-util-spacing-v-s" }, this.propertyPoint && (h("div", null, h("div", { class: "awsui-util-label" }, "Latest value:"), h("div", null, h("strong", { style: { color } }, h(Value, { value: this.propertyPoint.y })), ' ', "at", ' ', new Date(this.propertyPoint.x).toLocaleString('en-US', {
            hour12: true,
            minute: 'numeric',
            hour: 'numeric',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        })))), this.alarmPoint && (h("div", null, h("div", { class: "awsui-util-label" }, "Status:"), h("div", null, h("strong", { style: { color } }, this.alarmPoint.y), " since", ' ', new Date(this.alarmPoint.x).toLocaleString('en-US', {
            hour12: true,
            minute: 'numeric',
            hour: 'numeric',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }), this.breachedThreshold && this.breachedThreshold.description && (h("div", null, "(", this.breachedThreshold.description, ")"))))))))), h("slot", null)));
    }
    get el() { return getElement(this); }
};

export { ScGridTooltip as sc_grid_tooltip };
