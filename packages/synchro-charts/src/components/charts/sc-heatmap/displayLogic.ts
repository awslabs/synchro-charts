import { ViewPort } from '../../../utils/dataTypes';
import { getCSSColorByString } from '../common/getCSSColorByString';
import { getDistanceFromDuration } from '../common/getDistanceFromDuration';

import {
  HORIZ_MARGIN_FACTOR,
  MAX_NUM_OF_COLORS_SEQUENTIAL,
  DEFAULT_SEQUENTIAL_MIN,
  DEFAULT_SEQUENTIAL_MID,
  DEFAULT_SEQUENTIAL_MAX,
  BUCKET_COUNT,
  VERT_MARGIN_FACTOR,
} from './heatmapConstants';
import { HeatValueMap } from './heatmapUtil';

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
export const getSequential = (
  heatValues: HeatValueMap,
  colorChoices: string[] = [DEFAULT_SEQUENTIAL_MIN, DEFAULT_SEQUENTIAL_MID, DEFAULT_SEQUENTIAL_MAX]
): HeatmapColorPalette => {
  const { minHeatValue, maxHeatValue } = heatValues;
  const numOfColors = Math.min(maxHeatValue - minHeatValue + 1, MAX_NUM_OF_COLORS_SEQUENTIAL);
  const heatmapColor: HeatmapColorPalette = { r: [], g: [], b: [] };
  const colorRGBArray = colorChoices.map(hexColor => getCSSColorByString(hexColor));

  if (minHeatValue === maxHeatValue) {
    const lastColorIndex = colorRGBArray.length - 1;
    const [r, g, b] = colorRGBArray[lastColorIndex];
    return { r: [r], g: [g], b: [b] };
  }

  const switchColor = Math.ceil(numOfColors / (colorChoices.length - 1));
  let colorRatio = 1 / switchColor;
  const colorRatioIncrement = 1 / switchColor;
  let colorArrayIndex = 0;

  for (let i = 0; i < numOfColors; i += 1) {
    if (i !== 0 && i % switchColor === 0) {
      colorArrayIndex += 1;
      colorRatio = colorRatioIncrement;
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
 * total possible number of points that can be in a bucket.
 */
export const getBucketColor = ({
  heatValues,
  xBucket,
  yBucket,
  colorPalette,
}: {
  heatValues: HeatValueMap;
  xBucket: string;
  yBucket: string;
  colorPalette: HeatmapColorPalette;
}): number[] => {
  const { minHeatValue, maxHeatValue } = heatValues;
  const { bucketHeatValue } = heatValues[xBucket][yBucket];
  const heatValueRange = maxHeatValue - minHeatValue + 1;
  const numOfColors = colorPalette.r.length;

  if (bucketHeatValue === maxHeatValue) {
    return [colorPalette.r[numOfColors - 1], colorPalette.g[numOfColors - 1], colorPalette.b[numOfColors - 1]];
  }
  const index = Math.floor(((bucketHeatValue - minHeatValue) / heatValueRange) * numOfColors);
  return [colorPalette.r[index], colorPalette.g[index], colorPalette.b[index]];
};
