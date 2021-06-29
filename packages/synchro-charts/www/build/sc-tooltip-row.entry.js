import { r as registerInstance, h } from './index-44bccbc7.js';
import './terms-d11f73d5.js';
import './time-f374952b.js';
import './_commonjsHelpers-8f072dc7.js';
import './number-0c56420d.js';
import { V as Value } from './Value-c253e0f4.js';
import { T as TREND_ICON_DASH_ARRAY, S as STREAM_ICON_STROKE_LINECAP, a as STREAM_ICON_STROKE_WIDTH, b as STREAM_ICON_PATH_COMMAND } from './dataTypes-d941f108.js';
import { g as getAggregationFrequency } from './helper-9441cc0b.js';

const scTooltipRowCss = "sc-tooltip-row{--bar-size:18px}sc-tooltip-rows .left-offset{padding-left:4px}sc-tooltip-row .clearfix::after{content:'';clear:both;display:table}sc-tooltip-row .bar{display:inline-block;float:left;width:var(--bar-size);height:20px;padding-top:8px}sc-tooltip-row .label{padding-left:var(--margin-small);color:var(--light-text);float:left}sc-tooltip-row .value{font-weight:bold;float:right;margin-left:15px}";

const baseColor = '#000';
const AGGREGATED_LEVEL = 'average';
const ScTooltipRow = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.valueColor = baseColor;
    }
    render() {
        const isTrendPoint = this.pointType === "trend" /* TREND */;
        return (h("div", { class: "clearfix" }, this.showDataStreamColor && (h("span", { class: "awsui-util-mr-xs" }, h("svg", { class: "bar", "data-testid": `tooltip-icon-${this.pointType}` }, h("path", { stroke: this.color, "stroke-dasharray": isTrendPoint ? TREND_ICON_DASH_ARRAY : undefined, "stroke-linecap": STREAM_ICON_STROKE_LINECAP, "stroke-width": STREAM_ICON_STROKE_WIDTH, d: STREAM_ICON_PATH_COMMAND })))), h("span", { class: "label awsui-util-d-i", "data-testid": "tooltip-row-label" }, this.label), h("span", { class: "value awsui-util-d-i", "data-testid": "current-value", style: { color: this.valueColor } }, this.icon && h("sc-chart-icon", { name: this.icon }), h(Value, { value: this.point && this.point.y })), this.resolution != null && (h("div", { class: "awsui-util-pb-s" }, h("small", null, getAggregationFrequency(this.resolution, AGGREGATED_LEVEL))))));
    }
};
ScTooltipRow.style = scTooltipRowCss;

export { ScTooltipRow as sc_tooltip_row };
