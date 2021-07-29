/* eslint-disable import/first */
jest.mock('../../sc-size-provider/renderChild');
jest.mock('../../sc-webgl-context/webglContext');

import 'webgl-mock-threejs';
import { newChartSpecPage } from '../../../testing/chartDescriptions/newChartSpecPage';
import { LEGEND_POSITION } from '../common/constants';
import { Axis } from '../common/types';
import { DataStream } from '../../../utils/dataTypes';
import { LOADING_SPINNER_SELECTOR, ERROR_SYMBOL_SELECTOR } from '../../../testing/selectors';
import { DataType } from '../../../utils/dataConstants';

const VIEWPORT = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };
const DATA_STREAM: DataStream<number> = {
  id: 'stream-id',
  name: 'my stream name!',
  color: 'red',
  unit: 'm/s',
  resolution: 0,
  data: [
    {
      x: VIEWPORT.end.getTime(),
      y: 50,
    },
  ],
  dataType: DataType.NUMBER,
};

const DATA_STREAM_2: DataStream = {
  id: 'stream-id-2',
  resolution: 0,
  name: 'something - 2',
  color: 'blue',
  dataType: DataType.NUMBER,
  data: [],
};

const heatmap = newChartSpecPage('sc-heatmap');

describe('legend', () => {
  it('renders a legend when provided with a legend config', async () => {
    const { chart } = await heatmap({
      legend: {
        position: LEGEND_POSITION.BOTTOM,
        width: 200,
      },
    });

    const legend = chart.querySelector('sc-legend');
    expect(legend).toBeDefined();
  });

  it('passes down isEditing when it is true', async () => {
    const { chart } = await heatmap({
      legend: {
        position: LEGEND_POSITION.BOTTOM,
        width: 200,
      },
      isEditing: true,
    });

    const legend = chart.querySelector('sc-legend');
    expect(legend).toHaveAttribute('isEditing');
  });

  it('passes down view port', async () => {
    const { chart } = await heatmap({
      legend: {
        position: LEGEND_POSITION.BOTTOM,
        width: 200,
      },
      viewport: VIEWPORT,
    });

    const legend = chart.querySelector('sc-legend') as HTMLScLegendElement;

    expect(legend.viewport).toMatchObject({ start: VIEWPORT.start, end: VIEWPORT.end });
  });
});

describe('loading status', () => {
  it('displays loading spinner when is loading with no data present', async () => {
    const { chart } = await heatmap({
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
    const { chart } = await heatmap({
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
    const { chart } = await heatmap({
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

describe('error status', () => {
  it('displays error when a error is present', async () => {
    const { chart } = await heatmap({
      dataStreams: [{ ...DATA_STREAM, error: 'my error!' }],
    });

    const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
    expect(error).not.toBeNull();
  });

  it('displays error when multiple errors are present', async () => {
    const { chart } = await heatmap({
      dataStreams: [
        { ...DATA_STREAM, error: 'my error!' },
        { ...DATA_STREAM_2, error: 'my other error' },
      ],
    });

    const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
    expect(error).not.toBeNull();
  });

  it('does not display error when no error present', async () => {
    const { chart } = await heatmap({
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
      const { chart } = await heatmap({
        dataStreams: [{ ...DATA_STREAM, error: undefined }],
      });

      const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;
      if (baseChart.displaysError) {
        const placeholder = chart.querySelector('[data-test-tag="error-badge-place-holder"]');
        expect(placeholder).not.toBeNull();
      }
    });

    it('does not display error place holder when error present', async () => {
      const { chart } = await heatmap({
        dataStreams: [{ ...DATA_STREAM, error: 'error' }],
      });

      const placeholder = chart.querySelector('[data-test-tag="error-badge-place-holder"]');
      expect(placeholder).toBeNull();
    });
  });
});

describe('viewport', () => {
  it('sets the provided viewport', async () => {
    const { chart } = await heatmap({ viewport: VIEWPORT });

    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.viewport.yMin).toBe(VIEWPORT.yMin);
    expect(baseChart.viewport.yMax).toBe(VIEWPORT.yMax);
  });
});

describe('properties pass down correctly to chart implementation', () => {
  it('passes down messageOverrides', async () => {
    const messageOverrides = { noDataStreamsPresentHeader: 'an over ride message' };
    const { chart } = await heatmap({ messageOverrides });
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.messageOverrides).toBe(messageOverrides);
  });

  it('passes gestures down as true', async () => {
    const { chart } = await heatmap({ gestures: true });
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.gestures).toBeTrue();
  });

  it('passes gestures down as false', async () => {
    const { chart } = await heatmap({ gestures: false });
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.gestures).toBeFalse();
  });

  it('sets the provided option supportsStrings', async () => {
    const { chart } = await heatmap({});
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.supportString).toBeDefined();
  });

  it('sets the provided viewport, and has a y range set when viewport has none provided', async () => {
    const viewport = { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) };
    const { chart } = await heatmap({ viewport });
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    /** Start and end date is equal to what was provided */
    expect(baseChart.viewport).toEqual(expect.objectContaining(viewport));

    /** Y Range set since viewport had none provided */
    expect(baseChart.viewport.yMin).not.toBeDefined();
    expect(baseChart.viewport.yMax).not.toBeDefined();
  });

  it('sets legend correctly', async () => {
    const LEGEND = {
      position: LEGEND_POSITION.BOTTOM,
      width: 200,
    };

    const { chart } = await heatmap({ legend: LEGEND });
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.legend).toEqual(LEGEND);
  });

  it('sets axis correctly', async () => {
    const AXIS: Axis.Options = {
      showX: true,
      showY: false,
    };

    const { chart } = await heatmap({ axis: AXIS });
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.axis).toEqual(AXIS);
  });

  it('sets the requested data', async () => {
    const requestData = jest.fn();

    const { chart } = await heatmap({ requestData });
    const baseChart = chart.querySelector('sc-webgl-base-chart') as HTMLScWebglBaseChartElement;

    expect(baseChart.requestData).toBe(requestData);
  });
});
