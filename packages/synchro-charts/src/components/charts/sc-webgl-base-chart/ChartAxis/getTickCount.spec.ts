import { getTickCount } from './getTickCount';
import { CHART_CONFIG } from '../../common/testUtil';

describe('get tick counts', () => {
  it('returns a minimum number of ticks when width and height are small', () => {
    const { xTickCount, yTickCount } = getTickCount({ width: 40, height: 40 }, CHART_CONFIG.scale);
    expect(xTickCount).toBe(2);
    expect(yTickCount).toBe(2);
  });

  it('returns more ticks at a larger size', () => {
    const { xTickCount, yTickCount } = getTickCount({ width: 1000, height: 2000 }, CHART_CONFIG.scale);
    expect(xTickCount).toBe(10);
    expect(yTickCount).toBe(66);
  });
});
