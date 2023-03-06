import { DataPoint } from '../../../utils/dataTypes';
import { YAnnotation } from './types';

const enum BUFFER {
  STANDARD = 0.15,
  SAME_VALUE = 0.5,
}

const orderOfMagnitude = (n: number): number => {
  const o = Math.log10(Math.abs(n));
  return Math.ceil(o);
};

const roundedMagnitude = (n: number) => {
  const m = orderOfMagnitude(n);
  return n > 0 ? 10 ** m : -1 * 10 ** m;
};

const DEFAULT_ROUNDING_DIVISOR = 50;
const roundedToNearest = (rMag: number, n: number) => (roundUp: boolean) => {
  const a = n / (rMag / DEFAULT_ROUNDING_DIVISOR);
  const b = rMag / DEFAULT_ROUNDING_DIVISOR;
  return roundUp ? Math.ceil(a) * b : Math.floor(a) * b;
};

const roundToOrderOfMagnitude = (n: number, min: boolean): number => {
  if (n === 0) {
    return 0;
  }

  const roundedY = roundedToNearest(roundedMagnitude(n), n);
  return n < 0 ? roundedY(min) : roundedY(!min);
};

type YRange = {
  yMin: number;
  yMax: number;
};

const DEFAULT_Y_RANGE: YRange = {
  yMax: 1000,
  yMin: 1,
};

const getBufferHeightByRange = (yMin: number, yMax: number): number => {
  let bufferHeight = 0;
  // Adding padding such that the data's y-values are not flush with the view port
  if (yMax === yMin) {
    // Taking care of the case where yMax === yMin as well as a special case where both are 0
    bufferHeight = yMax !== 0 ? Math.abs(yMax * BUFFER.SAME_VALUE) : BUFFER.SAME_VALUE;
  } else {
    bufferHeight = (yMax - yMin) * BUFFER.STANDARD;
  }

  return bufferHeight;
};

const getYRangeWithBuffers = ({ yValues, startFromZero }: { yValues: number[]; startFromZero: boolean }): YRange => {
  if (yValues.length === 0) {
    return DEFAULT_Y_RANGE;
  }

  const dataRange = yValues.reduce(
    (yRange: YRange, currentY) => ({
      yMin: Math.min(currentY, yRange.yMin),
      yMax: Math.max(currentY, yRange.yMax),
    }),
    {
      yMin: Infinity,
      yMax: -Infinity,
    }
  );

  const noNegativeValues = dataRange.yMin >= 0;
  const noPositiveValues = dataRange.yMax <= 0;
  const bufferHeight = getBufferHeightByRange(dataRange.yMin, dataRange.yMax);
  let yMax = dataRange.yMax + bufferHeight;
  let yMin = dataRange.yMin - bufferHeight;

  // Special case where yMax ans yMin is both zero. We will want to have padding.
  if (dataRange.yMax !== 0 || dataRange.yMin !== 0) {
    // If should start from zero and all in view points are positive, we set the yMin to zero
    if (startFromZero && noNegativeValues) {
      yMin = 0;
    }

    // If should start from zero and all in view points are negative, we set the yMax to zero.
    if (startFromZero && noPositiveValues) {
      yMax = 0;
    }
  }

  return {
    yMin: roundToOrderOfMagnitude(yMin, true),
    yMax: roundToOrderOfMagnitude(yMax, false),
  };
};

export const getYRange = ({
  points,
  yAnnotations,
  startFromZero,
}: {
  points: DataPoint[];
  yAnnotations: YAnnotation[];
  startFromZero: boolean;
}): YRange => {
  // Extract out Y values for each of the data set for normalization.
  const yDataValues = points.map(point => point.y as number);
  const yAnnotationValues = yAnnotations.map(yAnnotation => yAnnotation.value as number);

  return getYRangeWithBuffers({ yValues: [...yDataValues, ...yAnnotationValues], startFromZero });
};

// TODO: Remove the tests dependency on currentYValue, and then delete this code. DO NOT USE THIS FUNCTION
export const currentYRange = () => {
  let lastYRange: YRange = DEFAULT_Y_RANGE;

  return ({
    points,
    yAnnotations,
    startFromZero,
  }: {
    points: DataPoint[];
    yAnnotations: YAnnotation[];
    startFromZero: boolean;
  }) => {
    if (points.length === 0 && yAnnotations.length === 0) {
      return lastYRange;
    }

    lastYRange = getYRange({ points, yAnnotations, startFromZero });
    return lastYRange;
  };
};
