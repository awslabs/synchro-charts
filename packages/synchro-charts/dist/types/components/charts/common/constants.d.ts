/**
 * Maps the view model to d3 axis types. In the future we could add additional
 * custom scale types beyond what's available in `d3-axis`.
 */
export declare enum ScaleType {
    TimeSeries = "time-series",
    Log = "log",
    Linear = "linear"
}
export declare enum LEGEND_POSITION {
    RIGHT = "RIGHT",
    BOTTOM = "BOTTOM"
}
export declare enum COMPARISON_OPERATOR {
    LESS_THAN = "LT",
    GREATER_THAN = "GT",
    LESS_THAN_EQUAL = "LTE",
    GREATER_THAN_EQUAL = "GTE",
    EQUAL = "EQ"
}
export declare enum StatusIcon {
    ERROR = "error",
    ACTIVE = "active",
    NORMAL = "normal",
    ACKNOWLEDGED = "acknowledged",
    SNOOZED = "snoozed",
    DISABLED = "disabled",
    LATCHED = "latched"
}
export declare const STATUS_ICONS: StatusIcon[];
export declare enum DATA_ALIGNMENT {
    EITHER = "EITHER",
    RIGHT = "RIGHT",
    LEFT = "LEFT"
}
