import { createZoomBehavior } from './zoomBehavior';
import { CHART_CONFIG } from '../../common/testUtil';

describe('zoom behavior creation', () => {
  it('sets zoom min and max', () => {
    const zoomBehavior = createZoomBehavior({
      ...CHART_CONFIG,
      movement: {
        ...CHART_CONFIG.movement,
        zoomMin: 0.01,
        zoomMax: 100,
      },
    });
    expect(zoomBehavior.scaleExtent()).toEqual([0.01, 100]);
  });
});
