import { h, r as registerInstance } from './index-44bccbc7.js';

const scKpiCss = "sc-kpi .align{display:flex;align-content:center;justify-content:center}sc-kpi .container{display:flex;flex-direction:column;height:100%;overflow:auto;position:relative;-ms-overflow-style:none;scrollbar-width:none}sc-kpi .container::-webkit-scrollbar{display:none}sc-kpi sc-chart-icon .sc-chart-icon{top:-3px}sc-kpi .large sc-chart-icon{position:relative}sc-kpi .help-icon-container{z-index:100;position:absolute;right:0;top:0}";

const MSG = 'This visualization displays only live data. Choose a live time frame to display data in this visualization.';
const renderCell = props => h("sc-kpi-base", Object.assign({}, props));
const ScKpi = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.liveModeOnlyMessage = MSG;
        this.isEditing = false;
        this.messageOverrides = {};
    }
    render() {
        const { viewPort, widgetId, dataStreams, annotations, liveModeOnlyMessage, isEditing, messageOverrides } = this;
        return (h("sc-widget-grid", { viewPort: viewPort, widgetId: widgetId, dataStreams: dataStreams, annotations: annotations, liveModeOnlyMessage: liveModeOnlyMessage, isEditing: isEditing, messageOverrides: messageOverrides, renderCell: renderCell }));
    }
};
ScKpi.style = scKpiCss;

export { ScKpi as sc_kpi };
