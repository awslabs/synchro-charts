import { h, r as registerInstance } from './index-44bccbc7.js';
import './constants-4b21170a.js';
import './dataConstants-a26ff694.js';
import './terms-d11f73d5.js';
import './time-f374952b.js';
import './predicates-ced25765.js';
import './utils-11cae6c8.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import './dataFilters-8fe55407.js';
import './breachedThreshold-ae43cec9.js';
import { f as formatLiveModeOnlyMessage } from './constructTableData-b4780ac9.js';
import { E as EmptyStatus } from './EmptyStatus-3149dfe5.js';

const ScTableRows = ({ columns, rows, messageOverrides, }) => {
    return rows.length ? (h("tbody", null, rows.map(row => (h("tr", null, columns.map((column, i) => {
        const cell = row[column.header];
        const key = cell && cell.dataStream ? `${cell.dataStream.id}-${i}` : `empty-${i}`;
        return (h("td", { key: key, id: `cell-${column.header}` },
            h("sc-table-cell", { cell: cell })));
    })))))) : (h("div", { class: "empty-status-container" },
        h(EmptyStatus, { displaysNoDataPresentMsg: true, messageOverrides: messageOverrides, isLoading: false, hasNoDataPresent: true, hasNoDataStreamsPresent: true })));
};

const scTableBaseCss = "sc-table{--spinner-size:18px}sc-table .container{overflow-x:auto;overflow-y:scroll;position:relative;height:100%;width:100%;box-shadow:0 1px 1px 0 rgba(0, 28, 36, 0.3),\n    1px 1px 1px 0 rgba(0, 28, 36, 0.15),\n    -1px 1px 1px 0 rgba(0, 28, 36, 0.15);border-top:1px solid var(--awsui-color-grey-200);border-radius:0;box-sizing:border-box;-ms-overflow-style:none;scrollbar-width:none}sc-table .container::-webkit-scrollbar{display:none}sc-table table{min-width:100%;border-spacing:0;box-sizing:border-box;color:var(--secondary-font-color);background-color:#fff}sc-table .column-header-content{display:inline-block;padding:1rem;border:1px solid transparent;color:var(--primary-font-color);font-weight:700}sc-table th{position:relative;text-align:left;padding:0.3rem 1rem;border-bottom:1px solid var(--awsui-color-grey-200);box-sizing:border-box;min-height:4rem;background:var(--awsui-color-grey-100);word-break:keep-all}sc-table th:not(:first-child)::before{content:'';position:absolute;bottom:25%;height:50%;border-left:1px solid var(--awsui-color-grey-200);box-sizing:border-box}sc-table td{border-bottom:1px solid var(--awsui-color-grey-200);border-top:1px solid transparent;padding:0.4rem 2rem;box-sizing:border-box;word-wrap:break-word}sc-table td:first-child{border-left:1px solid transparent;padding-left:1.9rem;box-sizing:border-box;height:4rem}sc-table .loading-wrapper{display:flex}sc-table sc-loading-spinner{width:var(--spinner-size);height:var(--spinner-size)}sc-table .error{display:flex;align-items:end;color:red}sc-table .empty-status,.disable-status{z-index:11;display:flex;flex-direction:column;align-items:center;color:var(--light-text)}sc-table .empty-status h3{font-size:var(--font-size-3);line-height:var(--line-height-3);padding-bottom:var(--font-size-2);font-weight:normal}sc-table .disable-status h3{font-size:var(--font-size-3);line-height:var(--line-height-3);padding-bottom:var(--font-size-2);font-weight:normal}sc-table .empty-status-container,.disable-status-container{display:flex;align-items:center;justify-content:center;height:100%;width:100%;position:absolute;top:0;padding:2rem}";

const ScTableBase = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const { msgHeader, msgSubHeader } = formatLiveModeOnlyMessage(this.liveModeOnlyMessage);
        return (h("div", { class: "awsui container" }, h("table", { role: "table" }, h("thead", null, h("tr", null, this.columns.map(({ header }) => (h("th", { key: header }, h("span", { class: "column-header-content" }, header)))))), this.isEnabled ? (h(ScTableRows, { rows: this.rows, columns: this.columns, messageOverrides: this.messageOverrides })) : (h("div", { class: "disable-status-container" }, h("div", { class: "disable-status" }, h("h3", null, msgHeader), msgSubHeader))))));
    }
};
ScTableBase.style = scTableBaseCss;

export { ScTableBase as sc_table_base };
