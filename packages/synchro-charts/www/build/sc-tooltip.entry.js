import { r as registerInstance, h } from './index-44bccbc7.js';

const scTooltipCss = "sc-tooltip{--tooltip-size:8px;--tooltip-line-width:2px;pointer-events:none;position:absolute}sc-tooltip small{white-space:nowrap}sc-tooltip .awsui{position:absolute;z-index:20;min-width:90px}sc-tooltip .tooltip-container{background:var(--awsui-color-white);position:relative;display:inline-block;min-width:90px;width:max-content;transition-property:left, top;transition-duration:120ms}sc-tooltip .tooltip-line{position:relative;margin-left:calc(-1 * calc(var(--tooltip-line-width) / 2));width:var(--selection-width);background-color:var(--selection-color);opacity:var(--selection-opacity)}";

const ScTooltip = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.trendResults = [];
        this.showDataStreamColor = true;
        // If false, do not display a tooltip row if there is no associated point.
        this.showBlankTooltipRows = false;
        this.sortPoints = true;
        this.setSelectedDate = ({ offsetX, buttons }) => {
            const isMouseBeingPressed = buttons > 0;
            if (!isMouseBeingPressed && offsetX != null) {
                // Determine the date which corresponds with the mouses position.
                const { start, end } = this.viewPort;
                const { width } = this.size;
                const ratio = offsetX / width;
                const viewPortDuration = end.getTime() - start.getTime();
                const selectedDateMS = start.getTime() + viewPortDuration * ratio;
                this.selectedDate = new Date(selectedDateMS);
            }
            else {
                this.selectedDate = undefined;
            }
        };
        this.hideTooltip = () => {
            this.selectedDate = undefined;
        };
    }
    componentDidLoad() {
        this.dataContainer.addEventListener('mousemove', this.setSelectedDate);
        this.dataContainer.addEventListener('mouseleave', this.hideTooltip);
        this.dataContainer.addEventListener('mousedown', this.hideTooltip, { capture: true });
    }
    disconnectedCallback() {
        this.dataContainer.removeEventListener('mousemove', this.setSelectedDate);
        this.dataContainer.removeEventListener('mouseleave', this.hideTooltip);
        this.dataContainer.removeEventListener('mousedown', this.hideTooltip);
    }
    render() {
        const resolution = this.dataStreams.length > 0 ? this.dataStreams[0].resolution : undefined;
        if (resolution == null || this.selectedDate == null) {
            return null;
        }
        return (h("sc-tooltip-rows", { trendResults: this.trendResults, size: this.size, dataStreams: this.dataStreams, viewPort: this.viewPort, selectedDate: this.selectedDate, thresholds: this.thresholds, maxDurationFromDate: this.maxDurationFromDate, showDataStreamColor: this.showDataStreamColor, dataAlignment: this.dataAlignment, supportString: this.supportString, visualizesAlarms: this.visualizesAlarms, showBlankTooltipRows: this.showBlankTooltipRows, sortPoints: this.sortPoints, top: this.top }));
    }
};
ScTooltip.style = scTooltipCss;

export { ScTooltip as sc_tooltip };
