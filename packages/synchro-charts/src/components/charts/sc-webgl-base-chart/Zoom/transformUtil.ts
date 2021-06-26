import { zoomIdentity, ZoomTransform } from 'd3-zoom';

import { Scale } from '../../common/types';

export const getTransformFromDates = ({
  prevXScale,
  prevDates,
  currDates,
}: {
  prevXScale: Scale;
  prevDates: { start: Date; end: Date };
  currDates: { start: Date; end: Date };
}) => {
  // Determine k, our scaling factor
  const prevTimeSpan = prevDates.end.getTime() - prevDates.start.getTime();
  const currTimeSpan = currDates.end.getTime() - currDates.start.getTime();
  const k = prevTimeSpan / currTimeSpan;
  // Determine t, our translation x-offset
  // since transform(xCurrStartDate) = 0 = xCurrStartDate * k + t => t = -1 * xCurrStartDate * k
  const xCurrStartDate = prevXScale(currDates.start);
  const t = -1 * xCurrStartDate * k;
  return zoomIdentity.translate(t, 0).scale(k); // NOTE: Only supporting x brushing for now.
};

/**
 * Get Transformed Date Range
 * Apply a given transformation to the given date range
 *
 * NOTE: The reason to pass in an `xScale` as opposed to the start and end date directly
 * is that a transform is in terms of the pixel space,
 * rather than the input space (the domain in which the data is in, which is time plus some number value).
 */
export const getTransformedDateRange = ({
  xScale,
  transform,
}: {
  xScale: Scale;
  transform: ZoomTransform;
}): { startDate: Date; endDate: Date } => {
  // Convert our date range to a domain since transformations have a built in function to transform scales.
  const transformedScale = transform.rescaleX(xScale);
  const [startTime, endTime] = transformedScale.domain();
  return {
    startDate: new Date(startTime),
    endDate: new Date(endTime),
  };
};
