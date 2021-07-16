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
const MARGIN_FACTOR = 1/ 20;

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
  colorChoices = [DEFAULT_SEQUENTIAL_MIN, DEFAULT_SEQUENTIAL_MID, DEFAULT_SEQUENTIAL_MAX],
}: {
  colorChoices?: string[];
} = {}): HeatmapColorPalette => {
  const heatmapColor: HeatmapColorPalette = { r: [], g: [], b: [] };
  const colorRGBArray = colorChoices.reduce(function convertToRGB(tempColorRGBArray: number[][], hexColor, indexArray,) {
    tempColorRGBArray[indexArray] = getCSSColorByString(hexColor);
    return tempColorRGBArray;
  }, []);

  let colorRatio = 1 / SEQUENTIAL_BASE_COLOR_INDEX;
  let colorRatioIncrement = 1 / SEQUENTIAL_BASE_COLOR_INDEX;
  let colorArrayIndex = 0;
  for (let i = 0; i < NUM_OF_COLORS_SEQUENTIAL; i++) {
    if (i === SEQUENTIAL_BASE_COLOR_INDEX) {
      colorRatio = 0;
      colorRatioIncrement = 1 / (NUM_OF_COLORS_SEQUENTIAL - SEQUENTIAL_BASE_COLOR_INDEX);
      colorArrayIndex += 1;
    }
    heatmapColor.r[i] = colorRatio * colorRGBArray[colorArrayIndex + 1][0] + (1 - colorRatio) * colorRGBArray[colorArrayIndex][0];
    heatmapColor.g[i] = colorRatio * colorRGBArray[colorArrayIndex + 1][1] + (1 - colorRatio) * colorRGBArray[colorArrayIndex][1];
    heatmapColor.b[i] = colorRatio * colorRGBArray[colorArrayIndex + 1][2] + (1 - colorRatio) * colorRGBArray[colorArrayIndex][2];
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
