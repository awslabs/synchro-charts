import { h, r as registerInstance } from './index-44bccbc7.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import './terms-d11f73d5.js';
import './number-0c56420d.js';
import { V as Value } from './Value-c253e0f4.js';

const Arrow = () => (h("svg", { viewBox: "0 0 24 24" },
    h("path", { d: "M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" })));

const getStreamDirection = (curr, prev) => {
    if (curr == null || prev == null) {
        return "None" /* None */;
    }
    if (curr === prev) {
        return "Flat" /* Flat */;
    }
    return curr > prev ? "Up" /* Up */ : "Down" /* Down */;
};
const computePercentage = (prevValue, currValue) => {
    if (currValue === prevValue) {
        return '0%';
    }
    if (prevValue === 0) {
        // Do not percentage if 'infinite' change
        return undefined;
    }
    const decimal = currValue / prevValue;
    const percentage = ((decimal - 1) * 100).toFixed(1);
    const absoluteValue = parseFloat(percentage) > 0 ? percentage : parseFloat(percentage) * -1;
    return `${absoluteValue}%`;
};
const Trend = ({ previousPoint: { y: prevY }, latestPoint: { y: latestY }, miniVersion, }) => {
    const direction = getStreamDirection(latestY, prevY);
    const classes = {
        trend: true,
        large: !miniVersion,
        down: direction === "Down" /* Down */,
        flat: direction === "Flat" /* Flat */,
        up: direction === "Up" /* Up */,
    };
    return (h("div", { class: classes },
        h("div", { class: "data" },
            h("div", { class: "direction" },
                h(Arrow, null)),
            h("div", { "data-testid": "previous-value", class: "value" }, computePercentage(prevY, latestY))),
        !miniVersion && h("div", { class: "trend-description" }, "from previous value")));
};

const scKpiBaseCss = "@keyframes fadeIn{from{opacity:0}to{opacity:1}}sc-kpi-base{font-size:var(--font-size-1);color:var(--polaris-gray-900)}sc-kpi-base sc-chart-icon{position:relative;top:-2px}sc-kpi-base .icon-container{display:flex;flex-direction:column;justify-content:center;align-content:center;height:100%}sc-kpi-base .wrapper{overflow:hidden;display:grid;grid-template-columns:36px auto;grid-template-rows:auto auto}sc-kpi-base .description{font-size:var(--font-size-1);line-height:var(--line-height-1);font-weight:var(--font-weight-light);margin-bottom:var(--margin-medium)}sc-kpi-base .trend-description{margin-left:var(--margin-small)}sc-kpi-base .main{display:flex;flex-direction:column;align-items:flex-start}sc-kpi-base sc-expandable-input .sc-expandable-input{margin:0;margin-left:var(--margin-small);font-size:var(--font-size-3);line-height:var(--line-height-3);text-overflow:ellipsis}sc-kpi-base .large .sc-expandable-input{font-size:var(--font-size-4);line-height:var(--line-height-4)}sc-kpi-base .value-wrapper{font-size:var(--font-size-6);line-height:var(--line-height-6)}sc-kpi-base .unit{color:var(--polaris-gray-900);font-size:var(--font-size-0);line-height:var(--line-height-0);padding-left:2px}sc-kpi-base .trend{display:flex;align-items:center;color:#4263a6;font-size:var(--font-size-1);line-height:var(--line-height-1)}sc-kpi-base .trend.large{font-size:var(--font-size-2);line-height:var(--line-height-2)}sc-kpi-base .trend>.data{display:flex;justify-content:center;align-items:center}sc-kpi-base .trend>.data>.direction{position:relative;width:1.5rem;height:1.5rem;margin-right:0.3125rem;transition:transform 250ms ease-out}sc-kpi-base .trend>.data>.direction svg{position:absolute;width:100%;height:100%}sc-kpi-base .trend>.data>.direction svg>path{fill:var(--visualization-sequential-blues-normal-1-0)}sc-kpi-base .trend.down>.data>.direction{transform:rotate(45deg)}sc-kpi-base .trend.up>.data>.direction{transform:rotate(-45deg)}sc-kpi-base .trend>.data>.value{position:relative;line-height:1;text-align:center}sc-kpi-base sc-loading-spinner{display:inline-block;transform:scale(0.75)}";

