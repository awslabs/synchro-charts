import { EventEmitter } from '../../stencil-public-runtime';
import { DataPoint, DataStream, MessageOverrides, MinimalViewPortConfig, Primitive } from '../../utils/dataTypes';
import { NameValue } from '../sc-data-stream-name/helper';
import { ActivePoint } from '../charts/sc-webgl-base-chart/activePoints';
import { RenderCell } from './types';
import { Annotations, ChartConfig, Threshold, WidgetConfigurationUpdate } from '../charts/common/types';
import { LabelsConfig } from '../common/types';
/**
 * A generic parent container which can be utilized to construct a variety of 'grid-like' components.
 *
 * This copmonent allows construction of widgets, by simply constructing the display cell via the `renderCell` method.gt
 */
export declare class ScWidgetGrid implements ChartConfig {
    renderCell: RenderCell;
    collapseVertically: boolean;
    /** Chart API */
    labelsConfig?: LabelsConfig;
    viewPort: MinimalViewPortConfig;
    widgetId: string;
    dataStreams: DataStream[];
    annotations: Annotations;
    isEditing: boolean;
    messageOverrides: MessageOverrides;
    liveModeOnlyMessage: string;
    /** Widget data stream names */
    names: NameValue[];
    /** Active Viewport */
    start: Date;
    end: Date;
    duration?: number;
    widgetUpdated: EventEmitter<WidgetConfigurationUpdate>;
    componentDidLoad(): void;
    onViewPortChange(newViewPort: MinimalViewPortConfig): void;
    onUpdate: ({ start, end, duration }: {
        start: Date;
        end: Date;
        duration?: number | undefined;
    }) => void;
    disconnectedCallback(): void;
    /**
     * On Widget Updated - Persist `DataStreamInfo`
     *
     * Emits an event which persists the current `NameValue[]` state into the
     * data stream info.
     */
    onWidgetUpdated(): void;
    onChangeLabel: ({ streamId, name }: {
        streamId: string;
        name: string;
    }) => void;
    getPoints: () => ActivePoint<Primitive>[];
    getBreachedThreshold: (point: DataPoint | undefined, dataStream: DataStream) => Threshold | undefined;
    /**
     * return all the raw data, that is, data that has no form of aggregation ran upon it. The data represents some
     * measurement, at a given point in time.
     */
    rawData: () => DataStream[];
    render(): any;
}
