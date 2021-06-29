import { r as registerInstance, h, e as Host } from './index-44bccbc7.js';
import './terms-d11f73d5.js';
import './number-0c56420d.js';
import { V as Value } from './Value-c253e0f4.js';
import { T as TREND_ICON_DASH_ARRAY, S as STREAM_ICON_STROKE_LINECAP, a as STREAM_ICON_STROKE_WIDTH, b as STREAM_ICON_PATH_COMMAND } from './dataTypes-d941f108.js';

const DEFAULT_LEGEND_TEXT_COLOR = '#000';

const scLegendRowCss = "sc-legend-row{--color-container-width:18px;overflow:hidden;display:inline-block;margin-right:var(--margin-small);color:var(--secondary-font-color);padding-right:var(--margin-small)}sc-legend-row .legend-row-container{display:flex}sc-legend-row .legend-value{position:relative;display:flex;align-items:center}sc-legend-row .color-container{display:flex;flex-direction:column-reverse;width:var(--color-container-width);height:20px;padding-top:11px}sc-data-stream-info .spinner-container{position:relative;top:5px}sc-legend-row .bar{width:var(--color-container-width)}sc-legend-row .info{padding-left:var(--margin-small);display:flex;flex-direction:column}sc-legend-row .info h4{line-height:0.2em;font-size:14px}sc-legend-row .sc-expandable-input{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}";

// Styling to control the height of the gap between the stream-name and the unit
const EDIT_MODE_STYLE = {
    top: '-2px',
};
const VIEW_MODE_STYLE = {
    top: '-8px',
};
const ScLegendRow = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.valueColor = DEFAULT_LEGEND_TEXT_COLOR;
        this.updateName = (name) => {
            this.updateDataStreamName({
                streamId: this.streamId,
                name,
            });
        };
    }
    render() {
        const isTrendPoint = this.pointType && this.pointType === "trend" /* TREND */;
        return (h(Host, null, h("div", { class: "legend-row-container awsui" }, this.showDataStreamColor && (h("div", { class: "color-container" }, this.isLoading ? (h("div", { class: "spinner-container" }, h("sc-loading-spinner", { dark: true, size: 12 }))) : (h("svg", { class: "bar", "data-testid": `legend-icon-${this.pointType}` }, h("path", { stroke: this.color, "stroke-dasharray": isTrendPoint ? TREND_ICON_DASH_ARRAY : '', "stroke-linecap": STREAM_ICON_STROKE_LINECAP, "stroke-width": STREAM_ICON_STROKE_WIDTH, d: STREAM_ICON_PATH_COMMAND }))))), h("div", { class: "info" }, h("sc-data-stream-name", { onNameChange: this.updateName, isEditing: this.isEditing, label: this.label, detailedLabel: this.detailedLabel, pointType: this.pointType, date: this.point && new Date(this.point.x) }), h("div", { class: "legend-value", style: this.isEditing ? EDIT_MODE_STYLE : VIEW_MODE_STYLE }, this.icon && h("sc-chart-icon", { name: this.icon }), h("h4", { class: "awsui-util-d-i", "data-testid": "current-value", style: { color: this.valueColor } }, h(Value, { value: this.point ? this.point.y : undefined })), this.unit && h("small", null, "\u00A0", this.unit))))));
    }
};
ScLegendRow.style = scLegendRowCss;

export { ScLegendRow as sc_legend_row };
