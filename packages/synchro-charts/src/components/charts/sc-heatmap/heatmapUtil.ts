import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { SECOND_IN_MS } from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';

const NUM_OF_BUCKETS = 10;

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
}): number => Math.ceil(((yValue - yMin) / (yMax - yMin)) * bucketCount);

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
  viewPort,
}: {
  oldHeatValue: HeatValueMap;
  dataStreams: DataStream[];
  resolution: number;
  viewPort: ViewPort;
}) => {
  if (dataStreams[0].dataType !== DataType.NUMBER) {
    return {};
  }
  // if resolution is 0 then set the XAxisBucketRange to be 1 second
  const xAxisBucketRange = resolution === 0 ? SECOND_IN_MS : resolution;
  const { yMax, yMin } = viewPort;
  return dataStreams.reduce(function reduceDataStream(newHeatValue, dataStream) {
    return dataStream.data.reduce(function reduceData(tempHeatValue, currPoint) {
      const xBucketRangeStart = calculateXBucketStart({ xValue: currPoint.x, xAxisBucketRange });
      const bucketIndex = calculateBucketIndex({
        yValue: currPoint.y as number, // checked in line 85 if the data value is number
        yMax,
        yMin,
        bucketCount: NUM_OF_BUCKETS,
      });
      return addCount({ heatValue: tempHeatValue, xBucketRangeStart, bucketIndex, dataStreamId: dataStream.id });
    }, newHeatValue);
  }, oldHeatValue);
};
