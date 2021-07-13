import { numDataPoints, vertices, getCSSColorByString } from '../sc-webgl-base-chart/utils';
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

export const getSequential = (minColor: string, maxColor: string): number[][] => {
  const heatmapR: number[] = [];
  const heatmapG: number[] = [];
  const heatmapB: number[] = [];
  let i = 0;

  const minColorRGB = getCSSColorByString(minColor);
  const maxColorRGB = getCSSColorByString(maxColor);

  const lightenOpacityArray = [0.2, 0.4, 0.6, 0.8, 1.0];
  while (i < 5) {
    const opacity = lightenOpacityArray[i];
    heatmapR[i] = opacity * maxColorRGB[0] + (1 - opacity) * minColorRGB[0];
    heatmapG[i] = opacity * maxColorRGB[1] + (1 - opacity) * minColorRGB[1];
    heatmapB[i] = opacity * maxColorRGB[2] + (1 - opacity) * minColorRGB[2];
    i++;
  }

  const darkenOpacityArray = [0.2, 0.4, 0.6];
  while (i < 8) {
    const opacity = darkenOpacityArray[i - 5];
    heatmapR[i] = maxColorRGB[0] * (1 - opacity);
    heatmapG[i] = maxColorRGB[1] * (1 - opacity);
    heatmapB[i] = maxColorRGB[2] * (1 - opacity);
    i++;
  }

  return [heatmapR, heatmapG, heatmapB];
};

export const getBucketColor = (colorArray: number[][], countInBucket: number, totalPossiblePoints: number): number[] => {
  if (countInBucket >= totalPossiblePoints) {
    return [
      colorArray[0][7],
      colorArray[1][7],
      colorArray[2][7],
    ]; 
  }
  const index = Math.floor((countInBucket / totalPossiblePoints) * 8);
  return [
    colorArray[0][index],
    colorArray[1][index],
    colorArray[2][index],
  ];
};