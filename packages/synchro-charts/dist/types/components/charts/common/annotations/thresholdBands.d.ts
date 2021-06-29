import { Threshold, ThresholdBand } from '../types';
/**
 * Max of 12 threshold bands because we allow only up to 10 thresholds. Imaging a piece of paper being split into
 * 10 times. You will end up with 11 different pieces. Set it as 12 to over allocate.
 */
export declare const MAX_THRESHOLD_BANDS = 12;
/**
 * First we sort the thresholds then reverse it. Reversing the sorted threshold allows us to create the band from
 * top to bottom.
 *
 * For each threshold that is not the first or the last, we check both upper and lower to see if a band is needed.
 *
 * Because we check against the previous threshold and the next threshold, a set is needed to prevent duplicates
 *
 * We know that all the threshold bands can only have unique upper, so we will be using that as the key in the Set.
 */
export declare const thresholdBands: (thresholds: Threshold[]) => ThresholdBand[];
