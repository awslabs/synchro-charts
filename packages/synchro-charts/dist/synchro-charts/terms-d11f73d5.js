// For use when there is a data stream, but there is no value contained within the time frame being viewed.
const NO_VALUE_PRESENT = '-';
/**
 * default messages, can be overridden via `MessageOverrides` API.
 */
/* default 'no data streams' empty state messaging */
const NO_DATA_STREAMS_PRESENT_HEADER = 'No properties or alarms';
const NO_DATA_STREAMS_PRESENT_SUB_HEADER = "This widget doesn't have any properties or alarms.";
/* default 'no data' empty state messaging */
const NO_DATA_PRESENT_HEADER = 'No data';
const NO_DATA_PRESENT_SUB_HEADER = "There's no data to display for this time range.";

export { NO_VALUE_PRESENT as N, NO_DATA_STREAMS_PRESENT_HEADER as a, NO_DATA_STREAMS_PRESENT_SUB_HEADER as b, NO_DATA_PRESENT_HEADER as c, NO_DATA_PRESENT_SUB_HEADER as d };
