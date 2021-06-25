import { TREND_TYPE } from '../../../../utils/dataConstants';

export const TREND_LINE_STROKE_WIDTH = 2;
export const TREND_LINE_DASH_ARRAY = '4, 7';

export const getTrendLabel = (dataStreamName: string, trendType: TREND_TYPE) => {
  let trendTypeLabel;
  switch (trendType) {
    case TREND_TYPE.LINEAR:
      trendTypeLabel = 'linear';
      break;
    default:
      /* eslint-disable-next-line no-console */
      console.warn(`No label associated with trend type ${trendType}.`);
      trendTypeLabel = 'trend';
  }
  return `${dataStreamName} (${trendTypeLabel})`;
};
