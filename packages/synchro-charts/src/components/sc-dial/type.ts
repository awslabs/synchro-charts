import { Annotations } from '../charts/common/types';

export interface DialSizeConfig {
  fontSize: number;
  dialThickness: number;
  iconSize: number;
  labelSize: number;
  unitSize: number;
}

export type OffsetForIcon = {
  offsetX?: number;
};

export type DialAnnotations = Annotations & OffsetForIcon;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export type DialErrorMessages = {
  errorTimeLabel: string;
  dataNotNumberError: string;
};

export type TooltipMessage = {
  tooltipValueTitles: string;
  tooltipValueTimeDescribed: string;
  tooltipStatusTitles: string;
  tooltipStatusDescribed: string;
};

export type DialMessages = {
  error: DialErrorMessages;
  tooltip: TooltipMessage;
};
