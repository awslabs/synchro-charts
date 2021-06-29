import { ViewPort } from '../../../utils/dataTypes';
/**
 * Clip Space Conversion
 *
 * Converts something from model space (millisecond representation of time) into our clip space.
 * The goal is to be able to represent the time from `start` to `end` with floating point precision (7 significant digits).
 */
export declare const clipSpaceConversion: (viewPort: ViewPort) => (t: number) => number;
/**
 * Needs New Clip Space
 *
 * There are two conditions which can occur which will require a new clip space.
 *
 * 1. The viewport when mapped to the clip space, contains numbers that aren't representable by floating point precision.
 * 2. The granularity within the viewport mapped to the clip space is too low - i.e. if the viewport maps to [0, 10],
 *    then we can only represent 11 distinct points.
 */
export declare const needsNewClipSpace: (viewPort: ViewPort, toClipSpace: (time: number) => number) => boolean;
