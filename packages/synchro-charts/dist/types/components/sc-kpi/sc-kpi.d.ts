import { DataStream, MessageOverrides, MinimalViewPortConfig } from '../../utils/dataTypes';
import { Annotations, ChartConfig } from '../charts/common/types';
export declare class ScKpi implements ChartConfig {
    viewPort: MinimalViewPortConfig;
    widgetId: string;
    dataStreams: DataStream[];
    annotations: Annotations;
    liveModeOnlyMessage: string;
    isEditing: boolean;
    messageOverrides: MessageOverrides;
    render(): any;
}
