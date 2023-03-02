import { Threshold, ThresholdBand } from '../types';
import { getCSSColorByString } from '../getCSSColorByString';
import { getBreachedThreshold, sortThreshold, getNumberThresholds } from './utils';
import { COMPARISON_OPERATOR } from '../constants';

/**
 * Max of 13 threshold bands because we allow only up to 12 thresholds. Imaging a piece of paper being split into
 * 12 times. You will end up with 13 different pieces.
 */
export const MAX_THRESHOLD_BANDS = 13;

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
export const thresholdBands = (thresholds: Threshold[]): ThresholdBand[] => {
  if (thresholds.length === 0) {
    return [];
  }

  const numberThresholds = getNumberThresholds(thresholds);

  const sortedThresholds = sortThreshold(numberThresholds).reverse();
  const bands: ThresholdBand[] = [];
  const thresholdBandsSet = new Set();

  sortedThresholds.forEach((threshold, index) => {
    const thresholdValue = threshold.value as number;
    if (sortedThresholds[index].comparisonOperator === COMPARISON_OPERATOR.EQUAL) {
      const [r, g, b] = getCSSColorByString(sortedThresholds[index].color);
      bands.push({
        upper: thresholdValue,
        lower: thresholdValue,
        color: [r, g, b],
      });
      return;
    }

    /**
     * When looking at the first threshold, we want to find a mid point between the MAX SAFE INTEGER and the first
     * threshold value to determine if the first threshold is an upper bound threshold.
     */
    if (index === 0) {
      const midPoint = (Number.MAX_SAFE_INTEGER + thresholdValue) / 2;
      const breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
      if (breachedThreshold != null) {
        const [r, g, b] = getCSSColorByString(breachedThreshold.color);
        bands.push({
          upper: Number.MAX_SAFE_INTEGER,
          lower: thresholdValue,
          color: [r, g, b],
        });
      }
      return;
    }

    /**
     * When looking at the thresholds that is not the first or the last, we want to compare it with the one before
     * to make sure if there is an upper band or not.
     */
    const prevThreshold = sortedThresholds[index - 1];
    const prevThresholdValue = prevThreshold.value as number;
    let midPoint = (prevThresholdValue + thresholdValue) / 2;
    let breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
    if (breachedThreshold != null) {
      if (!thresholdBandsSet.has(prevThreshold.value)) {
        const [r, g, b] = getCSSColorByString(breachedThreshold.color);
        if (
          prevThreshold.comparisonOperator === COMPARISON_OPERATOR.EQUAL &&
          prevThreshold.value === sortedThresholds[index].value
        ) {
          bands.push({
            upper: prevThresholdValue,
            lower: thresholdValue,
            color: [r, g, b],
          });
        } else {
          bands.push({
            upper: prevThresholdValue,
            lower: thresholdValue,
            color: [r, g, b],
          });
        }

        thresholdBandsSet.add(prevThreshold.value);
      }
    }

    /**
     * When looking at the last threshold, we want to find the mid point between it and the Min Safe Int
     * to see if there is a lower band that needs to be create.
     */
    if (index === sortedThresholds.length - 1) {
      midPoint = (thresholdValue + Number.MIN_SAFE_INTEGER) / 2;
      breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
      if (breachedThreshold != null && !thresholdBandsSet.has(thresholdValue)) {
        const [r, g, b] = getCSSColorByString(breachedThreshold.color);
        bands.push({
          lower: Number.MIN_SAFE_INTEGER,
          upper: thresholdValue,
          color: [r, g, b],
        });
      }
      return;
    }

    /**
     * When looking at a threshold that is not first or last, we want to compare it with the next one to see if
     * a lower band is needed.
     */
    const nexThreshold = sortedThresholds[index + 1];
    const nexThresholdValue = nexThreshold.value as number;
    midPoint = (thresholdValue + nexThresholdValue) / 2;
    breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
    if (breachedThreshold != null && !thresholdBandsSet.has(thresholdValue)) {
      const [r, g, b] = getCSSColorByString(breachedThreshold.color);
      bands.push({
        upper: thresholdValue,
        lower: nexThresholdValue,
        color: [r, g, b],
      });
      thresholdBandsSet.add(threshold.value);
    }
  });

  /**
   * Because we need to have a set amount of buffer in Frag, which is 12. If the array length is not 12,
   * we need to fill in the rest with proper threshold bands. It should be duplicates of the last threshold band
   *
   * This function also takes into account when there is only 1 threshold with lower bound.
   */
  let lastThresholdBand = bands[bands.length - 1];

  while (bands.length < MAX_THRESHOLD_BANDS) {
    const threshold = sortedThresholds[sortedThresholds.length - 1];
    const thresholdValue = threshold.value as number;
    const midPoint = Number.MIN_SAFE_INTEGER + thresholdValue / 2;
    const breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
    if (breachedThreshold == null) {
      bands.push(lastThresholdBand);
    } else {
      const [r, g, b] = getCSSColorByString(breachedThreshold.color);
      lastThresholdBand = {
        lower: Number.MIN_SAFE_INTEGER,
        upper: thresholdValue,
        color: [r, g, b],
      };
      bands.push(lastThresholdBand);
    }
  }
  return bands;
};
