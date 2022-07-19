import { Threshold } from '../charts/common/types';
import { DataPoint, DataStream, MessageOverrides, MinimalSizeConfig, ViewPortConfig } from '../../utils/dataTypes';
import { LabelsConfig } from '../common/types';
import { StatusIcon } from '../charts/common/constants';

export type CellOptions = {
  error: string | undefined;
  labelsConfig?: LabelsConfig;
  icon?: StatusIcon;
  isRefreshing?: boolean;
  isLoading?: boolean;
  messageOverrides: MessageOverrides;
  breachedThreshold?: Threshold | undefined;
  point?: DataPoint | undefined;
  alarmPoint?: DataPoint;
  alarmStream?: DataStream;
  propertyPoint?: DataPoint;
  propertyStream?: DataStream;
  valueColor?: string;
  viewport: ViewPortConfig;
  size?: MinimalSizeConfig;
};

export type RenderCell = (cellOptions: CellOptions) => void;
