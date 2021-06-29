import { r as registerInstance, h } from './index-44bccbc7.js';
import './terms-d11f73d5.js';
import './number-0c56420d.js';
import { V as Value } from './Value-c253e0f4.js';

const scStatusTimelineOverlayRowCss = ":root{--timeline-row-margin-top:34px}sc-status-timeline-overlay-row{flex-grow:1;width:100%;display:flex;flex-direction:column;justify-content:space-between}sc-status-timeline-overlay-row sc-data-stream-name{max-height:var(--timeline-row-margin-top);overflow:hidden}sc-status-timeline-overlay-row .value{max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-bottom:2px}sc-status-timeline-overlay-row .unit{padding-left:2px}sc-status-timeline-overlay-row .stream-info{text-overflow:ellipsis;overflow:hidden;height:var(--timeline-row-margin-top);display:flex;font-size:14px;padding:0.1em;align-items:flex-end}sc-status-timeline-overlay-row .no-data-visualization{flex-grow:1;background:repeating-linear-gradient(45deg, #efefef, #efefef 10px, #acacac 10px, #acacac 20px)}";

const ScStatusTimelineOverlayRow = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return [
            h("div", { class: "stream-info" }, h("sc-data-stream-name", { label: this.label, detailedLabel: this.detailedLabel, onNameChange: this.onNameChange, isEditing: this.isEditing }), h("div", { class: "expando" }), h("span", { class: "value", style: { color: this.valueColor || 'unset', display: 'flex', alignItems: 'center' } }, this.icon && h("sc-chart-icon", { name: this.icon }), h(Value, { value: this.value, unit: this.unit }))),
            h("div", { class: "no-data-visualization" }),
        ];
    }
};
ScStatusTimelineOverlayRow.style = scStatusTimelineOverlayRowCss;

export { ScStatusTimelineOverlayRow as sc_status_timeline_overlay_row };
