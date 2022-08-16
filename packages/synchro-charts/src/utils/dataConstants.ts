import { BOX, FONT_SIZE, LINE_THICKNESS } from "../testing/styleGuide";

export enum DataType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
}

/**
 * Stream type is a classification of a `DataStream`, which contains with it additional structure and features specific
 * to the stream type.
 *
 * For example, for an alarm stream, if a stream is associated to the alarm stream, we interpret the stream as
 * representing the status for the given alarm and present alarm specific UX such as alarm status on the legend and tooltip.
 */
export enum StreamType {
  ALARM = 'ALARM',
  ANOMALY = 'ANOMALY',
  ALARM_THRESHOLD = 'ALARM_THRESHOLD',
}

export enum TREND_TYPE {
  LINEAR = 'linear-regression',
}

export enum ChartType {
  BarChart = 'bar-chart',
  LineChart = 'line-chart',
}

export const DIAL_SIZE_CONFIG = {
  XXL: {
    fontSize: FONT_SIZE.xLarger,
    dialThickness: LINE_THICKNESS.xLarger,
    iconSize: FONT_SIZE.xLarger,
    labelSize: FONT_SIZE.large,
    unitSize: FONT_SIZE.large,
    viewport: BOX.xLarger,
  },
  XL: {
    fontSize: FONT_SIZE.larger,
    dialThickness: LINE_THICKNESS.larger,
    iconSize: FONT_SIZE.large,
    labelSize: FONT_SIZE.medium,
    unitSize: FONT_SIZE.medium,
    viewport: BOX.larger,
  },
  L: {
    fontSize: FONT_SIZE.large,
    dialThickness: LINE_THICKNESS.large,
    iconSize: FONT_SIZE.large,
    labelSize: FONT_SIZE.smaller,
    unitSize: FONT_SIZE.smaller,
    viewport: BOX.large,
  },
  M: {
    fontSize: FONT_SIZE.medium,
    dialThickness: LINE_THICKNESS.medium,
    iconSize: FONT_SIZE.medium,
    labelSize: FONT_SIZE.small,
    unitSize: FONT_SIZE.small,
    viewport: BOX.medium,
  },
  S: {
    fontSize: FONT_SIZE.smaller,
    dialThickness: LINE_THICKNESS.small,
    iconSize: FONT_SIZE.small,
    labelSize: FONT_SIZE.xSmall,
    unitSize: FONT_SIZE.xSmall,
    viewport: BOX.small,
  },
  XS: {
    fontSize: FONT_SIZE.small,
    dialThickness: LINE_THICKNESS.xSmall,
    iconSize: FONT_SIZE.xSmall,
    labelSize: FONT_SIZE.xxSmall,
    unitSize: FONT_SIZE.xxSmall,
    viewport: BOX.xSmall,
  },
};
