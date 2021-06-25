import { DataStream, Primitive, ViewPort } from '../../../../utils/dataTypes';
import { TREND_TYPE } from '../../../../utils/dataConstants';

interface BaseTrend {
  type: TREND_TYPE;
  dataStreamId: string;
  color?: string;
}

interface LinearRegression extends BaseTrend {
  type: TREND_TYPE.LINEAR;
}

// this will be a discriminated union once more trend types are added
export type Trend = LinearRegression;

/**
 * trend result types
 */
interface BaseTrendResult {
  type: TREND_TYPE;
  dataStreamId: string;
  color?: string;
}

export interface LinearRegressionResult extends BaseTrendResult {
  type: TREND_TYPE.LINEAR;
  equation: { gradient: number; intercept: number };
  startDate: Date;
}

// this will be a discriminated union once more regression types are added
export type TrendResult = LinearRegressionResult;

/**
 * trend line rendering options
 */
export type RenderTrendLinesOptions = {
  container: SVGElement;
  viewPort: ViewPort;
  size: { width: number; height: number };
  dataStreams: DataStream<Primitive>[];
  trendResults: TrendResult[];
};
