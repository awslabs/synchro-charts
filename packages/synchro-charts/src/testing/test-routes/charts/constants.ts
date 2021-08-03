// viewport boundaries
import { DataPoint } from '../../../utils/dataTypes';
import { Threshold, XAnnotation, YAnnotation } from '../../../components/charts/common/types';
import { COMPARISON_OPERATOR } from '../../../components/charts/common/constants';

export const Y_MIN = 0;
export const Y_MAX = 5000;

export const X_MIN = new Date(2000, 0, 0, 0, 0);
export const X_MAX = new Date(2000, 0, 0, 0, 10);

export const Y_VALUE = 2500;

export const Y_THRESHOLD: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 100,
  label: {
    text: 'here is a y label',
    show: true,
  },
  showValue: true,
  color: 'blue',
  id: 'blue-y-threshold',
};

export const Y_ANNOTATION: YAnnotation = {
  isEditable: true,
  value: 2600,
  label: {
    text: 'another y label',
    show: true,
  },
  showValue: true,
  color: 'green',
  id: 'green-y-annotation',
};

export const X_ANNOTATION: XAnnotation = {
  value: new Date(X_MIN.getTime() + (1 / 3) * (X_MAX.getTime() - X_MIN.getTime())),
  label: {
    text: 'here is a x label',
    show: true,
  },
  showValue: true,
  color: 'purple',
  id: 'purple-x-annotation',
};

// test data point dead center of the viewport
export const TEST_DATA_POINT_STANDARD: DataPoint<number> = {
  x: (X_MIN.getTime() + X_MAX.getTime()) / 2,
  y: Y_VALUE,
};
