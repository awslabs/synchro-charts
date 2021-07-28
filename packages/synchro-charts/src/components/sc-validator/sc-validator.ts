import parse from 'parse-duration';
import { isMinimalStaticViewport } from '../../utils/predicates';
import { isValidDate } from './validator/dateValidator';
import { ChartConfig } from '../charts/common/types';

export const validate = ({ viewport }: Partial<ChartConfig>): void => {
  // skips if viewport is undefine
  if (viewport != null) {
    if (isMinimalStaticViewport(viewport) && (!isValidDate(viewport.start) || !isValidDate(viewport.end))) {
      throw new Error(`Unable to parse start date: '${viewport.start}' and/or end date: '${viewport.end}'`);
    }

    if (
      !isMinimalStaticViewport(viewport) &&
      viewport.duration === 'string' &&
      parse(viewport.duration, 'ms') == null
    ) {
      throw new Error(`Unable to parse duration: '${viewport.duration}'`);
    }
  }
};
