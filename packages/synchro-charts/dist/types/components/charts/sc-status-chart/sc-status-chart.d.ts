import { AlarmsConfig, DataStream, MessageOverrides, MinimalSizeConfig, MinimalViewPortConfig, RequestDataFn } from '../../../utils/dataTypes';
import { Annotations, Axis, ChartConfig, LayoutConfig, MovementConfig, ScaleConfig, Threshold } from '../common/types';
export declare class ScStatusChart implements ChartConfig {
    /** Chart API */
    viewPort: MinimalViewPortConfig;
    gestures: boolean;
    movement?: MovementConfig;
    scale?: ScaleConfig;
    layout?: LayoutConfig;
    size?: MinimalSizeConfig;
    widgetId: string;
    dataStreams: DataStream[];
    annotations?: Annotations;
    requestData?: RequestDataFn;
    axis?: Axis.Options;
    messageOverrides?: MessageOverrides;
    alarms?: AlarmsConfig;
    /** Status */
    isEditing: boolean;
    /** Memory Management */
    bufferFactor: number;
    minBufferSize: number;
    thresholds: () => Threshold[];
    render(): any;
}
