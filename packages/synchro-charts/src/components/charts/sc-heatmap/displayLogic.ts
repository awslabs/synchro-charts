import { ViewPort } from '../../../utils/dataTypes';
import { getCSSColorByString } from '../common/getCSSColorByString';
import { getDistanceFromDuration } from '../common/getDistanceFromDuration';

import {
  HORIZ_MARGIN_FACTOR,
  NUM_OF_COLORS_SEQUENTIAL,
  SEQUENTIAL_BASE_COLOR_INDEX,
  DEFAULT_SEQUENTIAL_MIN,
  DEFAULT_SEQUENTIAL_MID,
  DEFAULT_SEQUENTIAL_MAX,
  BUCKET_COUNT,
  VERT_MARGIN_FACTOR,
} from './heatmapConstants';

export type HeatmapColorPalette = {
  r: number[];
  g: number[];
  b: number[];
};

export const getBucketMargin = (toClipSpace: (time: number) => number, resolution: number) =>
  getDistanceFromDuration(toClipSpace, resolution * HORIZ_MARGIN_FACTOR);

/**
 * Get the bucket width
 *
 * Returns the clipSpace width which each bucket should be.
 * It is assumed that each bucket within a group will have the same width.
 */
export const getXBucketWidth = ({
  toClipSpace,
  xBucketRange,
}: {
  toClipSpace: (time: number) => number;
  xBucketRange: number; // milliseconds
}) => {
  return getDistanceFromDuration(toClipSpace, xBucketRange) - getBucketMargin(toClipSpace, xBucketRange);
};

/**
 * Get the y bucket height.
 *
 * Assumed that each y bucket has the same height.
 */
export const getYBucketHeight = (viewport: ViewPort): number => {
  const { yMin, yMax } = viewport;
  const yRange = Math.abs(yMax - yMin);
  return yRange / BUCKET_COUNT - (yRange / BUCKET_COUNT) * VERT_MARGIN_FACTOR;
};

/**
 * Creates a gradient between the hex code of the min, mid, and max colors.
 */
export const getSequential = ({
  colorChoices = [DEFAULT_SEQUENTIAL_MIN, DEFAULT_SEQUENTIAL_MID, DEFAULT_SEQUENTIAL_MAX],
}: {
  colorChoices?: string[];
} = {}): HeatmapColorPalette => {
  const heatmapColor: HeatmapColorPalette = { r: [], g: [], b: [] };
  const colorRGBArray = colorChoices.map(hexColor => getCSSColorByString(hexColor));

  let colorRatio = 1 / SEQUENTIAL_BASE_COLOR_INDEX;
  let colorRatioIncrement = 1 / SEQUENTIAL_BASE_COLOR_INDEX;
  let colorArrayIndex = 0;
  for (let i = 0; i < NUM_OF_COLORS_SEQUENTIAL; i += 1) {
    if (i === SEQUENTIAL_BASE_COLOR_INDEX) {
      colorRatio = 0;
      colorRatioIncrement = 1 / (NUM_OF_COLORS_SEQUENTIAL - SEQUENTIAL_BASE_COLOR_INDEX);
      colorArrayIndex += 1;
    }
    heatmapColor.r[i] =
      colorRatio * colorRGBArray[colorArrayIndex + 1][0] + (1 - colorRatio) * colorRGBArray[colorArrayIndex][0];
    heatmapColor.g[i] =
      colorRatio * colorRGBArray[colorArrayIndex + 1][1] + (1 - colorRatio) * colorRGBArray[colorArrayIndex][1];
    heatmapColor.b[i] =
      colorRatio * colorRGBArray[colorArrayIndex + 1][2] + (1 - colorRatio) * colorRGBArray[colorArrayIndex][2];
    colorRatio += colorRatioIncrement;
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
  if (countInBucket === totalPossiblePoints) {
    return [
      colorArray.r[NUM_OF_COLORS_SEQUENTIAL - 1],
      colorArray.g[NUM_OF_COLORS_SEQUENTIAL - 1],
      colorArray.b[NUM_OF_COLORS_SEQUENTIAL - 1],
    ];
  }
  const index = Math.floor((countInBucket / totalPossiblePoints) * NUM_OF_COLORS_SEQUENTIAL);
  return [colorArray.r[index], colorArray.g[index], colorArray.b[index]];
};
