import { getCSSColorByString } from '../common/getCSSColorByString';
import { getDistanceFromDuration } from '../common/getDistanceFromDuration';

export type HeatmapColorPalette = {
  r: number[];
  g: number[];
  b: number[];
};

/**
 * Display Constants
 *
 * Adjust these to scale the margins provided within the bar chart.
 * This represent which fraction of the 'width' of a given bar group a margin.
 */
const MARGIN_FACTOR = 1 / 6;

const SEQUENTIAL_OPACITIES = [0.2, 0.4, 0.6, 0.8, 1.0];
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

export const getSequential = ({ minColor, maxColor }: { minColor: string; maxColor: string }): HeatmapColorPalette => {
  const heatmapColor: HeatmapColorPalette = { r: [], g: [], b: [] };
  let i = 0;

  const minColorRGB = getCSSColorByString(minColor);
  const maxColorRGB = getCSSColorByString(maxColor);

  while (i < NUM_OF_COLORS_SEQUENTIAL) {
    const opacity = SEQUENTIAL_OPACITIES[i % SEQUENTIAL_BASE_COLOR_INDEX];
    if (i < SEQUENTIAL_BASE_COLOR_INDEX) {
      heatmapColor.r[i] = opacity * maxColorRGB[0] + (1 - opacity) * minColorRGB[0];
      heatmapColor.g[i] = opacity * maxColorRGB[1] + (1 - opacity) * minColorRGB[1];
      heatmapColor.b[i] = opacity * maxColorRGB[2] + (1 - opacity) * minColorRGB[2];
    } else {
      heatmapColor.r[i] = maxColorRGB[0] * (1 - opacity);
      heatmapColor.g[i] = maxColorRGB[1] * (1 - opacity);
      heatmapColor.b[i] = maxColorRGB[2] * (1 - opacity);
    }
    i += 1;
  }

  return heatmapColor;
};

export const getBucketColor = (
  colorArray: HeatmapColorPalette,
  countInBucket: number,
  totalPossiblePoints: number
): number[] => {
  if (countInBucket >= totalPossiblePoints) {
    return [
      colorArray.r[NUM_OF_COLORS_SEQUENTIAL - 1],
      colorArray.g[NUM_OF_COLORS_SEQUENTIAL - 1],
      colorArray.b[NUM_OF_COLORS_SEQUENTIAL - 1],
    ];
  }
  const index = Math.floor((countInBucket / totalPossiblePoints) * NUM_OF_COLORS_SEQUENTIAL);
  return [colorArray.r[index], colorArray.g[index], colorArray.b[index]];
};
