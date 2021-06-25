import { ChartSpecPage } from './newChartSpecPage';
import { ERROR_SYMBOL_SELECTOR } from '../selectors';
import { DataStream } from '../../utils/dataTypes';
import { DataType } from '../../utils/dataConstants';

const DATA_STREAM: DataStream = {
  id: 'stream-id',
  resolution: 0,
  name: 'something',
  color: 'red',
  dataType: DataType.NUMBER,
  data: [],
};
const DATA_STREAM_2: DataStream = {
  id: 'stream-id-2',
  resolution: 0,
  name: 'something - 2',
  color: 'blue',
  dataType: DataType.NUMBER,
  data: [],
};

export const describeErrorStatus = (newChartSpecPage: ChartSpecPage) => {
  describe('error status', () => {
    it('displays error when a error is present', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [{ ...DATA_STREAM, error: 'my error!' }],
      });

      const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
      expect(error).not.toBeNull();
    });

    it('displays error when multiple errors are present', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [{ ...DATA_STREAM, error: 'my error!' }, { ...DATA_STREAM_2, error: 'my other error' }],
      });

      const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
      expect(error).not.toBeNull();
    });

    it('does not display error when no error present', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [{ ...DATA_STREAM, error: undefined }],
      });

      const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
      expect(error).toBeNull();
    });

    describe('placeholder for error', () => {
      /**
       * The placeholder MUST be present due to how stencilJS works.
       * If the placeholder is not present, when the error badge is constructed,
       * stencil will actually take the HTML element that was the data container, and make it become
       * the error badge, and then re-create the data container below it.
       *
       * This means the canvas will have the WRONG DOM element, and everything will break!
       */
      it('displays error place holder when no error present', async () => {
        const { chart } = await newChartSpecPage({
          dataStreams: [{ ...DATA_STREAM, error: undefined }],
        });

        const baseChart = chart.querySelector('monitor-webgl-base-chart') as HTMLMonitorWebglBaseChartElement;
        if (baseChart.displaysError) {
          const placeholder = chart.querySelector('[data-test-tag="error-badge-place-holder"]');
          expect(placeholder).not.toBeNull();
        }
      });

      it('does not display error place holder when error present', async () => {
        const { chart } = await newChartSpecPage({
          dataStreams: [{ ...DATA_STREAM, error: 'error' }],
        });

        const placeholder = chart.querySelector('[data-test-tag="error-badge-place-holder"]');
        expect(placeholder).toBeNull();
      });
    });
  });
};
