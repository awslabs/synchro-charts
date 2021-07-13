import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { SECOND_IN_MS} from '../../../utils/time';
import { DataType } from '../../../utils/dataConstants';

const NUM_OF_BUCKETS = 10;

export type HeatValueMap = {
  [xBucketRangeStart: number]: {
    [bucketIndex: number]: {
      totalCount: number;
      [streamId: string]: number;
    };
  };
};

export const calculateBucketIndex = ({
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
  dataStreamId,
}: {
  oldHeatValue: HeatValueMap,
  xBucketRangeStart: number,
  bucketIndex: number,
  dataStreamId: string
}): HeatValueMap => {
  // deep copy of oldHeatValue to newHeatValue
  if (!dataStreamId) {
    return {};
  }
  const newHeatValue: HeatValueMap = JSON.parse(JSON.stringify(oldHeatValue));
  newHeatValue[xBucketRangeStart] = newHeatValue[xBucketRangeStart] ?? {};
  newHeatValue[xBucketRangeStart][bucketIndex] = newHeatValue[xBucketRangeStart][bucketIndex] ?? { totalCount: 0 };
  newHeatValue[xBucketRangeStart][bucketIndex][dataStreamId] =
    newHeatValue[xBucketRangeStart][bucketIndex][dataStreamId] ?? 0;
  newHeatValue[xBucketRangeStart][bucketIndex][dataStreamId] += 1;
  newHeatValue[xBucketRangeStart][bucketIndex].totalCount += 1;
  return newHeatValue;
};

/**
 * Iterates through the points of all the datastreams and find the x-axis bucket of each data point.
 * @param heatValue Given HeatValueMap object, default is an empty map but otherwise used so that some
 * buckets possibly don't have to be recalculated.
 * @param dataStreams DataStream array object that's passed into Mesh.
 * @param resolution Resolution of the graph's view.
 * @param viewPort ViewPort object
 * @returns Updated HeatValueMap with the aggregated data from the dataStreams.
 */
export const calcHeatValues = ({
  oldHeatValue = {},
  dataStreams,
  resolution,
  viewPort,
}:{
  oldHeatValue: HeatValueMap;
  dataStreams: DataStream[];
  resolution: number;
  viewPort: ViewPort;
}) => {
  if (dataStreams[0].dataType != DataType.NUMBER) {
    return {};
  }
  // if resolution is 0 then set the XAxisBucketRange to be 1 second
  const xAxisBucketRange = resolution === 0 ? SECOND_IN_MS : resolution;
  let tempStartTime = dataStreams[0].data[0].x;
  dataStreams.forEach(dataStream => {
    if (dataStream.data[0].x < tempStartTime) {
      const tempStartTime = dataStream.data[0].x;
    }
  });
  const startTime = Math.floor(tempStartTime / xAxisBucketRange) * xAxisBucketRange;
  const yMax = viewPort.yMax;
  const yMin = viewPort.yMin;
  return dataStreams.reduce(
    function(newHeatValue, dataStream) {
      let nextTimeStamp = startTime + xAxisBucketRange;
      return dataStream.data.reduce(
        function(newHeatValue, currPoint) {
          while (currPoint.x > nextTimeStamp) {
            nextTimeStamp += xAxisBucketRange;
          }
          const xBucketRangeStart = nextTimeStamp - xAxisBucketRange;
          const bucketIndex = calculateBucketIndex({yValue: currPoint.y, yMax, yMin, bucketCount: NUM_OF_BUCKETS});
          if (newHeatValue) {
            newHeatValue = addCount({oldHeatValue: newHeatValue, xBucketRangeStart, bucketIndex, dataStreamId: dataStream.id});
          } else {
            newHeatValue = addCount({oldHeatValue, xBucketRangeStart, bucketIndex, dataStreamId: dataStream.id});
          }
          return newHeatValue;
        },
        {}
      )
    },
    {}
  )
  return newHeatValue;
};
