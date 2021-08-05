import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { SECOND_IN_MS, MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS, MONTH_IN_MS, YEAR_IN_MS } from '../../../utils/time';
import { CHANGE_X_BUCKET_RANGE_AT } from './heatmapConstants';
import { isNumberDataStream } from '../../../utils/predicates';

export type HeatValueMap = {
  maxHeatValue: number;
  minHeatValue: number;
  [xBucketRangeStart: number]: {
    [bucketIndex: number]: {
      bucketHeatValue: number;
      streamCount: {
        [streamId: string]: number;
      };
    };
  };
};

export const calculateBucketIndex = ({
  yValue,
  yMax,
  yMin,
  bucketCount,
}: {
  yValue: number;
  yMax: number;
  yMin: number;
  bucketCount: number;
}): number => Math.abs(Math.floor(((yValue - yMin) / (yMax - yMin)) * bucketCount));

export const calculateXBucketStart = ({ xValue, xBucketRange }: { xValue: number; xBucketRange: number }): number =>
  Math.floor(xValue / xBucketRange) * xBucketRange;

/**
 * Keeps track of the total number of data points within a point's respective bucket and
 * datastream name.
 */
export const addCount = ({
  heatValues,
  xBucketRangeStart,
  bucketIndex,
  dataStreamId,
}: {
  heatValues: HeatValueMap;
  xBucketRangeStart: number;
  bucketIndex: number;
  dataStreamId: string;
}): HeatValueMap => {
  if (!dataStreamId) {
    return { maxHeatValue: 0, minHeatValue: Infinity };
  }
  const newHeatValues: HeatValueMap = heatValues;
  newHeatValues[xBucketRangeStart] = heatValues[xBucketRangeStart] ?? {};
  newHeatValues[xBucketRangeStart][bucketIndex] = heatValues[xBucketRangeStart][bucketIndex] ?? {
    bucketHeatValue: 0,
    streamCount: {},
  };
  newHeatValues[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] =
    heatValues[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] ?? 0;
  newHeatValues[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] += 1;
  newHeatValues[xBucketRangeStart][bucketIndex].bucketHeatValue += 1;
  return heatValues;
};

/**
 * Iterates through the heatValue and finds the minimum and maximum heat value out of all the buckets.
 */
export const calculateMinMaxHeatValue = (heatValues: HeatValueMap): HeatValueMap => {
  const newHeatValues: HeatValueMap = heatValues;
  Object.values(newHeatValues).forEach(xBucket => {
    Object.values(xBucket).forEach(bucket => {
      newHeatValues.minHeatValue = Math.min(newHeatValues.minHeatValue, bucket.bucketHeatValue);
      newHeatValues.maxHeatValue = Math.max(newHeatValues.maxHeatValue, bucket.bucketHeatValue);
    });
  });
  return newHeatValues;
};

/**
 * Iterates through the points of all the datastreams and find the x-axis bucket of each data point.
 * returns updated HeatValueMap with the aggregated data from the dataStreams.
 */
export const calcHeatValues = ({
  oldHeatValues = { maxHeatValue: 0, minHeatValue: Infinity },
  dataStreams,
  xBucketRange,
  viewport,
  bucketCount,
}: {
  oldHeatValues?: HeatValueMap;
  dataStreams: DataStream[];
  xBucketRange: number;
  viewport: ViewPort;
  bucketCount: number;
}) => {
  const { yMax, yMin } = viewport;
  return calculateMinMaxHeatValue(
    dataStreams.filter(isNumberDataStream).reduce(function reduceDataStream(newHeatValues, dataStream) {
      return dataStream.data.reduce(function reduceData(tempHeatValues, currPoint) {
        const xBucketRangeStart = calculateXBucketStart({ xValue: currPoint.x, xBucketRange });
        const bucketIndex = calculateBucketIndex({
          yValue: currPoint.y,
          yMax,
          yMin,
          bucketCount,
        });
        return addCount({ heatValues: tempHeatValues, xBucketRangeStart, bucketIndex, dataStreamId: dataStream.id });
      }, newHeatValues);
    }, oldHeatValues)
  );
};

export const getXBucketRange = ({ start, end }: { start: Date; end: Date }): number => {
  const duration = end.getTime() - start.getTime();
  if (duration > YEAR_IN_MS) {
    return YEAR_IN_MS;
  }
  if (duration > 90 * DAY_IN_MS) {
    return MONTH_IN_MS;
  }
  if (duration > CHANGE_X_BUCKET_RANGE_AT * 2 * DAY_IN_MS) {
    return DAY_IN_MS;
  }
  if (duration > CHANGE_X_BUCKET_RANGE_AT * HOUR_IN_MS) {
    return HOUR_IN_MS;
  }
  if (duration > CHANGE_X_BUCKET_RANGE_AT * MINUTE_IN_MS) {
    return MINUTE_IN_MS;
  }
  return SECOND_IN_MS;
};

export const displayDate = (
  dates: { startDate: Date; endDate: Date },
  { start, end }: { start: Date; end: Date }
): string => {
  const viewportDurationMS = end.getTime() - start.getTime();
  const { startDate: xBucketRangeStart, endDate: xBucketRangeEnd } = dates;
  if (viewportDurationMS < MINUTE_IN_MS) {
    return `${xBucketRangeStart.toLocaleString('en-US', {
      minute: 'numeric',
      second: 'numeric',
    })} - ${xBucketRangeEnd.toLocaleString('en-US', {
      minute: 'numeric',
      second: 'numeric',
    })}`;
  }

  if (viewportDurationMS <= 10 * MINUTE_IN_MS) {
    return `${xBucketRangeStart.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    })} - ${xBucketRangeEnd.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    })}`;
  }

  if (viewportDurationMS <= HOUR_IN_MS) {
    return `${xBucketRangeStart.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })} - ${xBucketRangeEnd.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })}`;
  }

  if (viewportDurationMS <= 7 * DAY_IN_MS) {
    return `${xBucketRangeStart.toLocaleString('en-US', {
      month: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      hour12: true,
    })} - ${xBucketRangeEnd.toLocaleString('en-US', {
      month: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      hour12: true,
    })}`;
  }

  return `${xBucketRangeStart.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })} - ${xBucketRangeEnd.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })}`;
};

export const shouldRerenderOnViewportChange = ({
  oldViewport,
  newViewport,
}: {
  oldViewport: ViewPort;
  newViewport: ViewPort;
}): boolean => {
  const { yMin: prevYMin, yMax: prevYMax, start: prevStart, end: prevEnd } = oldViewport;
  const { yMin: newYMin, yMax: newYMax, start: newStart, end: newEnd } = newViewport;

  if (prevYMin !== newYMin || prevYMax !== newYMax) {
    return true;
  }

  const prevXBucketRange = getXBucketRange({ start: prevStart, end: prevEnd });
  const newXBucketRange = getXBucketRange({ start: newStart, end: newEnd });
  return prevXBucketRange !== newXBucketRange;
};
