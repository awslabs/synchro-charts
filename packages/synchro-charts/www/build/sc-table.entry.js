import { r as registerInstance, h } from './index-44bccbc7.js';
import './constants-4b21170a.js';
import './dataConstants-a26ff694.js';
import './time-f374952b.js';
import './three.module-af3affdd.js';
import { w as webGLRenderer } from './webglContext-25ec9599.js';
import './predicates-ced25765.js';
import { i as isThreshold } from './utils-11cae6c8.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import './dataFilters-8fe55407.js';
import './breachedThreshold-ae43cec9.js';
import { c as constructTableData } from './constructTableData-b4780ac9.js';
import { v as viewPortStartDate, a as viewPortEndDate } from './viewPort-ee120ad9.js';

const MSG = 'This visualization displays only live data. Choose a live time frame to display data in this visualization.';
const ScTable = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.liveModeOnlyMessage = MSG;
        this.messageOverrides = {};
        /** Active Viewport */
        this.start = viewPortStartDate(this.viewPort);
        this.end = viewPortEndDate(this.viewPort);
        this.duration = this.viewPort.duration;
        this.onUpdate = ({ start, end, duration }) => {
            // Update active viewport
            this.start = start;
            this.end = end;
            this.duration = duration;
        };
        this.getThresholds = () => this.annotations && this.annotations.y ? this.annotations.y.filter(isThreshold) : [];
    }
    onViewPortChange(newViewPort) {
        this.onUpdate(Object.assign(Object.assign({}, newViewPort), { start: viewPortStartDate(this.viewPort), end: viewPortEndDate(this.viewPort) }));
    }
    componentDidLoad() {
        webGLRenderer.addChartScene({
            id: this.widgetId,
            viewPortGroup: this.viewPort.group,
            dispose: () => { },
            updateViewPort: this.onUpdate,
        });
    }
    disconnectedCallback() {
        // necessary to make sure that the allocated memory is released, and nothing is incorrectly rendered.
        webGLRenderer.removeChartScene(this.widgetId);
    }
    render() {
        const rows = constructTableData({
            tableColumns: this.tableColumns,
            dataStreams: this.dataStreams,
            thresholds: this.getThresholds(),
            date: this.end,
        });
        const isEnabled = this.duration != null;
        return (h("sc-table-base", { columns: this.tableColumns, rows: rows, isEnabled: isEnabled, liveModeOnlyMessage: this.liveModeOnlyMessage, messageOverrides: this.messageOverrides }));
    }
    static get watchers() { return {
        "viewPort": ["onViewPortChange"]
    }; }
};

export { ScTable as sc_table };
