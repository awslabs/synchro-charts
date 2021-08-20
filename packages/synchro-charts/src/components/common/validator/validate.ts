import parse from 'parse-duration';
import { isMinimalStaticViewport } from '../../../utils/predicates';
import { isValidDate } from './isValidDate';
import { ChartConfig } from '../../charts/common/types';
import { MinimalLiveViewport } from '../../../utils/dataTypes';

export const validate = ({ viewport }: Partial<ChartConfig>): void => {
  // skips if viewport is undefine
  if (viewport != null) {
    /**
     * We cannot enforce the type that is coming in. So we throw and warn message if all
     * start, end, and duration is being passed in.
     */
    if (isMinimalStaticViewport(viewport) && ((viewport as unknown) as MinimalLiveViewport).duration != null) {
      // eslint-disable-next-line no-console
      console.warn('Detected both static and live viewport type. Duration will be used');
    }
    if (isMinimalStaticViewport(viewport) && (!isValidDate(viewport.start) || !isValidDate(viewport.end))) {
      throw new Error(`Unable to parse start date: '${viewport.start}' and/or end date: '${viewport.end}'`);
    }

    if (
      !isMinimalStaticViewport(viewport) &&
      typeof viewport.duration === 'string' &&
      parse(viewport.duration, 'ms') == null
    ) {
      throw new Error(`Unable to parse duration: '${viewport.duration}'`);
    }
  }
};
