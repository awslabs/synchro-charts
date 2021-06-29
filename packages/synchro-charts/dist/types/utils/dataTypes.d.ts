import { DataType, StreamType } from './dataConstants';
/**
 * Types which represent the data and data streams.
 */
export declare type Primitive = string | number;
export declare type Timestamp = number;
export declare type DataPoint<T extends Primitive = Primitive> = {
    x: Timestamp;
    y: T;
};
export declare type DataStreamId = string;
export declare type StreamAssociation = {
    id: DataStreamId;
    type: StreamType;
};
/**
 * Utilized for the `table` component, to map data-streams to cells.
 */
export declare type TableColumn = {
    header: string;
    rows: (DataStreamId | undefined)[];
};
/**
 * Data Stream Info
 *
 * A view model representation of a data stream.
 * Is utilized to request and display data within widgets
 */
export interface DataStreamInfo {
    id: DataStreamId;
    resolution: number;
    name: string;
    color?: string;
    dataType: DataType;
    unit?: string;
    detailedName?: string;
    streamType?: StreamType;
    associatedStreams?: StreamAssociation[];
}
/**
 * Minimal Size Configuration request for implementing a component
 */
export interface MinimalSizeConfig {
    width?: number;
    height?: number;
    marginRight?: number;
    marginLeft?: number;
    marginTop?: number;
    marginBottom?: number;
}
/**
 * Size Configuration
 *
 * An internal model which widgets utilize internally,
 * after the default margins are set.
 */
export interface SizeConfig extends MinimalSizeConfig {
    width: number;
    height: number;
    marginRight: number;
    marginLeft: number;
    marginTop: number;
    marginBottom: number;
}
export interface SizePositionConfig extends SizeConfig {
    x: number;
    y: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export interface MinimalViewPortConfig {
    start?: Date;
    end?: Date;
    duration?: number;
    group?: string;
    yMin?: number;
    yMax?: number;
    lastUpdatedBy?: string;
}
/**
 * View Port
 *
 * The view port defines the domain and range of the data of which we would like to visualize/analyze.
 */
export interface ViewPortConfig extends MinimalViewPortConfig {
    yMin: number;
    yMax: number;
}
export interface ViewPort extends MinimalViewPortConfig {
    start: Date;
    end: Date;
    yMin: number;
    yMax: number;
}
/**
 * Alarms Configuration
 *
 * Configurations to the interoperation of alarm data.
 */
export declare type AlarmsConfig = {
    expires?: number;
};
/**
 * Base Config
 *
 * The base configuration of which all widgets must implement.
 * Widgets may however implement more than what is given in the base config.
 */
export interface BaseConfig {
    widgetId: string;
    viewPort: MinimalViewPortConfig | ViewPortConfig;
    size?: MinimalSizeConfig;
}
export declare type ErrorMap = {
    [dataStreamId: string]: string | undefined;
};
/**
 * Messages which can be customized. i.e. for internationalization, or business domain specific jargon.
 */
export declare type MessageOverrides = {
    /** value label utilized in some widgets */
    liveTimeFrameValueLabel?: string;
    historicalTimeFrameValueLabel?: string;
    /** no data streams present - msg displayed when there are no data streams present */
    noDataStreamsPresentHeader?: string;
    noDataStreamsPresentSubHeader?: string;
    /** no data present - msg displayed when no streams have any data */
    noDataPresentHeader?: string;
    noDataPresentSubHeader?: string;
};
export declare const DEFAULT_MESSAGE_OVERRIDES: Required<MessageOverrides>;
/** SVG Constants */
export declare const STREAM_ICON_STROKE_LINECAP = "round";
export declare const STREAM_ICON_STROKE_WIDTH = 3;
export declare const STREAM_ICON_PATH_COMMAND = "M 2 2 H 15";
export declare const TREND_ICON_DASH_ARRAY = "1, 5";
/**
 * Data Stream
 *
 * Note that each data point represents an interval of data which has a time period of `resolution` milliseconds,
 *
 * An aggregation period of a `DataPoint` at time `t`, and `Resolution` `r` (a time duration),
 * is represented by the time interval `(t - r, t]`. i.e. the time interval `t - r` exclusive, to `t` inclusive.
 *
 * A `resolution` of `0` implies that there is no aggregation occurring, and that the data represents a single point in time,
 * of which has no duration.
 */
export interface DataStream<T extends Primitive = Primitive> extends DataStreamInfo {
    id: DataStreamId;
    name: string;
    detailedName?: string;
    color?: string;
    unit?: string;
    data: DataPoint<T>[];
    aggregates?: {
        [resolution: number]: DataPoint<T>[] | undefined;
    };
    dataType: DataType;
    streamType?: StreamType;
    associatedStreams?: StreamAssociation[];
    isLoading?: boolean;
    isRefreshing?: boolean;
    error?: string;
    resolution: number;
}
/**
 * Resolution
 *
 * Represents the number of milliseconds that each data point represents
 *
 * If I have a resolution of one minute, that means each data point represents an interval of one minutes worth of data.
 *
 * If I have a resolution of zero, that means the data is "raw data", or, each data point represents a
 * a single point in time (which is an interval of time with a duration of zero).
 */
export declare type Resolution = number;
export declare type RequestDataFn = ({ start, end }: {
    start: Date;
    end: Date;
}) => void;
