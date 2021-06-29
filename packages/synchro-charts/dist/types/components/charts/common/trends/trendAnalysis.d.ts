import { Trend, TrendResult } from './types';
import { DataStream, Timestamp, ViewPortConfig } from '../../../../utils/dataTypes';
import { TREND_TYPE } from '../../../../utils/dataConstants';
/**
 * Reads in a data stream and a trend type, then computes the trend result.
 * @param data The data stream over which to compute the trend.
 * @param trendType The type of trend to compute.
 */
export declare const computeTrendResult: (dataStream: DataStream<number>, trendType: TREND_TYPE) => TrendResult | null;
/**
 * Computes trend results for all requested trends using the data in the provided viewport (including boundary points).
 */
export declare const getAllTrendResults: (viewPort: ViewPortConfig, dataStreams: DataStream<number>[], trends: Trend[]) => TrendResult[];
/**
 * Calculates the value of the given trend result at the requested date.
 */
export declare const getTrendValue: (trendResult: TrendResult, timestamp: Timestamp) => number;
