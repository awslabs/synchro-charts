import { D as DATA_ALIGNMENT } from './constants-4b21170a.js';
import { S as StreamType } from './dataConstants-a26ff694.js';
import { b as isDefined } from './predicates-ced25765.js';
import { a as getDataPoints, g as getBreachedThreshold } from './utils-11cae6c8.js';
import { p as pointBisector, g as getDataBeforeDate } from './dataFilters-8fe55407.js';

/**
 * Sorts points in order of their points values.
 * Places objects with no point at the end of the list.
 */
const sortTooltipPoints = (attr) => (a, b) => {
    if (a.point == null && b.point == null) {
        return 0;
    }
    if (a.point == null) {
        return -1;
    }
    if (b.point == null) {
        return 1;
    }
    if (attr(a.point) === attr(b.point)) {
        return 0;
    }
    return attr(b.point) > attr(a.point) ? 1 : -1;
};

/**
 * Closest Points
 *
 * Returns the closest point to the left, and right of a
 * given point in time..
 *
 * @param maxDistance - maximum distance, measured in terms of milliseconds. if not present, there is no max distance.
 */
const closestPoint = (dataPoints, date, dataAlignment, maxDistance) => {
    const idx = pointBisector.left(dataPoints, date);
    const leftPoint = dataPoints[idx - 1];
    const rightPoint = dataPoints[idx];
    /**
     * If a point falls on our point of time, return it immediately regardless of 'data alignment'.
     */
    if (leftPoint && leftPoint.x === date.getTime()) {
        return leftPoint;
    }
    if (rightPoint && rightPoint.x === date.getTime()) {
        return rightPoint;
    }
    /** Right Alignment */
    if (dataAlignment === DATA_ALIGNMENT.RIGHT) {
        if (!rightPoint) {
            return undefined;
        }
        if (maxDistance == null) {
            return rightPoint;
        }
        return rightPoint.x - date.getTime() <= maxDistance ? rightPoint : undefined;
    }
    /** Left Alignment */
    if (dataAlignment === DATA_ALIGNMENT.LEFT) {
        if (!leftPoint) {
            return undefined;
        }
        if (maxDistance == null) {
            return leftPoint;
        }
        return date.getTime() - leftPoint.x <= maxDistance ? leftPoint : undefined;
    }
    /** Either Alignment */
    // If only the left, or only the right point exist, go ahead and just return it.
    if (!leftPoint || !rightPoint) {
        return leftPoint || rightPoint;
    }
    // We are right bias because the interval between two points is the time span for the point on the right.
    return rightPoint;
};
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
const activePoints = ({ viewPort, dataStreams, selectedDate, allowMultipleDates, dataAlignment, maxDurationFromDate, }) => {
    const dataStreamUtilizedData = dataStreams.map(stream => ({
        streamId: stream.id,
        dataPoints: getDataBeforeDate(getDataPoints(stream, stream.resolution), viewPort.end),
    }));
    const selectedTimestamp = selectedDate.getTime();
    // Find the closest point to the selected date for each stream
    const points = dataStreamUtilizedData.map(({ streamId, dataPoints }) => ({
        streamId,
        point: closestPoint(dataPoints, selectedDate, dataAlignment, maxDurationFromDate),
    }));
    if (allowMultipleDates) {
        return points;
    }
    const distanceFromDate = (p) => Math.abs(p.x - selectedTimestamp);
    // Sort in ascending order by there distance from the selected date
    const sortedPoints = points.sort(sortTooltipPoints(distanceFromDate));
    if (sortedPoints.length === 0) {
        return [];
    }
    const topPoint = sortedPoints[sortedPoints.length - 1].point;
    if (topPoint == null) {
        // everything must be a 'blank' point
        return sortedPoints;
    }
    // Filter such that only the points with a date equal to the date of the point which is closest to the selected date.
    return sortedPoints.filter(p => p.point && p.point.x === topPoint.x);
};

const isHigherPriority = (t1, t2) => {
    if (t1 == null) {
        return t2;
    }
    if (t1.severity == null && t2.severity == null) {
        return t1;
    }
    if (t1.severity == null) {
        return t2;
    }
    if (t2.severity == null) {
        return t1;
    }
    return t1.severity <= t2.severity ? t1 : t2;
};
/**
 * Returns the most important threshold.
 *
 * The most important threshold is the visual which is most important to a user
 * This is determined via the `severity`. Lower severity means highest importance.
 *
 * If no thresholds are present with `severity`, the first threshold is returned.
 */
const highestPriorityThreshold = (thresholds) => {
    return thresholds.reduce(isHigherPriority, undefined);
};
/**
 * returns whether the given threshold can be applied to the requested data stream.
 *
 * EXPOSED FOR TESTING
 */
const thresholdAppliesToDataStream = (threshold, dataStreamId) => {
    const { dataStreamIds } = threshold;
    if (dataStreamIds == null) {
        return true;
    }
    return dataStreamIds.includes(dataStreamId);
};
/**
 * Returns all of the breached thresholds for any of the alarms associated with the requested data stream.
 *
 * Does NOT return them in any sort of priority order.
 *
 * EXPOSED FOR TESTING
 */
const breachedAlarmThresholds = ({ date, dataStream, dataStreams, thresholds, }) => {
    const alarmStreamIds = dataStream.associatedStreams != null
        ? dataStream.associatedStreams.filter(({ type }) => type === StreamType.ALARM).map(({ id }) => id)
        : [];
    const isAssociatedAlarm = (stream) => alarmStreamIds.includes(stream.id);
    const alarmStreams = dataStreams.filter(isAssociatedAlarm);
    // thresholds considered breech, across all alarms for the requested data stream
    const allBreachedAlarmThresholds = alarmStreams
        .map(stream => {
        const alarmThresholds = thresholds.filter(threshold => thresholdAppliesToDataStream(threshold, stream.id));
        const latestAlarmValue = closestPoint(stream.data, date, DATA_ALIGNMENT.LEFT);
        return latestAlarmValue != null ? getBreachedThreshold(latestAlarmValue.y, alarmThresholds) : undefined;
    })
        .filter(isDefined);
    return allBreachedAlarmThresholds;
};
/**
 * Get the highest priority breached threshold.
 *
 * NOTE: If you do not want to get alarm thresholds, simply pass in an empty array for the `dataStreams`.
 */
const breachedThreshold = ({ value, date, thresholds, dataStreams, dataStream, }) => {
    const applicableThresholds = thresholds.filter(threshold => thresholdAppliesToDataStream(threshold, dataStream.id));
    const dataThreshold = value != null ? getBreachedThreshold(value, applicableThresholds) : undefined;
    const alarmThresholds = breachedAlarmThresholds({
        date,
        dataStream,
        dataStreams,
        thresholds,
    });
    return highestPriorityThreshold([dataThreshold, ...alarmThresholds].filter(isDefined));
};

export { activePoints as a, breachedThreshold as b, closestPoint as c, sortTooltipPoints as s };
