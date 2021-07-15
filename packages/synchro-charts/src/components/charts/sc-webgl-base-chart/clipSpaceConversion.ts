import { DAY_IN_MS, MINUTE_IN_MS, SECOND_IN_MS, YEAR_IN_MS } from '../../../utils/time';
import { ViewPort } from '../../../utils/dataTypes';

/**
 * Clip Space Conversion Utilities
 *
 * Our 'model' space utilizes milliseconds to represent time. This level of granularity is important
 * since we do wish to be able to visually represent the time differences at that level of detail.
 *
 * However, there are 3.15e+10 milliseconds in a year. This is problematic because it means that we cannot represent
 * a years worth of data at the millisecond level granularity utilizing 32 bit floats.
 *
 * double precision is not supported by webGL - there are ways to represent double precision, however these
 * are unnecessarily complicated, double our memory foot print, and actually not necessary.
 *
 * Interesting article on doubles: http://blog.hvidtfeldts.net/index.php/2012/07/double-precision-in-opengl-and-webgl/
 *
 * ## Why Not Necessary To Utilize Doubles?
 *
 * While we need millisecond level precision, we do not need to be able to visually differentiate between milliseconds
 * while looking at even a weeks worth of data. Even if we did, you would not be able to discern a difference
 * due to resolution limitations. Even if you had a hypothetically perfect monitor that could discern a planks-constant
 * level of resolution, the eye would not be able to tell without advanced optical instrumentation!
 *
 * ## Solution
 *
 * We do two things to mitigate - based on the time duration of a given viewport, we will scale down the numbers and
 * truncate the decimals such that the distance from the end to the start of the viewport is representable by a floating point.
 *
 * However, this leaves one more problem - imagine after scaling our viewport in our clip space, we could have
 * our start be 1.20001e+8 to 1.20002e+8, we would have a distance of 1000, which is representable by a 32 bit float, however
 * each number within that range is still not representable by a 32 bit float. To account for this, we also must translate our clip
 * space by what we refer to as an anchor. Suppose we utilize 1.2*10^8 as an anchor, our clip space time range is now 1000 to 2000.
 * Success! We can now represent our time within webgl by a 32 bit float.
 *
 * ## Caveats
 *
 * Since the viewport is dynamic, we have to make sure that as our viewport moves around, we update our `clip space conversion`.
 * Translating, scaling-in, and scaling-out can all cause our `clip space conversion` to start outputting numbers which are not representable by 32 bit floats.
 * To solve this, we also must make sure we watch for viewport changes and adjust our conversion accordingly.
 */

/**
 * Granularity
 *
 * given a duration, return the granularity in milliseconds.
 * By granularity we mean the minimal time difference which is visually differentiated.
 */
const granularity = (durationMS: number): number => {
  if (durationMS < 10 * MINUTE_IN_MS) {
    // single millisecond
    return 1;
  }
  if (durationMS < DAY_IN_MS) {
    return SECOND_IN_MS / 10;
  }
  if (durationMS < DAY_IN_MS * 7) {
    return SECOND_IN_MS;
  }
  if (durationMS < YEAR_IN_MS) {
    return MINUTE_IN_MS;
  }
  if (durationMS < 30 * YEAR_IN_MS) {
    return 30 * MINUTE_IN_MS;
  }
  return DAY_IN_MS;
};

/**
 * Clip Space Conversion
 *
 * Converts something from model space (millisecond representation of time) into our clip space.
 * The goal is to be able to represent the time from `start` to `end` with floating point precision (7 significant digits).
 */
export const clipSpaceConversion = (viewport: ViewPort): ((t: number) => number) => {
  const durationMS = viewport.end.getTime() - viewport.start.getTime();
  const anchorMS = viewport.start.getTime() - durationMS * 0.25;

  const granularityMS = granularity(durationMS);

  return t => Math.floor((t - anchorMS) / granularityMS);
};

const FLOAT_SIG_FIGS = 7;

const isDateOutOfBounds = (date: Date, toClipSpace: (time: number) => number): boolean =>
  Math.abs(toClipSpace(date.getTime())) >= 10 ** FLOAT_SIG_FIGS;

// Minimum amount of distinct positions our clip spaces needs to represent.
const MIN_GRANULARITY = 3000;

/**
 * Needs New Clip Space
 *
 * There are two conditions which can occur which will require a new clip space.
 *
 * 1. The viewport when mapped to the clip space, contains numbers that aren't representable by floating point precision.
 * 2. The granularity within the viewport mapped to the clip space is too low - i.e. if the viewport maps to [0, 10],
 *    then we can only represent 11 distinct points.
 */
export const needsNewClipSpace = (viewport: ViewPort, toClipSpace: (time: number) => number): boolean => {
  const isOutOfBounds = isDateOutOfBounds(viewport.start, toClipSpace) || isDateOutOfBounds(viewport.end, toClipSpace);

  const distanceMS = viewport.end.getTime() - viewport.start.getTime();
  const distanceClipSpace = toClipSpace(viewport.end.getTime()) - toClipSpace(viewport.start.getTime());

  const hasTooLowGranularity = distanceMS > distanceClipSpace && distanceClipSpace < MIN_GRANULARITY;
  return isOutOfBounds || hasTooLowGranularity;
};
