import { DataStream, DataPoint } from '../../../utils/dataTypes';

export type HeatValueMap = {
  [xBucketRangeStart: number]: {
    [bucketIndex: number]: {
      totalCount: number;
      [streamName: string]: number;
    };
  };
};

const calculateBucketIndex = (yValue: number, yMax: number, yMin: number, bucketCount: number): number => {
  return Math.ceil(((yValue - yMin) / (yMax - yMin)) * bucketCount);
};

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
export const addCount = (
  oldHeatValue: HeatValueMap = {},
  xBucketRangeStart: number,
  bucketIndex: number,
  dataStreamName: string
): HeatValueMap => {
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
 * Finds the data point's respective bucket index.
 * @param oldHeatValue HeatValueMap object with the previous heatValues.
 * @param dataPoint DataPoint object with the x and y values of the point.
 * @param xBucketRangeStart Index of the bucket that the point resides in based on its y-value.
 * @param yMax Maximum y-value on the y-axis.
 * @param yMin Minimum y-value on the y-axis.
 * @param dataStreamName Name of the datastream that the point belongs to.
 * @returns Updated HeatValueMap object with the new data added -- not destructive.
 */
const countFunc = (
  oldHeatValue: HeatValueMap,
  dataPoint: DataPoint,
  xBucketRangeStart: number,
  yMax: number,
  yMin: number,
  dataStreamName: string,
): HeatValueMap => {
  const { y } = dataPoint;
  const bucketIndex = calculateBucketIndex(parseInt(y.toString(), 10), yMax, yMin, 10);
  return addCount(oldHeatValue, xBucketRangeStart, bucketIndex, dataStreamName);
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
export const calcHeatValues = (
  heatValue: HeatValueMap = {},
  dataStreams: DataStream[],
  resolution: number,
  startTime: number,
  endTime: number,
  yMax: number,
  yMin: number,
) => {
  let newHeatValue: HeatValueMap = {};
  const XAxisBucketRange = resolution === 0 ? 1000 : resolution;
  dataStreams.forEach(dataStream => {
    let nextTimeStamp = startTime + XAxisBucketRange;
    dataStream.data.forEach(point => {
      const { x } = point;
      while (x > nextTimeStamp && nextTimeStamp < endTime) {
        nextTimeStamp += XAxisBucketRange;
      }
      // acts the same as continue in a forEach loop
      if (nextTimeStamp > endTime) {
        return;
      }
      const currXBucketRangeStart = nextTimeStamp - XAxisBucketRange;
      if (newHeatValue) {
        newHeatValue = countFunc(newHeatValue, point, currXBucketRangeStart, yMax, yMin, dataStream.name);
      } else {
        newHeatValue = countFunc(heatValue, point, currXBucketRangeStart, yMax, yMin, dataStream.name);
      }
    });
  });
  return newHeatValue;
};
