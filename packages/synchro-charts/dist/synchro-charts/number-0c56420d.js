const MAX_PRECISION = 4;
/**
 * Rounds a number to a pre-determined precision
 *
 * i.e. round(100000.1234) => 100000.1234
 *      round(100000.12345678) => 100000.1234
 *      round(.02345678) => 0.02346
 */
const round = (num) => {
    if (Number.isNaN(num) || num === Infinity || num === -Infinity) {
        return num;
    }
    if (Math.abs(num) < 1) {
        return Number(num.toPrecision(MAX_PRECISION));
    }
    const integer = Math.trunc(num);
    const decimal = num - integer;
    return integer + Number(decimal.toFixed(MAX_PRECISION));
};
/**
 * Checks if value can be used as a number
 */
const isNumeric = (value) => /^(\+|-)?(Infinity|\d+)(\.\d+)?e?((\+|-)?\d+)?$/.test(String(value));

export { isNumeric as i, round as r };
