import { h } from './index-44bccbc7.js';
import { N as NO_VALUE_PRESENT } from './terms-d11f73d5.js';
import { r as round } from './number-0c56420d.js';

/**
 * Display value of a data point, supports all data types
 */
const Value = ({ isEnabled = true, value, unit }) => {
    if (!isEnabled || value == null) {
        return NO_VALUE_PRESENT;
    }
    if (typeof value === 'number') {
        /** Display Number */
        return [round(value), unit && h("span", { class: "unit" },
                " ",
                unit)];
    }
    /** Display String */
    return [value, unit && h("span", { class: "unit" },
            " ",
            unit)];
};

export { Value as V };
