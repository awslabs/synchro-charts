export declare enum DataType {
    NUMBER = "NUMBER",
    STRING = "STRING",
    BOOLEAN = "BOOLEAN"
}
/**
 * Stream type is a classification of a `DataStream`, which contains with it additional structure and features specific
 * to the stream type.
 *
 * For example, for an alarm stream, if a stream is associated to the alarm stream, we interpret the stream as
 * representing the status for the given alarm and present alarm specific UX such as alarm status on the legend and tooltip.
 */
export declare enum StreamType {
    ALARM = "ALARM",
    ANOMALY = "ANOMALY"
}
export declare enum TREND_TYPE {
    LINEAR = "linear-regression"
}
export declare enum ChartType {
    BarChart = "bar-chart",
    LineChart = "line-chart"
}
