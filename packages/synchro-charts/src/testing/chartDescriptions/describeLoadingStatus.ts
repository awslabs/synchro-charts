import { ChartSpecPage } from './newChartSpecPage';
import { DataStream } from '../../utils/dataTypes';
import { LOADING_SPINNER_SELECTOR } from '../selectors';
import { DataType } from '../../utils/dataConstants';

const VIEW_PORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

const DATA_STREAM: DataStream<number> = {
  id: 'stream-id',
  name: 'my stream name!',
  color: 'red',
  unit: 'm/s',
  resolution: 0,
  data: [
    {
      x: VIEW_PORT.end.getTime(),
      y: 50,
    },
  ],
  dataType: DataType.NUMBER,
};

export const describeLoadingStatus = (newChartSpecPage: ChartSpecPage) => {
  describe('loading status', () => {
    it('displays loading spinner when is loading with no data present', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [{ ...DATA_STREAM, isLoading: true }],
      });

      const loadingSpinner = chart.querySelector(LOADING_SPINNER_SELECTOR);
      const legend = chart.querySelector('sc-legend');

      if (legend) {
        // not all widgets have legends!
        expect(legend).toHaveAttribute('isLoading');
      }
      expect(loadingSpinner).not.toBeNull();
    });

    it('does not display loading spinner when is not loading with no data present', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [],
      });

      const loadingSpinner = chart.querySelector(LOADING_SPINNER_SELECTOR);
      const legend = chart.querySelector('sc-legend');

      if (legend) {
        // not all widgets have legends!
        expect(legend).not.toHaveAttribute('isLoading');
      }
      expect(loadingSpinner).toBeNull();
    });

    it('does not display loading spinner when is refreshing but is not loading', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [{ ...DATA_STREAM, isLoading: false, isRefreshing: true }],
      });

      const loadingSpinner = chart.querySelector(LOADING_SPINNER_SELECTOR);

      const legend = chart.querySelector('sc-legend');

      if (legend) {
        // not all widgets have legends!
        expect(legend).not.toHaveAttribute('isLoading');
      }
      expect(loadingSpinner).toBeNull();
    });
  });
};
