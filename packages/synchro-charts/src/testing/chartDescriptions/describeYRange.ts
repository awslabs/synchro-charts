import { ChartSpecPage } from './newChartSpecPage';

const VIEWPORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

export const describeYRange = (newChartSpecPage: ChartSpecPage) => {
  describe('viewport', () => {
    it('sets the provided viewport', async () => {
      const { chart } = await newChartSpecPage({ viewport: VIEWPORT });

      const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

      expect(baseChart.viewport.yMin).toBe(VIEWPORT.yMin);
      expect(baseChart.viewport.yMax).toBe(VIEWPORT.yMax);
    });

    it.skip('ensures chart displays all y annotations when no y range provided in viewport', async () => {
      const LARGE_Y = 9999;
      const SMALL_Y = -9999;

      const { chart } = await newChartSpecPage({
        viewport: {
          ...VIEWPORT,
          yMin: undefined,
          yMax: undefined,
        },
        annotations: {
          y: [
            { value: LARGE_Y, color: 'red' },
            { value: SMALL_Y, color: 'red' },
          ],
        },
      });

      const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

      expect(baseChart.viewport.yMin).toBeLessThanOrEqual(SMALL_Y);
      expect(baseChart.viewport.yMax).toBeGreaterThanOrEqual(LARGE_Y);
    });

    it('ignores annotations when viewport y range provided', async () => {
      const LARGE_Y = 9999;
      const SMALL_Y = -9999;

      const { chart } = await newChartSpecPage({
        viewport: VIEWPORT,
        annotations: {
          y: [
            { value: LARGE_Y, color: 'red' },
            { value: SMALL_Y, color: 'red' },
          ],
        },
      });

      const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

      expect(baseChart.viewport.yMin).toBe(VIEWPORT.yMin);
      expect(baseChart.viewport.yMax).toBe(VIEWPORT.yMax);
    });
  });
};
