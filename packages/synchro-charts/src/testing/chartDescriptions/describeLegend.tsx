import { ChartSpecPage } from './newChartSpecPage';
import { Threshold } from '../../components/charts/common/types';
import { COMPARISON_OPERATOR, LEGEND_POSITION } from '../../components/charts/common/constants';

const VIEW_PORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

export const describeLegend = (newChartSpecPage: ChartSpecPage) => {
  describe('legend', () => {
    it('renders a legend when provided with a legend config', async () => {
      const { chart } = await newChartSpecPage({
        legend: {
          position: LEGEND_POSITION.BOTTOM,
          width: 200,
        },
      });

      const legend = chart.querySelector('monitor-legend');
      expect(legend).toBeDefined();
    });

    it('passes down isEditing when it is true', async () => {
      const { chart } = await newChartSpecPage({
        legend: {
          position: LEGEND_POSITION.BOTTOM,
          width: 200,
        },
        isEditing: true,
      });

      const legend = chart.querySelector('monitor-legend');
      expect(legend).toHaveAttribute('isEditing');
    });

    it('passes down view port', async () => {
      const { chart } = await newChartSpecPage({
        legend: {
          position: LEGEND_POSITION.BOTTOM,
          width: 200,
        },
        viewPort: VIEW_PORT,
      });

      const legend = chart.querySelector('monitor-legend') as HTMLMonitorLegendElement;

      expect(legend.viewPort).toMatchObject({ start: VIEW_PORT.start, end: VIEW_PORT.end });
    });

    /**
     * Even if a chart doesnt display strings, we may still need their thresholds and data streams to
     * show associated alarm data streams breaching via it's related data streams legend.
     */
    it('passes down both string and number thresholds', async () => {
      const STRING_THRESHOLD: Threshold<string> = {
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        value: 'ALARM',
        color: 'red',
      };
      const NUMBER_THRESHOLD: Threshold<number> = {
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        value: 123.2,
        color: 'green',
      };
      const THRESHOLDS = [STRING_THRESHOLD, NUMBER_THRESHOLD];

      const { chart } = await newChartSpecPage({
        annotations: { y: THRESHOLDS },
        legend: {
          position: LEGEND_POSITION.BOTTOM,
          width: 200,
        },
      });

      const legend = chart.querySelector('monitor-legend') as HTMLMonitorLegendElement;

      expect(legend.thresholds).toEqual(THRESHOLDS);
    });
  });
};
