import { DataPoint, DataStream, ViewPortConfig } from '../../utils/dataTypes';
import { round } from '../../utils/number';
import { isNumberDataStream } from '../../utils/predicates';
import { ErrorMessageName } from './constants';
import { ErrorMessages } from './types';

/**
 * Processing data stream.
 *
 * Note:
 * Determine the error message of the data stream.
 * Calculate the value of the data stream.
 */

const defaultUnit = '%';
export const getViewportErrorMessage = (yMin?: number, yMax?: number) => {
  if (yMin === undefined && yMax === undefined) return ErrorMessageName.MISSING_YMIN_AND_MAX_ERROR;
  if (yMin === undefined) return ErrorMessageName.MISSING_YMIN_ERROR;
  if (yMax === undefined) return ErrorMessageName.MISSING_YMAX_ERROR;
  if (yMin >= yMax) return ErrorMessageName.INVALID_YMIN_AND_YMAX_ERROR;

  return '';
};

export const getPropertyStreamErrorMessage = (propertyStream?: DataStream) => {
  if (!propertyStream) return ErrorMessageName.INVALID_VALUE_ERROR;

  return '';
};

export const getPropertyStream = (propertyStream?: DataStream) => {
  return propertyStream && isNumberDataStream(propertyStream) ? propertyStream : undefined;
};

export const getPoint = (propertyPoint?: DataPoint, propertyStream?: DataStream) => {
  return getPropertyStream(propertyStream) ? propertyPoint : undefined;
};

export const getDeviationDataFlow = (yMin: number, yMax: number) => {
  const viewportErrorMessage = getViewportErrorMessage(yMin, yMax);
  if (!viewportErrorMessage) return yMax - yMin;

  return '';
};

/**
 * The priority order of the error is propertyStream no exists、propertyStream.error、viewport(yMin & yMax) error、point error.
 */
export const getErrorMessage = (
  viewport: ViewPortConfig,
  errorMessages: ErrorMessages,
  propertyStream?: DataStream
) => {
  const { yMin, yMax } = viewport;
  const propertyStreamErrorMessage = getPropertyStreamErrorMessage(getPropertyStream(propertyStream));
  if (propertyStreamErrorMessage) {
    return errorMessages[propertyStreamErrorMessage];
  }

  if (propertyStream?.error) return propertyStream?.error;

  const viewportErrorMessage = getViewportErrorMessage(yMin, yMax);
  if (viewportErrorMessage) return errorMessages[viewportErrorMessage];

  return '';
};

export const getData = (
  viewport: ViewPortConfig,
  propertyPoint?: DataPoint,
  propertyStream?: DataStream,
  significantDigits?: number
) => {
  const { yMin, yMax } = viewport;
  const point = getPoint(propertyPoint, propertyStream);
  const stream = getPropertyStream(propertyStream);
  const deviationDataFlow = getDeviationDataFlow(yMin, yMax);

  const propertyStreamUnit = stream && stream.unit;
  const unit = propertyStreamUnit || (!getViewportErrorMessage(yMin, yMax) ? defaultUnit : '');

  const percent = deviationDataFlow && point ? ((point.y as number) - yMin) / deviationDataFlow : 0;

  const originValue = propertyStreamUnit || getViewportErrorMessage(yMin, yMax) ? (point?.y as number) : percent * 100;
  // TODO: If significantdigits are too large, they will overflow the dial ring.
  const value = significantDigits ? originValue.toPrecision(significantDigits) : round(originValue);

  return {
    unit,
    percent,
    value,
  };
};
