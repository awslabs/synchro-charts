import { r as registerInstance, h } from './index-44bccbc7.js';
import { a as StatusIcon } from './constants-4b21170a.js';
import './terms-d11f73d5.js';
import './number-0c56420d.js';
import { V as Value } from './Value-c253e0f4.js';

const ScTableCell = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Return the most recent value from the data stream present.
         *
         * If no such value exists, returns `undefined`.
         */
        this.value = () => {
            const { dataStream = undefined } = this.cell || {};
            if (dataStream == null || dataStream.data.length === 0) {
                return undefined;
            }
            // data is sorted chronological, from old to more recent - making this the latest value.
            return dataStream.data[dataStream.data.length - 1].y;
        };
    }
    render() {
        const { dataStream = undefined, color = undefined, icon = undefined } = this.cell || {};
        const error = dataStream && dataStream.error;
        const isLoading = dataStream && dataStream.isLoading;
        if (error != null) {
            /** Error */
            // If there is an error associated with the data stream, we cannot necessarily trust what
            // the data stream is telling us - i.e. it may be stale. So even if we could display some
            // existing data, error UX takes precedence.
            return (h("div", { class: "error" }, h("sc-chart-icon", { name: StatusIcon.ERROR }), error));
        }
        if (isLoading) {
            /** Loading */
            // Loading is render blocking, so even if we have a value we could display, we display the spinner
            return (h("div", { class: "loading-wrapper" }, h("sc-loading-spinner", null)));
        }
        /** Display cell value */
        return (this.cell &&
            this.cell.dataStream && (h("span", { style: { color: color || 'unset', display: 'flex' } }, icon && h("sc-chart-icon", { name: icon }), h(Value, { value: this.value() }))));
    }
};

export { ScTableCell as sc_table_cell };
