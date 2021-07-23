import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { SECOND_IN_MS, MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS } from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';
import { BUCKET_COUNT, CHANGE_RESOLUTION, Y_RANGE_BOUNDARY } from './heatmapConstants';

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
}): number => {
  // if a point is 0 then put it in the first bucket instead of zeroth
  if (yValue === 0 && yMin === 0) {
    return 1;
  }
  return Math.abs(Math.ceil(((yValue - yMin) / (yMax - yMin)) * bucketCount));
};

export const calculateXBucketStart = ({
  xValue,
  xAxisBucketRange,
}: {
  xValue: number;
  xAxisBucketRange: number;
}): number => {
  if (xAxisBucketRange === SECOND_IN_MS) {
    return xValue;
  }
  return Math.floor(xValue / xAxisBucketRange) * xAxisBucketRange;
};

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
  resolution,
  viewport,
  bucketCount,
}: {
  oldHeatValue: HeatValueMap;
  dataStreams: DataStream[];
  resolution: number;
  viewport: ViewPort;
  bucketCount: number;
}) => {
  // if resolution is 0 then set the XAxisBucketRange to be 1 second
  const xAxisBucketRange = resolution === 0 ? SECOND_IN_MS : resolution;
  const { yMax, yMin } = viewport;
  return dataStreams.reduce(function reduceDataStream(newHeatValue, dataStream) {
    if (dataStream.dataType !== DataType.NUMBER) {
      return {};
    }
    return dataStream.data.reduce(function reduceData(tempHeatValue, currPoint) {
      const xBucketRangeStart = calculateXBucketStart({ xValue: currPoint.x, xAxisBucketRange });
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

export const getResolution = ({ start, end }: { start: Date; end: Date }): number => {
  const duration = end.getTime() - start.getTime();
  if (duration > (CHANGE_RESOLUTION + 1) * DAY_IN_MS) {
    return DAY_IN_MS;
  }
  if (duration > CHANGE_RESOLUTION * HOUR_IN_MS) {
    return HOUR_IN_MS;
  }
  if (duration > CHANGE_RESOLUTION * MINUTE_IN_MS) {
    return MINUTE_IN_MS;
  }
  return SECOND_IN_MS;
};

export const displayDate = (date: Date, resolution: number, { start, end }: { start: Date; end: Date }): string => {
  const viewportDurationMS = end.getTime() - start.getTime();
  const xBucketRangeStart = new Date(calculateXBucketStart({ xValue: date.getTime(), xAxisBucketRange: resolution }));
  const xBucketRangeEnd = new Date(xBucketRangeStart.getTime() + resolution);
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

export const yShouldRerender = ({
  prevYMin,
  prevYMax,
  newYMin,
  newYMax,
}: {
  prevYMin: number;
  prevYMax: number;
  newYMin: number;
  newYMax: number;
}): boolean => {
  const prevYRange = prevYMax - prevYMin;
  const yBoundary = (prevYRange / BUCKET_COUNT) * Y_RANGE_BOUNDARY;
  if (Math.abs(prevYMin - newYMin) > yBoundary || Math.abs(prevYMax - newYMax) > yBoundary) {
    return true;
  }
  return false;
};

export const xShouldRerender = ({
  prevStart,
  prevEnd,
  newStart,
  newEnd,
}: {
  prevStart: Date;
  prevEnd: Date;
  newStart: Date;
  newEnd: Date;
}): boolean => {
  const prevXBucketRange = getResolution({ start: prevStart, end: prevEnd });
  const newXBucketRange = getResolution({ start: newStart, end: newEnd });
  if (prevXBucketRange !== newXBucketRange) {
    return true;
  }
  return false;
};
