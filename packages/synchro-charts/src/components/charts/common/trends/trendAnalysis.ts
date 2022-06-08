import { LinearRegressionResult, Trend, TrendResult } from './types';
import { getVisibleData } from '../dataFilters';
import { getDataPoints } from '../../../../utils/getDataPoints';
import { AggregateType, DataStream, Timestamp, ViewPortConfig } from '../../../../utils/dataTypes';
import { TREND_TYPE } from '../../../../utils/dataConstants';

/**
 * Determines the ideal least-squares line of best fit over a given data set.
 * @param data The data stream over which to compute the linear regression.
 */
const linearRegression = (data: DataStream<number>): LinearRegressionResult | null => {
  const dataPoints = data.data;
  const len = dataPoints.length;
  if (len === 0) {
    return null;
  }

  const startDate = dataPoints[0].x;

  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumXY = 0;

  for (let i = 0; i < len; i += 1) {
    const { x, y } = dataPoints[i];
    const time = x - startDate;
    sumX += time;
    sumY += y;
    sumXX += time * time;
    sumXY += time * y;
  }

  const run = len * sumXX - sumX * sumX;
  const rise = len * sumXY - sumX * sumY;
  const gradient = run === 0 ? 0 : rise / run;
  const intercept = sumY / len - (gradient * sumX) / len;

  return {
    type: TREND_TYPE.LINEAR,
    dataStreamId: data.id,
    equation: { gradient, intercept },
    startDate: new Date(startDate),
  };
};

/**
 * Reads in a data stream and a trend type, then computes the trend result.
 * @param data The data stream over which to compute the trend.
 * @param trendType The type of trend to compute.
 */
export const computeTrendResult = (dataStream: DataStream<number>, trendType: TREND_TYPE): TrendResult | null => {
  switch (trendType) {
    case TREND_TYPE.LINEAR:
      return linearRegression(dataStream);
    default:
      /* eslint-disable-next-line no-console */
      console.error(`Unable to compute trend result for trend type '${trendType}'.`);
      return null;
  }
};

/**
 * Computes trend results for all requested trends using the data in the provided viewport (including boundary points).
 */
export const getAllTrendResults = (
  viewport: ViewPortConfig,
  dataStreams: DataStream<number>[],
  trends: Trend[]
): TrendResult[] => {
  const trendResults: TrendResult[] = [];
  dataStreams.forEach(stream => {
    const { id } = stream;
    const firstAggregateType = stream.aggregateTypes !== undefined ? stream.aggregateTypes[0] : AggregateType.AVERAGE;
    const dataPoints = getDataPoints(stream, stream.resolution, firstAggregateType);

    // only compute a trend line if there are at least two visible and/or boundary data points, the reason being that
    // a trend line based on a single point of data has no informational value and may actually be misleading
    const dataInViewport = getVisibleData(dataPoints, viewport);
    if (dataInViewport.length >= 2) {
      trends
        .filter(({ dataStreamId }) => id === dataStreamId)
        .forEach(({ type, color }) => {
          const trendResult = computeTrendResult({ ...stream, data: dataInViewport }, type);
          if (trendResult) {
            trendResults.push({ ...trendResult, color });
          }
        });
    }
  });

  return trendResults;
};

/**
 * Calculates the value of the given trend result at the requested date.
 */
export const getTrendValue = (trendResult: TrendResult, timestamp: Timestamp): number => {
  switch (trendResult.type) {
    case TREND_TYPE.LINEAR:
      return (
        (timestamp - trendResult.startDate.getTime()) * trendResult.equation.gradient + trendResult.equation.intercept
      );
    default:
      throw new Error(
        `Cannot compute trend value for trend of type '${trendResult.type}' on data stream ${trendResult.dataStreamId}.`
      );
  }
};
