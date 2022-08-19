export interface DialSizeConfig {
  fontSize: number;
  dialThickness: number;
  iconSize: number;
  labelSize: number;
  unitSize: number;
  width: number;
}

export type DialMessageOverrides = {
  dataNotNumberError?: string;
  tooltipValueTitles?: string;
  tooltipValueTimeDescribed?: string;
  tooltipStatusTitles?: string;
  tooltipStatusDescribed?: string;
};
