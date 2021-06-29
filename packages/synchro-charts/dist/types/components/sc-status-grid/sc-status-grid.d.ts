import { DataStream, MessageOverrides, MinimalViewPortConfig } from '../../utils/dataTypes';
import { Annotations, ChartConfig } from '../charts/common/types';
import { LabelsConfig } from '../common/types';
export declare class ScStatusGrid implements ChartConfig {
    /** Status Grid Specific configuration */
    labelsConfig: LabelsConfig;
    viewPort: MinimalViewPortConfig;
    widgetId: string;
    dataStreams: DataStream[];
    annotations: Annotations;
    liveModeOnlyMessage: string;
    isEditing: boolean;
    messageOverrides: MessageOverrides;
    render(): any;
}