/** Font Colors */
// should be $color-text-form-default https://polaris.a2z.com/fundamentals/foundation/design_tokens/
const DEFAULT_FONT_COLOR = '#16191f';
// should be $color-background-control-disabled https://polaris.a2z.com/fundamentals/foundation/design_tokens/
const DISABLED_FONT_COLOR = '#d5dbdb';
const FONT_SIZE = 44;
const MINI_FONT_SIZE = 44;
const ICON_SHRINK_FACTOR = 0.7;
const ScKpiBase = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isEditing = false;
        this.isEnabled = true;
        this.isLoading = false;
        this.isRefreshing = false;
        this.getValues = () => {
            if (!this.trendStream || !this.trendStream.data.length) {
                return {
                    latestPoint: undefined,
                    previousPoint: undefined,
                };
            }
            const latestPoint = this.trendStream.data[this.trendStream.data.length - 1];
            const previousPoint = this.trendStream.data[this.trendStream.data.length - 2];
            return {
                latestPoint,
                previousPoint,
            };
        };
        /**
         * Update Name
         *
         * Given a change in the 'title' of the widget, fire off the correct data stream name change.
         */
        this.updateName = (name) => {
            if (this.propertyStream) {
                this.onChangeLabel({
                    streamId: this.propertyStream.id,
                    name,
                });
            }
            else if (this.alarmStream) {
                this.onChangeLabel({
                    streamId: this.alarmStream.id,
                    name,
                });
            }
        };
        this.fontColor = (latestPoint) => {
            if (!this.isEnabled) {
                return DISABLED_FONT_COLOR;
            }
            if (latestPoint == null) {
                return DEFAULT_FONT_COLOR;
            }
            return this.valueColor || DEFAULT_FONT_COLOR;
        };
        this.fontSize = () => (this.miniVersion ? MINI_FONT_SIZE : FONT_SIZE);
        this.iconSize = () => this.fontSize() * ICON_SHRINK_FACTOR;
    }
    render() {
        const { latestPoint, previousPoint } = this.getValues();
        const shouldShowTrends = this.isEnabled &&
            previousPoint &&
            latestPoint &&
            this.trendStream &&
            this.trendStream.dataType !== DataType.STRING;
        const stream = this.propertyStream || this.alarmStream;
        const point = this.propertyStream ? this.propertyPoint : this.alarmPoint;
        const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;
        if (stream == null) {
            return undefined;
        }
        const error = this.propertyStream && this.propertyStream.error;
        return (h("div", { class: { wrapper: true, large: !this.miniVersion } }, h("div", null), h("sc-data-stream-name", { displayTooltip: false, label: stream.name, detailedLabel: stream.detailedName, pointType: "data" /* DATA */, date: point && new Date(point.x), onNameChange: this.updateName, isEditing: this.isEditing }), h("div", { class: "icon-container" }, this.isEnabled && icon && h("sc-chart-icon", { name: icon, size: this.iconSize(), color: this.valueColor })), h("div", { class: { main: true, large: !this.miniVersion } }, error != null && h("sc-error-badge", { "data-testid": "warning" }, error), this.isLoading ? (h("sc-loading-spinner", { "data-testid": "loading", style: { height: `${this.fontSize()}px`, width: `${this.fontSize()}px` } })) : (h("div", { "data-testid": "current-value", class: { 'value-wrapper': true, large: !this.miniVersion }, style: { color: this.fontColor(point) } }, h(Value, { isEnabled: this.isEnabled, value: point ? point.y : undefined, unit: stream.unit }))), shouldShowTrends && this.isEnabled && (h(Trend, { previousPoint: previousPoint, latestPoint: latestPoint, miniVersion: this.miniVersion })), !shouldShowTrends && this.isEnabled && point && (h("div", null, "at", ' ', new Date(point.x).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
        }))))));
    }
};
ScKpiBase.style = scKpiBaseCss;

export { ScKpiBase as sc_kpi_base };
