import { Annotations, Threshold } from '../charts/common/types';

export interface DialSizeConfig {
  fontSize: number;
  dialThickness: number;
  iconSize: number;
  labelSize: number;
  unitSize: number;
}

export type DialMessageOverrides = {
  dataNotNumberError?: string;
  tooltipValueTitles?: string;
  tooltipValueTimeDescribed?: string;
  tooltipStatusTitles?: string;
  tooltipStatusDescribed?: string;
};

export type OffsetForIcon = {
  offsetX?: number;
};

export type DialAnnotations = Annotations & OffsetForIcon;
