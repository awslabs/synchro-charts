import { DataPoint, DataStream, Primitive } from '../../../utils/dataTypes';
import { DATA_ALIGNMENT } from '../common/constants';
export declare type ActivePoint<T extends Primitive> = {
    streamId: string;
    label?: string;
    point?: DataPoint<T>;
};
/**
 * To differentiate between points that come from data streams and points that come from trend lines
 */
export declare const enum POINT_TYPE {
    DATA = "data",
    TREND = "trend"
}
export declare type ActivePointWithType<T extends Primitive> = ActivePoint<T> & {
    type: POINT_TYPE;
};
/**
 * Closest Points
 *
 * Returns the closest point to the left, and right of a
 * given point in time..
 *
 * @param maxDistance - maximum distance, measured in terms of milliseconds. if not present, there is no max distance.
 */
export declare const closestPoint: <T extends Primitive>(dataPoints: DataPoint<T>[], date: Date, dataAlignment: DATA_ALIGNMENT, maxDistance?: number | undefined) => DataPoint<T> | undefined;
/**
 * Get Active Points
 *
 * Returns at most one point per data stream - for each data stream, it finds the point which is
 * 1. within the given view port
 * 2. closest to the provided `selectedDate`
 *
 * Additionally, if `allowMultipleDates` is false, it will only return the points which are the closest
 * to the `selectedDate`. i.e. if you have 10 points that are all equally distant from the `selectedDate`,
 * all 10 are returned.
 *
 * However if you have 10 points of different dates, only the closest point would be returned.
 */
export declare const activePoints: <T extends Primitive>({ viewPort, dataStreams, selectedDate, allowMultipleDates, dataAlignment, maxDurationFromDate, }: {
    viewPort: {
        start: Date;
        end: Date;
    };
    dataStreams: DataStream<T>[];
    selectedDate: Date;
    allowMultipleDates: boolean;
    dataAlignment: DATA_ALIGNMENT;
    maxDurationFromDate?: number | undefined;
}) => ActivePoint<T>[];
