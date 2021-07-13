import { getCSSColorByString } from '../sc-webgl-base-chart/utils';
import { getDistanceFromDuration } from '../common/getDistanceFromDuration';

/**
 * Display Constants
 *
 * Adjust these to scale the margins provided within the bar chart.
 * This represent which fraction of the 'width' of a given bar group a margin.
 */
const MARGIN_FACTOR = 1 / 6;

const SEQUENTIAL_OPACITIES = [0.2, 0.4, 0.6, 0.8, 1.0, 0.2, 0.4, 0.6];
const NUM_OF_COLORS_SEQUENTIAL = 8;
const SEQUENTIAL_BASE_COLOR_INDEX = 5;

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

export const getSequential = (minColor: string, maxColor: string): number[][] => {
  const heatmapR: number[] = [];
  const heatmapG: number[] = [];
  const heatmapB: number[] = [];
  let i = 0;

  const minColorRGB = getCSSColorByString(minColor);
  const maxColorRGB = getCSSColorByString(maxColor);

  while (i < NUM_OF_COLORS_SEQUENTIAL) {
    const opacity = SEQUENTIAL_OPACITIES[i];
    if (i < SEQUENTIAL_BASE_COLOR_INDEX) {
      heatmapR[i] = opacity * maxColorRGB[0] + (1 - opacity) * minColorRGB[0];
      heatmapG[i] = opacity * maxColorRGB[1] + (1 - opacity) * minColorRGB[1];
      heatmapB[i] = opacity * maxColorRGB[2] + (1 - opacity) * minColorRGB[2];
    } else {
      heatmapR[i] = maxColorRGB[0] * (1 - opacity);
      heatmapG[i] = maxColorRGB[1] * (1 - opacity);
      heatmapB[i] = maxColorRGB[2] * (1 - opacity);
    }
    i++;
  }

  return [heatmapR, heatmapG, heatmapB];
};

export const getBucketColor = (colorArray: number[][], countInBucket: number, totalPossiblePoints: number): number[] => {
  if (countInBucket >= totalPossiblePoints) {
    return [
      colorArray[0][NUM_OF_COLORS_SEQUENTIAL - 1],
      colorArray[1][NUM_OF_COLORS_SEQUENTIAL - 1],
      colorArray[2][NUM_OF_COLORS_SEQUENTIAL - 1],
    ]; 
  }
  const index = Math.floor((countInBucket / totalPossiblePoints) * NUM_OF_COLORS_SEQUENTIAL);
  return [
    colorArray[0][index],
    colorArray[1][index],
    colorArray[2][index],
  ];
};