import { getDistanceFromDuration } from '../common/getDistanceFromDuration';

/**
 * Display Constants
 *
 * Adjust these to scale the margins provided within the bar chart.
 * This represent which fraction of the 'width' of a given bar group a margin.
 */
const MARGIN_FACTOR = 1 / 6;

export const getBarMargin = (toClipSpace: (time: number) => number, resolution: number) =>
  getDistanceFromDuration(toClipSpace, resolution * MARGIN_FACTOR);

/**
 * Get the bar width
 *
 * Returns the clipSpace width which each bar should be.
 * It is assumed that each bar within a group will have the same width.
 */
export const getBarWidth = ({
  toClipSpace,
  resolution,
  numDataStreams,
}: {
  toClipSpace: (time: number) => number;
  numDataStreams: number;
  resolution: number; // milliseconds
}) => {
  return (getDistanceFromDuration(toClipSpace, resolution) - getBarMargin(toClipSpace, resolution)) / numDataStreams;
};
