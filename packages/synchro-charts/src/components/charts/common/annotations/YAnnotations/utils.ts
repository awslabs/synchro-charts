import { isYAnnotationThreshold, Threshold, YAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';
import { COMPARISON_OPERATOR } from '../../constants';

export const getY = ({
  annotation,
  height,
  viewport,
}: {
  annotation: YAnnotation;
  height: number;
  viewport: ViewPort;
}) => {
  const { yMax, yMin } = viewport;
  return height - (((annotation.value as number) - yMin) * height) / (yMax - yMin);
};

export const getGradientRotation = (yAnnotation: YAnnotation): string => {
  if (!isYAnnotationThreshold(yAnnotation)) {
    return 'rotate(0)';
  }
  const thresh = yAnnotation as Threshold;
  if (
    thresh.comparisonOperator === COMPARISON_OPERATOR.LESS_THAN ||
    thresh.comparisonOperator === COMPARISON_OPERATOR.LESS_THAN_EQUAL
  ) {
    return 'rotate(180)';
  }
  return 'rotate(0)';
};

export const calculateGradientXOffset = (yAnnotation: YAnnotation): number => {
  if (!isYAnnotationThreshold(yAnnotation)) {
    return 0;
  }
  const thresh = yAnnotation as Threshold;
  if (
    thresh.comparisonOperator === COMPARISON_OPERATOR.LESS_THAN ||
    thresh.comparisonOperator === COMPARISON_OPERATOR.LESS_THAN_EQUAL
  ) {
    return -1;
  }
  return 0;
};

export const getGradientVisibility = ({
  yAnnotation,
  renderThresholdGradient,
}: {
  yAnnotation: YAnnotation;
  renderThresholdGradient: boolean;
}): string =>
  renderThresholdGradient &&
  isYAnnotationThreshold(yAnnotation) &&
  (yAnnotation as Threshold).comparisonOperator !== COMPARISON_OPERATOR.EQUAL
    ? 'inline'
    : 'none';

export const getGradientID = (yAnnotation: YAnnotation): string => `${yAnnotation.id}-${yAnnotation.color}`;
export const getGradientRectangleID = (yAnnotation: YAnnotation): string => `url(#${getGradientID(yAnnotation)})`;
