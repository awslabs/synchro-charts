import { DataStream, DataStreamInfo } from '../../utils/dataTypes';
import { Threshold } from '../../components/charts/common/types';
export declare const START_DATE: Date;
/**
 * Shared Mock Data
 */
export declare const NUMBER_EMPTY_INFO: DataStreamInfo;
export declare const NUMBER_EMPTY_STREAM: DataStream<number>;
export declare const NUMBER_INFO_1: DataStreamInfo;
export declare const NUMBER_STREAM_1: DataStream<number>;
export declare const NUMBER_INFO_2: DataStreamInfo;
export declare const NUMBER_STREAM_2: DataStream<number>;
/**
 * String Mock Data
 */
export declare const STRING_EMPTY_INFO: DataStreamInfo;
export declare const STRING_EMPTY_STREAM: DataStream<string>;
export declare const STRING_INFO_1: DataStreamInfo;
export declare const STRING_STREAM_1: DataStream<string>;
export declare const STRING_INFO_2: DataStreamInfo;
export declare const STRING_STREAM_2: DataStream<string>;
export declare const DATA_STREAM_INFO: DataStreamInfo;
export declare const DATA_STREAM: DataStream<number>;
export declare const DATA_STREAM_2: DataStream<number>;
export declare const THRESHOLD: Threshold;
export declare const BREACHING_VALUE: number;
export declare const NON_BREACHING_VALUE = 20;
/**
 * Construct mock alarms streams and related resources
 */
export declare const ALARM = "alarm";
export declare const OK = "ok";
export declare const ALARM_THRESHOLD: Threshold<string>;
export declare const ALARM_STREAM_INFO: DataStreamInfo;
export declare const NON_BREACHED_ALARM_INFO: DataStreamInfo;
export declare const DATA_WITH_ALARM_INFO: DataStreamInfo;
export declare const WITHIN_VIEWPORT_DATE: Date;
export declare const BEFORE_VIEWPORT_DATE: Date;
export declare const ALARM_STREAM: DataStream<string>;
export declare const DATA_WITH_ALARM_ASSOCIATION: DataStream;
export declare const NON_BREACHED_ALARM_STREAM: DataStream<string>;
