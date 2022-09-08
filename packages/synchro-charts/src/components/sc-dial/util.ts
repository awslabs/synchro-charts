import { DialErrorMessages, DialMessages, TooltipMessage } from './type';

export enum ColorConfigurations {
  BLUE = '#2E72B5',
  NORMAL = '#3F7E23',
  WARNING = '#F29D38',
  CRITICAL = '#C03F25',
  GRAY = '#D9D9D9',
  PRIMARYTEXT = '#16191f',
  SECONDARYTEXT = '#687078',
}

export const DefaultDialErrorMessages: DialErrorMessages = {
  errorTimeLabel: 'Last value at',
  dataNotNumberError: 'Invalid valued',
};

export const DefaultTooltipMessages: TooltipMessage = {
  tooltipValueTitles: 'Latest value:',
  tooltipValueTimeDescribed: 'at',
  tooltipStatusTitles: 'Status:',
  tooltipStatusDescribed: 'since',
};

export const DefaultDialMessages: DialMessages = {
  error: DefaultDialErrorMessages,
  tooltip: DefaultTooltipMessages,
};
