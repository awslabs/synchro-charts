import { DataStream, Primitive } from './dataTypes';
/**
 * Given a list of infos, return the ones that are to be visualized.
 *
 * This will remove any alarms that don't have an associated property info.
 */
export declare const removePairedAlarms: (streams: DataStream<Primitive>[]) => DataStream<Primitive>[];
declare type StreamPair = {
    alarm?: DataStream<Primitive>;
    property?: DataStream<Primitive>;
};
/**
 * Returns alarm/property pairs.
 *
 * For instance, if you have one property with 3 alarms associated with it, this will return you 3 pairs in total. One pair for each alarm.
 */
export declare const streamPairs: (dataStreams: DataStream<Primitive>[]) => StreamPair[];
export {};
