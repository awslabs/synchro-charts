import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { SECOND_IN_MS, MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS } from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';

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
}: {
  yValue: number;
  yMax: number;
  yMin: number;
}): number => {
  if (yValue === 0 && yMin === 0) {
    return 1;
  }
  return Math.ceil(((yValue - yMin) / (yMax - yMin)) * 10);
};

export const calculateXBucketStart = ({
  xValue,
  xAxisBucketRange,
}: {
  xValue: number;
  xAxisBucketRange: number;
}): number => Math.floor(xValue / xAxisBucketRange) * xAxisBucketRange;

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
  const newHeatValue = heatValue;
  newHeatValue[xBucketRangeStart] = heatValue[xBucketRangeStart] ?? {};
  newHeatValue[xBucketRangeStart][bucketIndex] = heatValue[xBucketRangeStart][bucketIndex] ?? {
    totalCount: 0,
    streamCount: {},
  };
  newHeatValue[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] =
    heatValue[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] ?? 0;
  newHeatValue[xBucketRangeStart][bucketIndex].streamCount[dataStreamId] += 1;
  newHeatValue[xBucketRangeStart][bucketIndex].totalCount += 1;
  return newHeatValue;
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
}: {
  oldHeatValue: HeatValueMap;
  dataStreams: DataStream[];
  resolution: number;
  viewport: ViewPort;
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
      });
      return addCount({ heatValue: tempHeatValue, xBucketRangeStart, bucketIndex, dataStreamId: dataStream.id });
    }, newHeatValue);
  }, oldHeatValue);
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
