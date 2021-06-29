import { D as DataType } from './dataConstants-a26ff694.js';

const isDefined = (value) => value != null;
const isValid = (predicate) => (t) => predicate(t);
// As of now, we only check if the current component supports string or not.
const isSupportedDataType = (supportsString) => ({ dataType }) => (supportsString && dataType === DataType.STRING) || dataType !== DataType.STRING;
const isNumberDataStream = (stream) => stream.dataType === DataType.NUMBER;
const isNumber = (val) => typeof val === 'number';

export { isNumberDataStream as a, isDefined as b, isSupportedDataType as c, isNumber as d, isValid as i };
