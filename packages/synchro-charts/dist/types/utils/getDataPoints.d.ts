import { DataPoint, DataStream, Primitive, Resolution } from './dataTypes';
/**
 * Get the points for a given resolution from a data stream
 */
export declare const getDataPoints: <T extends Primitive>(stream: DataStream<T>, resolution: Resolution) => DataPoint<T>[];
