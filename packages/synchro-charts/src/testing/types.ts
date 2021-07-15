import { Annotations, LegendConfig } from '../components/charts/common/types';
import { DataStream, DataStreamInfo, Resolution } from '../utils/dataTypes';

export type WidgetSearchQueryParams = {
  viewportStart: Date;
  viewportEnd: Date;
  componentTag: string;
  legend: LegendConfig;
  resolution: Resolution;
  isEditing: boolean;
  dataStreamInfos: DataStreamInfo[];
  annotations?: Annotations;
  // Data to be returned via a mock `onRequestData`
  dataStreams: DataStream[];
  // Data is passed directly in to the component, instead of being sent via a mock `onRequestData`
  data: DataStream[];
  // Effect the time period before `onRequestData` will make the request as complete. Allows tests of
  // simulated asynchronous workflows
  delayBeforeDataLoads: number; // ms
  // If true, `onRequestData` will register an error.
  hasError: boolean;
};
