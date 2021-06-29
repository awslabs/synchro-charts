var DataType;
(function (DataType) {
    DataType["NUMBER"] = "NUMBER";
    DataType["STRING"] = "STRING";
    DataType["BOOLEAN"] = "BOOLEAN";
})(DataType || (DataType = {}));
/**
 * Stream type is a classification of a `DataStream`, which contains with it additional structure and features specific
 * to the stream type.
 *
 * For example, for an alarm stream, if a stream is associated to the alarm stream, we interpret the stream as
 * representing the status for the given alarm and present alarm specific UX such as alarm status on the legend and tooltip.
 */
var StreamType;
(function (StreamType) {
    StreamType["ALARM"] = "ALARM";
    StreamType["ANOMALY"] = "ANOMALY";
})(StreamType || (StreamType = {}));
var TREND_TYPE;
(function (TREND_TYPE) {
    TREND_TYPE["LINEAR"] = "linear-regression";
})(TREND_TYPE || (TREND_TYPE = {}));
var ChartType;
(function (ChartType) {
    ChartType["BarChart"] = "bar-chart";
    ChartType["LineChart"] = "line-chart";
})(ChartType || (ChartType = {}));

export { ChartType as C, DataType as D, StreamType as S, TREND_TYPE as T };
