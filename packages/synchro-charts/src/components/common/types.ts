export type LabelsConfig = {
  showUnit?: boolean;
  showName?: boolean;
  showValue?: boolean;
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export type ErrorMessages = {
  errorTimeLabel: string;
  invalidValueError: string;
  missingYminAndYmaxError: string;
  missingYminError: string;
  missingYmaxError: string;
  invalidYminAndYmaxError: string;
  dataNotLimitsError: string;
};

export type TooltipMessage = {
  tooltipValueTitles: string;
  tooltipValueTimeDescribed: string;
  tooltipStatusTitles: string;
  tooltipStatusDescribed: string;
};

/**
 * These are radian.
 * For example:
 *    const angle = { startAngle: 0, endAngle: Math.PI } means `The range of angles is [0, 180°]`
 *    The display is a semi-circular arc.
 */
export type AngleDefault = {
  startAngle: number;
  endAngle: number;
};

export type DonutSizeConfig = {
  fontSize: number;
  iconSize: number;
  labelSize: number;
  unitSize: number;
};

export type Messages = {
  error: ErrorMessages;
  loading: string;
  tooltip: TooltipMessage;
};
