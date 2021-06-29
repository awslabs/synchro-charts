// NOTE: `enum`s are held separately from the types which are exported
// as part of the package, since `enum`'s cannot be present in a type declaration file.
// THis is due to an `enum` being a type plus an implementation, while type declaration
// files can only contain typing information.
/**
 * Maps the view model to d3 axis types. In the future we could add additional
 * custom scale types beyond what's available in `d3-axis`.
 */
var ScaleType;
(function (ScaleType) {
    ScaleType["TimeSeries"] = "time-series";
    ScaleType["Log"] = "log";
    ScaleType["Linear"] = "linear";
})(ScaleType || (ScaleType = {}));
var LEGEND_POSITION;
(function (LEGEND_POSITION) {
    LEGEND_POSITION["RIGHT"] = "RIGHT";
    LEGEND_POSITION["BOTTOM"] = "BOTTOM";
})(LEGEND_POSITION || (LEGEND_POSITION = {}));
var COMPARISON_OPERATOR;
(function (COMPARISON_OPERATOR) {
    COMPARISON_OPERATOR["LESS_THAN"] = "LT";
    COMPARISON_OPERATOR["GREATER_THAN"] = "GT";
    COMPARISON_OPERATOR["LESS_THAN_EQUAL"] = "LTE";
    COMPARISON_OPERATOR["GREATER_THAN_EQUAL"] = "GTE";
    COMPARISON_OPERATOR["EQUAL"] = "EQ";
})(COMPARISON_OPERATOR || (COMPARISON_OPERATOR = {}));
var StatusIcon;
(function (StatusIcon) {
    StatusIcon["ERROR"] = "error";
    StatusIcon["ACTIVE"] = "active";
    StatusIcon["NORMAL"] = "normal";
    StatusIcon["ACKNOWLEDGED"] = "acknowledged";
    StatusIcon["SNOOZED"] = "snoozed";
    StatusIcon["DISABLED"] = "disabled";
    StatusIcon["LATCHED"] = "latched";
})(StatusIcon || (StatusIcon = {}));
const STATUS_ICONS = [
    StatusIcon.ERROR,
    StatusIcon.ACTIVE,
    StatusIcon.NORMAL,
    StatusIcon.ACKNOWLEDGED,
    StatusIcon.SNOOZED,
    StatusIcon.DISABLED,
    StatusIcon.LATCHED,
];
var DATA_ALIGNMENT;
(function (DATA_ALIGNMENT) {
    DATA_ALIGNMENT["EITHER"] = "EITHER";
    DATA_ALIGNMENT["RIGHT"] = "RIGHT";
    DATA_ALIGNMENT["LEFT"] = "LEFT";
})(DATA_ALIGNMENT || (DATA_ALIGNMENT = {}));

export { COMPARISON_OPERATOR as C, DATA_ALIGNMENT as D, LEGEND_POSITION as L, ScaleType as S, StatusIcon as a, STATUS_ICONS as b };
