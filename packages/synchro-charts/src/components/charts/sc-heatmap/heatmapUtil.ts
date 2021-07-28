import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { SECOND_IN_MS, MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS, MONTH_IN_MS, YEAR_IN_MS } from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';
import { CHANGE_X_BUCKET_RANGE_BOUNDARY } from './heatmapConstants';

export type HeatValueMap = {
  [xBucketRangeStart: number]: {
    [bucketIndex: number]: {
      totalCount: number;
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
  heatValue = {},
  xBucketRangeStart,
  bucketIndex,
  dataStreamId,
}: {
  heatValue: HeatValueMap;
  xBucketRangeStart: number;
  bucketIndex: number;
  dataStreamId: string;
}): HeatValueMap => {
  if (!dataStreamId) {
    return {};
  }
  const newHeatValue: HeatValueMap = heatValue;
  newHeatValue[xBucketRangeStart] = heatValue[xBucketRangeStart] ?? {};
  newHeatValue[xBucketRangeStart][bucketIndex] = heatValue[xBucketRangeStart][bucketIndex] ?? {
    totalCount: 0,
    streamCount: {},
  };
  newHeatValue[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] =
    heatValue[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] ?? 0;
  newHeatValue[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] += 1;
  newHeatValue[xBucketRangeStart][bucketIndex].totalCount += 1;
  return heatValue;
};

/**
 * Iterates through the points of all the datastreams and find the x-axis bucket of each data point.
 * returns updated HeatValueMap with the aggregated data from the dataStreams.
 */
export const calcHeatValues = ({
  oldHeatValue = {},
  dataStreams,
  xBucketRange,
  viewport,
  bucketCount,
}: {
  oldHeatValue: HeatValueMap;
  dataStreams: DataStream[];
  xBucketRange: number;
  viewport: ViewPort;
  bucketCount: number;
}) => {
  const { yMax, yMin } = viewport;
  return dataStreams.reduce(function reduceDataStream(newHeatValue, dataStream) {
    if (dataStream.dataType !== DataType.NUMBER) {
      return {};
    }
    return dataStream.data.reduce(function reduceData(tempHeatValue, currPoint) {
      const xBucketRangeStart = calculateXBucketStart({ xValue: currPoint.x, xBucketRange });
      const bucketIndex = calculateBucketIndex({
        yValue: currPoint.y as number, // checked in line 85 if the data value is number
        yMax,
        yMin,
        bucketCount,
      });
      return addCount({ heatValue: tempHeatValue, xBucketRangeStart, bucketIndex, dataStreamId: dataStream.id });
    }, newHeatValue);
  }, oldHeatValue);
};

export const getXBucketRange = ({ start, end }: { start: Date; end: Date }): number => {
  const duration = end.getTime() - start.getTime();
  if (duration > YEAR_IN_MS) {
    return YEAR_IN_MS;
  }
  if (duration > 90 * DAY_IN_MS) {
    return MONTH_IN_MS;
  }
  if (duration > CHANGE_X_BUCKET_RANGE_BOUNDARY * 2 * DAY_IN_MS) {
    return DAY_IN_MS;
  }
  if (duration > CHANGE_X_BUCKET_RANGE_BOUNDARY * HOUR_IN_MS) {
    return HOUR_IN_MS;
  }
  if (duration > CHANGE_X_BUCKET_RANGE_BOUNDARY * MINUTE_IN_MS) {
    return MINUTE_IN_MS;
  }
  return SECOND_IN_MS;
};

export const displayDate = (dates: Date[], { start, end }: { start: Date; end: Date }): string => {
  const viewportDurationMS = end.getTime() - start.getTime();
  const [xBucketRangeStart, xBucketRangeEnd] = dates;
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
  if (prevXBucketRange !== newXBucketRange) {
    return true;
  }
  return false;
};
