// viewport boundaries
import { DataPoint } from '../../../utils/dataTypes';

export const Y_MIN = 0;
export const Y_MAX = 5000;

export const X_MIN = new Date(2000, 0, 0, 0, 0);
export const X_MAX = new Date(2000, 0, 0, 0, 10);

export const Y_VALUE = 2500;

// test data point dead center of the viewport
export const TEST_DATA_POINT_STANDARD: DataPoint<number> = {
  x: (X_MIN.getTime() + X_MAX.getTime()) / 2,
  y: Y_VALUE,
};
