import { Annotations, LegendConfig } from '../components/charts/common/types';
import { DataStream, DataStreamInfo, Resolution } from '../utils/dataTypes';
export declare type WidgetSearchQueryParams = {
    viewPortStart: Date;
    viewPortEnd: Date;
    componentTag: string;
    legend: LegendConfig;
    resolution: Resolution;
    isEditing: boolean;
    dataStreamInfos: DataStreamInfo[];
    annotations?: Annotations;
    dataStreams: DataStream[];
    data: DataStream[];
    delayBeforeDataLoads: number;
    hasError: boolean;
};
