import { AlarmsConfig, DataStream, MessageOverrides, MinimalSizeConfig, MinimalViewPortConfig, RequestDataFn } from '../../../utils/dataTypes';
import { Annotations, Axis, ChartConfig, LayoutConfig, LegendConfig, MovementConfig, ScaleConfig } from '../common/types';
import { Trend } from '../common/trends/types';
export declare class ScBarChart implements ChartConfig {
    /** Chart API */
    viewPort: MinimalViewPortConfig;
    movement?: MovementConfig;
    scale?: ScaleConfig;
    layout?: LayoutConfig;
    legend?: LegendConfig;
    size?: MinimalSizeConfig;
    widgetId: string;
    dataStreams: DataStream[];
    alarms?: AlarmsConfig;
    gestures: boolean;
    annotations: Annotations;
    trends: Trend[];
    requestData?: RequestDataFn;
    axis?: Axis.Options;
    messageOverrides?: MessageOverrides;
    /** Status */
    isEditing: boolean;
    /** Memory Management */
    bufferFactor: number;
    minBufferSize: number;
    render(): any;
}
