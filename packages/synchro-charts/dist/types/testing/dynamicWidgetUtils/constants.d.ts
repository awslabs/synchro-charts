import { DataStream, DataStreamInfo } from '../../utils/dataTypes';
import { Annotations, LegendConfig } from '../../components/charts/common/types';
export declare const INFOS: DataStreamInfo[];
export declare const DATA: (DataStream<number> | DataStream<string>)[];
export declare const VIEW_PORT: {
    start: Date;
    end: Date;
};
export declare const SIZE: {
    height: number;
    width: number;
};
export declare const ANNOTATIONS: Annotations;
export declare const LEGEND: LegendConfig;
