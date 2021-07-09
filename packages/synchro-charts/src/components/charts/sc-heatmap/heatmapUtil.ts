import { DataStream, DataPoint } from '../../../utils/dataTypes';
import { SECOND_IN_MS, MONTH_IN_MS, DAY_IN_MS } from '../../../utils/time';
import { } from '../common/tests/chart/constants';

export type HeatValueMap = {
  [xBucketRangeStart: number]: {
    [bucketIndex: number]: {
      totalCount: number;
      [streamName: string]: number;
    };
  };
};

const calculateBucketIndex = ({
  yValue,
  yMax,
  yMin,
  bucketCount
}: {
  yValue: number;
  yMax: number;
  yMin: number;
  bucketCount: number;
  }): number =>
  Math.ceil(((yValue - yMin) / (yMax - yMin)) * bucketCount);

/**
 * Keeps track of the total number of data points within a point's respective bucket and
 * datastream name.
 * @param oldHeatValue HeatValueMap object with the previous heatValues.
 * @param xBucketRangeStart Lower end of the x-axis bucket range.
 * @param bucketIndex Index of the bucket that the point resides in based on its y-value.
 * @param dataStreamName Name of the point's datastream.
 * @returns Updated HeatValueMap object with the new data added -- not destructive.
 * @source deep copy: https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
 */
export const addCount = ({
  oldHeatValue = {},
  xBucketRangeStart,
  bucketIndex,
  dataStreamName,
}: {
  oldHeatValue: HeatValueMap,
  xBucketRangeStart: number,
  bucketIndex: number,
  dataStreamName: string
}): HeatValueMap => {
  // deep copy of oldHeatValue to newHeatValue
  if (!dataStreamName) {
    return {};
  }
  const newHeatValue: HeatValueMap = JSON.parse(JSON.stringify(oldHeatValue));
  newHeatValue[xBucketRangeStart] = newHeatValue[xBucketRangeStart] ?? {};
  newHeatValue[xBucketRangeStart][bucketIndex] = newHeatValue[xBucketRangeStart][bucketIndex] ?? { totalCount: 0 };
  newHeatValue[xBucketRangeStart][bucketIndex][dataStreamName] =
    newHeatValue[xBucketRangeStart][bucketIndex][dataStreamName] ?? 0;
  newHeatValue[xBucketRangeStart][bucketIndex][dataStreamName] += 1;
  newHeatValue[xBucketRangeStart][bucketIndex].totalCount += 1;
  return newHeatValue;
};

/**
 * Iterates through the points of all the datastreams and find the x-axis bucket of each data point.
 * @param heatValue Given HeatValueMap object, default is an empty map but otherwise used so that some
 * buckets possibly don't have to be recalculated.
 * @param dataStreams DataStream array object that's passed into Mesh.
 * @param resolution Resolution of the graph's view.
 * @param startTime Left most value on the x-axis.
 * @param endTime Right most value on the x-axis.
 * @param yMax Maximum y-value on the y-axis.
 * @param yMin Minimum y-value on the y-axis.
 * @returns Updated HeatValueMap with the aggregated data from the dataStreams.
 */
export const calcHeatValues = ({
  oldHeatValue = {},
  dataStreams,
  resolution,
  startTime,
  endTime,
  yMax,
  yMin
}:{
  oldHeatValue: HeatValueMap;
  dataStreams: DataStream[];
  resolution: number;
  startTime: number;
  endTime: number;
  yMax: number;
  yMin: number;
}) => {
  let newHeatValue: HeatValueMap = {};
  // if resolution is 0 then set the XAxisBucketRange to be 1 second
  const XAxisBucketRange = resolution === 0 ? SECOND_IN_MS : resolution;
  dataStreams.forEach(dataStream => {
    let nextTimeStamp = startTime + XAxisBucketRange;
    dataStream.data.forEach(point => {
      const { x, y } = point;
      if (typeof y === 'string') {
        return;
      }
      while (x > nextTimeStamp && nextTimeStamp < endTime) {
        nextTimeStamp += XAxisBucketRange;
      }
      // acts the same as continue in a forEach loop
      if (nextTimeStamp > endTime) {
        return;
      }
      const xBucketRangeStart = nextTimeStamp - XAxisBucketRange;
      const bucketIndex = calculateBucketIndex({yValue: y, yMax, yMin, bucketCount: 10});
      if (newHeatValue) {
        oldHeatValue = newHeatValue;
        newHeatValue = addCount({oldHeatValue, xBucketRangeStart, bucketIndex, dataStreamName: dataStream.name});
      } else {
        newHeatValue = addCount({oldHeatValue, xBucketRangeStart, bucketIndex, dataStreamName: dataStream.name});
      }
    });
  });
  return newHeatValue;
};
