/**
 * Checks if value can be used as a number
 */
export const isNumeric = (value) =>
  /^(\+|-)?(Infinity|\d+)(\.\d+)?e?((\+|-)?\d+)?$/.test(String(value));
