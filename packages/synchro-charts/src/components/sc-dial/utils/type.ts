import { ErrorMessages, TooltipMessage } from '../../common/types';

export interface DialSizeConfig {
  fontSize: number;
  dialThickness: number;
  iconSize: number;
  labelSize: number;
  unitSize: number;
}

export type DialMessages = {
  error: ErrorMessages;
  loading: string;
  tooltip: TooltipMessage;
};
