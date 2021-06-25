import { bisector } from 'd3-array';

import { Annotation, Annotations, AnnotationValue, Threshold } from '../types';
import { displayDate } from '../../../../utils/time';
import { Primitive, ViewPort } from '../../../../utils/dataTypes';
import { isValid } from '../../../../utils/predicates';
import { isNumeric } from '../../../../utils/number';
import { COMPARISON_OPERATOR } from '../constants';

/**
 * Returns only thresholds defined for number
 * @param thresholds
 */
export const getNumberThresholds = (thresholds: Threshold[]): Threshold[] =>
  thresholds.filter(threshold => isNumeric(threshold.value));

/**
 * Returns only annotations defined for numbers
 * @param annotations
 */
export const getNumberAnnotations = (annotations: Annotations): Annotations => {
  const yAnnotations = annotations && Array.isArray(annotations.y) && annotations.y;

  if (!yAnnotations) {
    return annotations;
  }

  const numberAnnotations = yAnnotations.filter(annotation => isNumeric(annotation.value));

  if (numberAnnotations.length < 1) {
    const { y, ...annotationProps } = annotations;
    return annotationProps;
  }

  return {
    ...annotations,
    y: numberAnnotations,
  };
};

const valueDisplayText = ({
  value,
  resolution,
  viewPort,
}: {
  value: AnnotationValue;
  resolution: number;
  viewPort: ViewPort;
}): string => {
  if (typeof value === 'number') {
    return value.toString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return displayDate(value, resolution, viewPort);
};

/**
 * Getters
 */

export const getColor = (annotation: Annotation<AnnotationValue>) => annotation.color;

export const getValueAndText = ({
  annotation,
  resolution,
  viewPort,
}: {
  annotation: Annotation<AnnotationValue>;
  resolution: number;
  viewPort: ViewPort;
}): string => {
  const valueText = annotation.showValue ? valueDisplayText({ value: annotation.value, resolution, viewPort }) : null;
  const labelText = annotation.label && annotation.label.show ? annotation.label.text : null;

  if (labelText && valueText) {
    return `${labelText} (${valueText})`;
  }
  if (!valueText && labelText) {
    return labelText;
  }
  if (!labelText && valueText) {
    return `(${valueText})`;
  }

  return '';
};

export const getText = (annotation: Annotation<AnnotationValue>): string => {
  const labelText = annotation.label && annotation.label.show ? annotation.label.text : null;

  if (labelText) {
    return `${labelText}`;
  }

  return '';
};

export const getValueText = ({
  annotation,
  resolution,
  viewPort,
}: {
  annotation: Annotation<AnnotationValue>;
  resolution: number;
  viewPort: ViewPort;
}): string => {
  const valueText = annotation.showValue ? valueDisplayText({ value: annotation.value, resolution, viewPort }) : null;

  if (valueText) {
    return `${valueText}`;
  }

  return '';
};

export const isThresholdBreached = (value: Primitive, threshold: Threshold): boolean => {
  const dataStreamValue = isNumeric(value) ? Number(value) : value;
  const thresholdValue = isNumeric(threshold.value) ? Number(threshold.value) : threshold.value;
  const thresholdComparison = threshold.comparisonOperator;

  if (typeof dataStreamValue === 'number' && typeof thresholdValue === 'number') {
    switch (thresholdComparison) {
      case COMPARISON_OPERATOR.GREATER_THAN:
        return dataStreamValue > thresholdValue;

      case COMPARISON_OPERATOR.GREATER_THAN_EQUAL:
        return dataStreamValue >= thresholdValue;

      case COMPARISON_OPERATOR.LESS_THAN:
        return dataStreamValue < thresholdValue;

      case COMPARISON_OPERATOR.LESS_THAN_EQUAL:
        return dataStreamValue <= thresholdValue;

      case COMPARISON_OPERATOR.EQUAL:
        return dataStreamValue === thresholdValue;

      default:
        throw new Error(`Unsupported number threshold comparison operator: ${thresholdComparison}`);
    }
  }

  if (typeof dataStreamValue === 'string' && typeof thresholdValue === 'string') {
    if (thresholdComparison === COMPARISON_OPERATOR.EQUAL) {
      return dataStreamValue === thresholdValue;
    }

    throw new Error(`Unsupported string threshold comparison operator: ${thresholdComparison}`);
  }

  return false;
};

const thresholdBisector = bisector((threshold: Threshold) => threshold.value).left;

/**
 * This a map of comparison operator to order. The higher the order means higher the precedence.
 */
const operatorOrder = {
  [COMPARISON_OPERATOR.LESS_THAN_EQUAL]: 1,
  [COMPARISON_OPERATOR.LESS_THAN]: 2,
  [COMPARISON_OPERATOR.GREATER_THAN_EQUAL]: 3,
  [COMPARISON_OPERATOR.GREATER_THAN]: 4,
  [COMPARISON_OPERATOR.EQUAL]: 5,
};

/**
 * Given a list of thresholds, we sort the by the value of the threshold from least to greatest and
 * by the comparators order from least to greatest
 *
 * In the event of multiple thresholds with the same value, the threshold with the highest order will be the
 * one that takes precedence, and other rules colliding will be ignored.
 *
 * Below is an example of sorted threshold:
 *   2 2  2 2     5 5  5 5
 *  >= > <= <    >= > <= <
 */
export const sortThreshold = (thresholds: Threshold[]): Threshold[] =>
  [...thresholds].sort((a, b) => {
    if (a.value === b.value) {
      return operatorOrder[a.comparisonOperator] - operatorOrder[b.comparisonOperator];
    }
    // TODO: Fix this to work for all cases. value is not always a number or comparing to the same type
    return (a.value as number) - (b.value as number);
  });

/**
 * Gets the most relevant threshold which is considered breached by a given value.
 *
 * The most relevant threshold to a point is determined by the threshold value and its comparator.
 *
 * When there are two or more relevant thresholds to a point,
 *
 * 1) When the value is positive, then we will take the upper threshold, which is the greater one
 *
 * 2) When the value is negative, then we will take the lower threshold, which is the lesser one.
 */
export const getBreachedThreshold = (value: Primitive, thresholds: Threshold[]): Threshold | undefined => {
  if (thresholds.length === 0) {
    return undefined;
  }

  if (typeof value === 'string') {
    return thresholds.find(threshold => isThresholdBreached(value, threshold)) || undefined;
  }

  const numberThresholds = getNumberThresholds(thresholds);

  const sortedThresholds = sortThreshold(numberThresholds);
  const idx = thresholdBisector(sortedThresholds, value);

  let annotationLeft = sortedThresholds[idx - 1];
  let annotationRight = sortedThresholds[idx];

  // Special case when the idx is exactly the array length and that the last two thresholds are of the same value
  if (
    idx === numberThresholds.length &&
    numberThresholds.length > 1 &&
    sortedThresholds[idx - 1].value === sortedThresholds[idx - 2].value
  ) {
    annotationLeft = sortedThresholds[idx - 2];
    annotationRight = sortedThresholds[idx - 1];
  }

  // Special case when the idx is at 0 and that the first two values are of the same value.
  if (idx === 0 && numberThresholds.length > 1 && sortedThresholds[idx].value === sortedThresholds[idx + 1].value) {
    annotationLeft = sortedThresholds[idx];
    annotationRight = sortedThresholds[idx + 1];
  }

  if (annotationLeft == null && annotationRight == null) {
    return undefined;
  }

  if (annotationLeft != null && annotationRight == null) {
    return isThresholdBreached(value, annotationLeft) ? annotationLeft : undefined;
  }

  if (annotationLeft == null && annotationRight != null) {
    return isThresholdBreached(value, annotationRight) ? annotationRight : undefined;
  }

  if (isThresholdBreached(value, annotationLeft) && isThresholdBreached(value, annotationRight)) {
    return value >= 0 ? annotationRight : annotationLeft;
  }
  if (isThresholdBreached(value, annotationLeft) && !isThresholdBreached(value, annotationRight)) {
    return annotationLeft;
  }
  if (!isThresholdBreached(value, annotationLeft) && isThresholdBreached(value, annotationRight)) {
    return annotationRight;
  }

  return undefined;
};

export const isThreshold = isValid((maybeThreshold: Partial<Threshold>) => maybeThreshold.comparisonOperator != null);

export const getThresholds = (annotations: Annotations | undefined): Threshold[] =>
  annotations && annotations.y ? annotations.y.filter(isThreshold) : [];
