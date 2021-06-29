import { h, r as registerInstance } from './index-44bccbc7.js';

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const DEFAULT_LABELS_CONFIG = {
    showUnit: true,
    showName: true,
    showValue: true,
};
const renderCell = (_a) => {
    var { labelsConfig } = _a, rest = __rest(_a, ["labelsConfig"]);
    return (h("sc-status-cell", Object.assign({ labelsConfig: Object.assign(Object.assign({}, DEFAULT_LABELS_CONFIG), labelsConfig) }, rest)));
};
const MSG = 'This visualization displays only live data. Choose a live time frame to display data in this visualization.';
const ScStatusGrid = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.liveModeOnlyMessage = MSG;
        this.isEditing = false;
        this.messageOverrides = {};
    }
    render() {
        const { viewPort, widgetId, dataStreams, annotations, liveModeOnlyMessage, isEditing, messageOverrides, labelsConfig, } = this;
        return (h("sc-widget-grid", { labelsConfig: labelsConfig, viewPort: viewPort, widgetId: widgetId, dataStreams: dataStreams, annotations: annotations, liveModeOnlyMessage: liveModeOnlyMessage, isEditing: isEditing, messageOverrides: messageOverrides, renderCell: renderCell }));
    }
};

export { ScStatusGrid as sc_status_grid };
