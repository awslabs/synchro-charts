import { ZoomTransform } from 'd3-zoom';
import { Scale } from '../../common/types';
export declare const getTransformFromDates: ({ prevXScale, prevDates, currDates, }: {
    prevXScale: Scale;
    prevDates: {
        start: Date;
        end: Date;
    };
    currDates: {
        start: Date;
        end: Date;
    };
}) => ZoomTransform;
/**
 * Get Transformed Date Range
 * Apply a given transformation to the given date range
 *
 * NOTE: The reason to pass in an `xScale` as opposed to the start and end date directly
 * is that a transform is in terms of the pixel space,
 * rather than the input space (the domain in which the data is in, which is time plus some number value).
 */
export declare const getTransformedDateRange: ({ xScale, transform, }: {
    xScale: Scale;
    transform: ZoomTransform;
}) => {
    startDate: Date;
    endDate: Date;
};
