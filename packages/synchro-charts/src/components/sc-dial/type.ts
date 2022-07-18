import { Threshold } from '../charts/common/types';
import { DataPoint, DataStream, MessageOverrides, ViewPortConfig } from '../../utils/dataTypes';
import { LabelsConfig } from '../common/types';
import { StatusIcon } from '../charts/common/constants';

export type CellOptions = {
  error: string | undefined;
  labelsConfig?: LabelsConfig;
  icon?: StatusIcon;
  isRefreshing?: boolean;
  isLoading?: boolean;
  messageOverrides: MessageOverrides;
  breachedThreshold?: Threshold;
  point?: DataPoint | undefined;
  alarmPoint?: DataPoint;
  alarmStream?: DataStream;
  propertyPoint?: DataPoint;
  propertyStream?: DataStream;
  valueColor?: string;
  viewport: ViewPortConfig;
};

export type RenderCell = (cellOptions: CellOptions) => void;
