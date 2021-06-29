import { DataStream, DataStreamId, Primitive } from '../../../../utils/dataTypes';
import { Threshold } from '../types';
/**
 * Returns the most important threshold.
 *
 * The most important threshold is the visual which is most important to a user
 * This is determined via the `severity`. Lower severity means highest importance.
 *
 * If no thresholds are present with `severity`, the first threshold is returned.
 */
export declare const highestPriorityThreshold: (thresholds: Threshold[]) => Threshold | undefined;
/**
 * returns whether the given threshold can be applied to the requested data stream.
 *
 * EXPOSED FOR TESTING
 */
export declare const thresholdAppliesToDataStream: (threshold: Threshold, dataStreamId: DataStreamId) => boolean;
/**
 * Returns all of the breached thresholds for any of the alarms associated with the requested data stream.
 *
 * Does NOT return them in any sort of priority order.
 *
 * EXPOSED FOR TESTING
 */
export declare const breachedAlarmThresholds: ({ date, dataStream, dataStreams, thresholds, }: {
    date: Date;
    dataStream: DataStream;
    dataStreams: DataStream[];
    thresholds: Threshold[];
}) => Threshold[];
/**
 * Get the highest priority breached threshold.
 *
 * NOTE: If you do not want to get alarm thresholds, simply pass in an empty array for the `dataStreams`.
 */
export declare const breachedThreshold: ({ value, date, thresholds, dataStreams, dataStream, }: {
    value: Primitive | undefined;
    date: Date;
    thresholds: Threshold[];
    dataStreams: DataStream[];
    dataStream: DataStream;
}) => Threshold | undefined;
