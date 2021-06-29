import { DataPoint, MinimalViewPortConfig, Primitive } from '../../../utils/dataTypes';
export declare const pointBisector: import("d3-array").Bisector<DataPoint<Primitive>, unknown>;
/**
 * Get Visible Data
 *
 * Returns the data points which are required for the chart to correctly render.
 * This assumes linear interpolation between points
 * TODO: Support other interpolation methods
 *
 * NOTE: It's possible to have data not in the viewport which is required for the chart to render
 * it's fully visualization correctly. For Instance, even if a point isn't visible in the viewport, it may
 * be used within interpolation to calculate a path between the points which is within the viewport.
 *
 * Different interpolation methods need larger amount of context around the viewport to correctly render
 * the chart visualization.
 */
export declare const getVisibleData: <T extends Primitive>(data: DataPoint<T>[], viewPort: MinimalViewPortConfig, includeBoundaryPoints?: boolean) => DataPoint<T>[];
/**
 * Returns all data before or at the given date.
 *
 * Assumes data is ordered chronologically.
 */
export declare const getDataBeforeDate: <T extends Primitive>(data: DataPoint<T>[], date: Date) => DataPoint<T>[];
