import { getCSSColorByString } from '../common/getCSSColorByString';
import { getDistanceFromDuration } from '../common/getDistanceFromDuration';

export type HeatmapColorPalette = {
  r: number[];
  g: number[];
  b: number[];
};
export const NUM_OF_COLORS_SEQUENTIAL = 8;

/**
 * Display Constants
 *
 * Adjust these to scale the margins provided within the heatmap.
 * This represent which fraction of the 'width' of a given bucket group a margin.
 */
const MARGIN_FACTOR = 1 / 6;

const SEQUENTIAL_OPACITIES = [0.2, 0.4, 0.6, 0.8, 1.0, 0.33, 0.66, 1.0];
const SEQUENTIAL_BASE_COLOR_INDEX = 5;
const DEFAULT_SEQUENTIAL_MIN = '#ffffff';
const DEFAULT_SEQUENTIAL_MID = '#0073bb';
const DEFAULT_SEQUENTIAL_MAX = '#012E4A';

export const getBucketMargin = (toClipSpace: (time: number) => number, resolution: number) =>
  getDistanceFromDuration(toClipSpace, resolution * MARGIN_FACTOR);

/**
 * Get the bucket width
 *
 * Returns the clipSpace width which each bucket should be.
 * It is assumed that each bucket within a group will have the same width.
 */
export const getBucketWidth = ({
  toClipSpace,
  resolution,
  numDataStreams,
}: {
  toClipSpace: (time: number) => number;
  numDataStreams: number;
  resolution: number; // milliseconds
}) => {
  return (getDistanceFromDuration(toClipSpace, resolution) - getBucketMargin(toClipSpace, resolution)) / numDataStreams;
};

/**
 * Creates a gradient between the hex code of the min, mid, and max colors.
 */
export const getSequential = ({
  minColor = DEFAULT_SEQUENTIAL_MIN,
  midColor = DEFAULT_SEQUENTIAL_MID,
  maxColor = DEFAULT_SEQUENTIAL_MAX,
}: {
  minColor: string | undefined;
  midColor: string | undefined;
  maxColor: string | undefined;
}): HeatmapColorPalette => {
  const heatmapColor: HeatmapColorPalette = { r: [], g: [], b: [] };
  const minColorRGB = getCSSColorByString(minColor);
  const midColorRGB = getCSSColorByString(midColor);
  const maxColorRGB = getCSSColorByString(maxColor);

  let i = 0;
  while (i < NUM_OF_COLORS_SEQUENTIAL) {
    const opacity = SEQUENTIAL_OPACITIES[i % SEQUENTIAL_BASE_COLOR_INDEX];
    if (i < SEQUENTIAL_BASE_COLOR_INDEX) {
      heatmapColor.r[i] = opacity * midColorRGB[0] + (1 - opacity) * minColorRGB[0];
      heatmapColor.g[i] = opacity * midColorRGB[1] + (1 - opacity) * minColorRGB[1];
      heatmapColor.b[i] = opacity * midColorRGB[2] + (1 - opacity) * minColorRGB[2];
    } else {
      heatmapColor.r[i] = opacity * midColorRGB[0] + (1 - opacity) * maxColorRGB[0];
      heatmapColor.g[i] = opacity * midColorRGB[1] + (1 - opacity) * maxColorRGB[1];
      heatmapColor.b[i] = opacity * midColorRGB[2] + (1 - opacity) * maxColorRGB[2];
    }
    i += 1;
  }
  return heatmapColor;
};

/**
 * Returns the color of the bucket based on the number of points in the bucket and the 
 * total possible number of points that can be in a bucket
 */
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
