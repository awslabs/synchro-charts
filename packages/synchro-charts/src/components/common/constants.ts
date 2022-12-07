import { SECOND_IN_MS } from '../../utils/time';
import { ErrorMessages, Messages, TooltipMessage } from './types';

export const loading = 'Loading';
export const DATE_RANGE_EMIT_EVENT_MS = 0.5 * SECOND_IN_MS;

export enum ColorConfigurations {
  BLUE = '#2E72B5',
  NORMAL = '#3F7E23',
  WARNING = '#F29D38',
  CRITICAL = '#C03F25',
  GRAY = '#D9D9D9',
  PRIMARYTEXT = '#16191f',
  SECONDARYTEXT = '#687078',
  WHITE = '#fff',
}

export enum ErrorMessageName {
  ERROR_TIME_LABEL = 'errorTimeLabel',
  INVALID_VALUE_ERROR = 'invalidValueError',
  MISSING_YMIN_AND_MAX_ERROR = 'missingYminAndYmaxError',
  MISSING_YMIN_ERROR = 'missingYminError',
  MISSING_YMAX_ERROR = 'missingYmaxError',
  INVALID_YMIN_AND_YMAX_ERROR = 'invalidYminAndYmaxError',
  DATA_NOT_LIMITS_ERROR = 'dataNotLimitsError',
}

export const DefaultErrorMessages: ErrorMessages = {
  errorTimeLabel: 'Last value at',
  invalidValueError: 'Invalid value',
  missingYminAndYmaxError: 'Missing yMin & yMax',
  missingYminError: 'Missing yMin',
  missingYmaxError: 'Missing yMax',
  invalidYminAndYmaxError: 'Invalid yMin & yMax',
  dataNotLimitsError: 'Invalid data',
};

export const DefaultTooltipMessages: TooltipMessage = {
  tooltipValueTitles: 'Latest value:',
  tooltipValueTimeDescribed: 'at',
  tooltipStatusTitles: 'Status:',
  tooltipStatusDescribed: 'since',
};

export const DefaultMessages: Messages = {
  error: DefaultErrorMessages,
  loading,
  tooltip: DefaultTooltipMessages,
};
