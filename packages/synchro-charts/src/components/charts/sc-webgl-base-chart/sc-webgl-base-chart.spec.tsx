/* eslint-disable import/first */
jest.mock('../../sc-webgl-context/webglContext');

import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import { DataType, StreamType } from '../../../utils/dataConstants';
import { DATA_STREAM, DATA_STREAM_2 } from '../../../testing/__mocks__/mockWidgetProperties';
import { messageOverrides } from '../../../testing/__mocks__/mockMessgeOverrides';
import { ScErrorBadge } from '../../sc-error-badge/sc-error-badge';
import { ERROR_SYMBOL_SELECTOR, LOADING_SPINNER_SELECTOR } from '../../../testing/selectors';
import 'webgl-mock-threejs';
import { ScGestureHandler } from './sc-gesture-handler';
import { CHART_CONFIG } from '../common/testUtil';
import { Components } from '../../../components';
import { CustomHTMLElement } from '../../../utils/types';
import { update } from '../common/tests/merge';
import { ScWebglBaseChart } from './sc-webgl-base-chart';
import { ScWebglAxis } from './sc-webgl-axis';
import { chartScene, updateChartScene } from '../sc-line-chart/chartScene';
import { DATA_ALIGNMENT, LEGEND_POSITION } from '../common/constants';

const VIEWPORT: ViewPort = { start: new Date(2000), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };

const STREAM: DataStream<number> = {
  id: 'stream-id',
  name: 'something',
  color: 'red',
  dataType: DataType.NUMBER,
  resolution: 0,
  data: [],
  isRefreshing: false,
  isLoading: false,
};

const LOADING_STREAM: DataStream<number> = {
  ...STREAM,
  isRefreshing: true,
  isLoading: true,
};

const newChartSpecPage = async (chartProps: Partial<Components.ScWebglBaseChart>) => {
  const page = await newSpecPage({
    components: [ScWebglBaseChart, ScGestureHandler, ScWebglAxis, ScErrorBadge],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const chart = page.doc.createElement('sc-webgl-base-chart') as CustomHTMLElement<Components.ScWebglBaseChart>;

  const defaultProps: Components.ScWebglBaseChart = {
    updateChartScene,
    visualizesAlarms: false,
    yRangeStartFromZero: false,
    displaysError: true,
    createChartScene: chartScene,
    viewport: VIEWPORT,
    gestures: true,
    size: {
      ...CHART_CONFIG.size,
      width: 300,
      height: 300,
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      bottom: 300,
      right: 300,
    },
    supportString: false,
    dataStreams: [],
    bufferFactor: 2,
    minBufferSize: 200,
    configId: 'config-id',
    legendConfig: {
      position: LEGEND_POSITION.BOTTOM,
      width: 300,
    },
    legend: props => <sc-legend {...props} />,
    isEditing: false,
    annotations: {
      x: [],
      y: [],
      thresholdOptions: {
        showColor: false,
      },
    },
    messageOverrides: undefined,
    trends: [],
    tooltip: ({ visualizesAlarms = defaultProps.visualizesAlarms, ...rest }) => (
      <sc-tooltip {...rest} dataAlignment={DATA_ALIGNMENT.RIGHT} visualizesAlarms={visualizesAlarms} supportString />
    ),
  };
  update(chart, { ...defaultProps, ...chartProps });
  page.body.appendChild(chart);
  await page.waitForChanges();
  return { page, chart };
};

describe('legend', () => {
  it('renders a legend with provided with a legend config', async () => {
    const { chart } = await newChartSpecPage({
      legendConfig: {
        position: LEGEND_POSITION.BOTTOM,
        width: 200,
      },
    });

    const legend = chart.querySelector('sc-legend');
    expect(legend).toBeDefined();
  });

  it('passes down isEditing when it is true', async () => {
    const { chart } = await newChartSpecPage({
      legendConfig: {
        position: LEGEND_POSITION.BOTTOM,
        width: 200,
      },
      isEditing: true,
    });

    const legend = chart.querySelector('sc-legend');
    expect(legend).toHaveAttribute('isEditing');
  });

  it('passes down view port', async () => {
    const { chart } = await newChartSpecPage({
      legendConfig: {
        position: LEGEND_POSITION.BOTTOM,
        width: 200,
      },
      viewport: VIEWPORT,
    });

    const legend = chart.querySelector('sc-legend') as HTMLScLegendElement;

    expect(legend.viewport).toEqual(VIEWPORT);
  });
});

describe('chart scene management', () => {
  const BUFFER_FACTOR = 2;
  const MIN_BUFFER_SIZE = 100;
  const DATA_STREAMS = [
    {
      id: 'stream-id',
      name: 'my stream name!',
      color: 'red',
      unit: 'm/s',
      resolution: 0,
      dataType: DataType.NUMBER,
      data: [
        {
          x: VIEWPORT.end.getTime(),
          y: 50,
        },
      ],
    },
  ];

  describe('visualizesAlarms', () => {
    const ALARM_DATA_STREAM: DataStream<number> = {
      resolution: 0,
      id: 'alarm-id',
      name: 'alarm',
      dataType: DataType.NUMBER,
      color: 'red',
      streamType: StreamType.ALARM,
      data: [{ x: VIEWPORT.end.getTime(), y: 100 }],
    };

    it('does not pass any alarm data when visualizesAlarm is true, but there are no data streams', async () => {
      const mockCreateChartScene = jest.fn(chartScene);
      const mockUpdateChartScene = jest.fn(updateChartScene);

      await newChartSpecPage({
        createChartScene: mockCreateChartScene,
        updateChartScene: mockUpdateChartScene,
        visualizesAlarms: true,
        viewport: VIEWPORT,
        dataStreams: [],
      });

      expect(mockCreateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: [],
        })
      );

      expect(mockUpdateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: [],
        })
      );
    });

    it('passes both alarm, and property data when `visualizesAlarms` is true', async () => {
      const mockCreateChartScene = jest.fn(chartScene);
      const mockUpdateChartScene = jest.fn(updateChartScene);

      const DATA = [ALARM_DATA_STREAM, ...DATA_STREAMS];

      await newChartSpecPage({
        createChartScene: mockCreateChartScene,
        updateChartScene: mockUpdateChartScene,
        visualizesAlarms: true,
        viewport: VIEWPORT,
        dataStreams: DATA,
      });

      expect(mockCreateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: DATA,
        })
      );

      expect(mockUpdateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: DATA,
        })
      );
    });

    it('does pass alarm data to chart scenes when `visualizesAlarms` is true', async () => {
      const mockCreateChartScene = jest.fn(chartScene);
      const mockUpdateChartScene = jest.fn(updateChartScene);

      await newChartSpecPage({
        createChartScene: mockCreateChartScene,
        updateChartScene: mockUpdateChartScene,
        visualizesAlarms: true,
        viewport: VIEWPORT,
        dataStreams: [ALARM_DATA_STREAM],
      });

      expect(mockCreateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: [ALARM_DATA_STREAM],
        })
      );

      expect(mockUpdateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: [ALARM_DATA_STREAM],
        })
      );
    });

    it('does not pass alarm data to chart scenes when `visualizesAlarms` is false', async () => {
      const mockCreateChartScene = jest.fn(chartScene);
      const mockUpdateChartScene = jest.fn(updateChartScene);

      await newChartSpecPage({
        createChartScene: mockCreateChartScene,
        updateChartScene: mockUpdateChartScene,
        visualizesAlarms: false,
        viewport: VIEWPORT,
        dataStreams: [ALARM_DATA_STREAM],
      });

      expect(mockCreateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: [],
        })
      );

      expect(mockUpdateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: [],
        })
      );
    });
  });

  it('creates chart scene on mount and calls onUpdate', async () => {
    const mockCreateChartScene = jest.fn(chartScene);
    const mockUpdateChartScene = jest.fn(updateChartScene);
    const mockOnUpdateLifeCycle = jest.fn();
    await newChartSpecPage({
      createChartScene: mockCreateChartScene,
      updateChartScene: mockUpdateChartScene,
      viewport: VIEWPORT,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      dataStreams: DATA_STREAMS,
      onUpdateLifeCycle: mockOnUpdateLifeCycle,
    });

    expect(mockCreateChartScene).toBeCalledTimes(1);
    expect(mockCreateChartScene).toBeCalledWith(
      expect.objectContaining({
        viewport: VIEWPORT,
        minBufferSize: MIN_BUFFER_SIZE,
        bufferFactor: BUFFER_FACTOR,
        dataStreams: DATA_STREAMS,
      })
    );

    expect(mockUpdateChartScene).toBeCalled();

    expect(mockOnUpdateLifeCycle).toBeCalledTimes(1);
    expect(mockOnUpdateLifeCycle).toBeCalledWith(
      expect.objectContaining({
        start: VIEWPORT.start,
        end: VIEWPORT.end,
      })
    );
  });

  it('calls onUpdate when data is changed', async () => {
    const mockOnUpdateLifeCycle = jest.fn();
    const { chart, page } = await newChartSpecPage({
      viewport: VIEWPORT,
      dataStreams: DATA_STREAMS,
      onUpdateLifeCycle: mockOnUpdateLifeCycle,
    });

    mockOnUpdateLifeCycle.mockReset();

    // Update data
    chart.dataStreams = [];
    await page.waitForChanges();
    expect(mockOnUpdateLifeCycle).toBeCalledWith(
      expect.objectContaining({
        start: VIEWPORT.start,
        end: VIEWPORT.end,
      })
    );
  });

  it('calls onUpdate when viewport is updated with new viewport date range', async () => {
    const mockOnUpdateLifeCycle = jest.fn();
    const { chart, page } = await newChartSpecPage({
      createChartScene: chartScene,
      updateChartScene,
      viewport: VIEWPORT,
      minBufferSize: MIN_BUFFER_SIZE,
      bufferFactor: BUFFER_FACTOR,
      dataStreams: DATA_STREAMS,
      onUpdateLifeCycle: mockOnUpdateLifeCycle,
    });

    mockOnUpdateLifeCycle.mockReset();

    // Update view port
    const UPDATED_START = new Date(1919, 0, 0);
    const UPDATED_END = new Date(1985, 0, 0);
    chart.viewport = {
      yMax: chart.viewport.yMax,
      yMin: chart.viewport.yMin,
      lastUpdatedBy: undefined,
      start: UPDATED_START,
      end: UPDATED_END,
    };

    await page.waitForChanges();

    expect(mockOnUpdateLifeCycle).toBeCalledWith(
      expect.objectContaining({
        start: UPDATED_START,
        end: UPDATED_END,
      })
    );
  });
});

describe('loading status', () => {
  const DATA_STREAMS: DataStream<number>[] = [
    {
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
    },
  ];

  describe('loading and refreshing status', () => {
    it('displays loading spinner when is loading with no data present', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [LOADING_STREAM],
      });

      const loadingSpinner = chart.querySelector(LOADING_SPINNER_SELECTOR);
      const legend = chart.querySelector('sc-legend');

      expect(legend).toHaveAttribute('isLoading');
      expect(loadingSpinner).not.toBeNull();
    });

    it('does not display loading spinner when is not loading with no data present', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [STREAM],
      });

      const loadingSpinner = chart.querySelector(LOADING_SPINNER_SELECTOR);
      const legend = chart.querySelector('sc-legend') as HTMLScLegendElement;

      expect(legend).not.toHaveAttribute('isLoading');
      expect(loadingSpinner).toBeNull();
    });

    it('does not display loading spinner when it is not loading but is refreshing', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [{ ...DATA_STREAMS[0], isLoading: false, isRefreshing: true }],
      });

      const loadingSpinner = chart.querySelector(LOADING_SPINNER_SELECTOR);
      const legend = chart.querySelector('sc-legend') as HTMLScLegendElement;

      expect(legend).not.toHaveAttribute('isLoading');
      expect(loadingSpinner).toBeNull();
    });
  });
});

describe('with string data', () => {
  const STRING_POINT_1: DataPoint<string> = {
    x: Date.now(),
    y: 'POINT_1',
  };

  const STRING_POINT_2: DataPoint<string> = {
    x: Date.now(),
    y: 'POINT_2',
  };

  const STRING_STREAMS: DataStream<string>[] = [
    {
      id: 'string-1',
      name: 'name-1',
      color: 'black',
      dataType: DataType.STRING,
      data: [STRING_POINT_1],
      resolution: 0,
    },
    {
      id: 'string-2',
      name: 'name-2',
      color: 'black',
      dataType: DataType.STRING,
      data: [STRING_POINT_2],
      resolution: 0,
    },
  ];

  describe('supportsString is true', () => {
    it('correctly mounts when given string data', async () => {
      const mockCreateChartScene = jest.fn(chartScene);
      const mockUpdateChartScene = jest.fn(updateChartScene);
      const { chart } = await newChartSpecPage({
        createChartScene: mockCreateChartScene,
        updateChartScene: mockUpdateChartScene,
        dataStreams: STRING_STREAMS,
        supportString: true,
      });

      expect(mockCreateChartScene).toBeCalledWith(
        expect.objectContaining({
          dataStreams: STRING_STREAMS,
        })
      );

      expect(chart.querySelector('sc-legend')).toHaveAttribute('supportString');
    });
  });
});

describe('error status', () => {
  it('displays error when a error is present and `displaysError` is true', async () => {
    const { chart } = await newChartSpecPage({
      dataStreams: [{ ...STREAM, error: 'my error!' }],
      displaysError: true,
    });

    const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
    expect(error).not.toBeNull();
  });

  it('does not display error when a error is present and `displaysError` is false', async () => {
    const { chart } = await newChartSpecPage({
      dataStreams: [{ ...STREAM, error: 'my error!' }],
      displaysError: false,
    });

    const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
    expect(error).toBeNull();
  });

  it('does not display error when a error is not present and `displaysError` is true', async () => {
    const { chart } = await newChartSpecPage({
      dataStreams: [{ ...STREAM, error: undefined }],
      displaysError: true,
    });

    const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
    expect(error).toBeNull();
  });

  it('displays error when multiple errors are present', async () => {
    const { chart } = await newChartSpecPage({
      dataStreams: [
        { ...DATA_STREAM, error: 'my error!' },
        { ...DATA_STREAM_2, error: 'my other error' },
      ],
      displaysError: true,
    });

    const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
    expect(error).not.toBeNull();
  });

  it('does not display error when no error present', async () => {
    const { chart } = await newChartSpecPage({
      dataStreams: [{ ...STREAM, error: undefined }],
    });

    const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
    expect(error).toBeNull();
  });

  it('does not display error when no data is present', async () => {
    const { chart } = await newChartSpecPage({
      dataStreams: [],
    });

    const error = chart.querySelector(ERROR_SYMBOL_SELECTOR);
    expect(error).toBeNull();
  });

  it('does not display as loading after having an error', async () => {
    const { chart, page } = await newChartSpecPage({
      dataStreams: [LOADING_STREAM],
    });

    expect(chart.querySelector(LOADING_SPINNER_SELECTOR)).not.toBeNull();
    expect(chart.querySelector(ERROR_SYMBOL_SELECTOR)).toBeNull();

    update(chart, {
      dataStreams: [{ ...LOADING_STREAM, error: 'some error!' }],
    });
    await page.waitForChanges();

    expect(chart.querySelector(LOADING_SPINNER_SELECTOR)).toBeNull();
    expect(chart.querySelector(ERROR_SYMBOL_SELECTOR)).not.toBeNull();
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

      const placeholder = chart.querySelector('[data-test-tag="error-badge-place-holder"]');
      expect(placeholder).not.toBeNull();
    });

    it('does not display error place holder when error present', async () => {
      const { chart } = await newChartSpecPage({
        dataStreams: [{ ...DATA_STREAM, error: 'error!' }],
      });

      const placeholder = chart.querySelector('[data-test-tag="error-badge-place-holder"]');
      expect(placeholder).toBeNull();
    });
  });
});

describe('axis', () => {
  it('correctly re-renders x axis when options.showX changes', async () => {
    const { chart, page } = await newChartSpecPage({
      axis: {
        showX: true,
      },
    });

    let xAxis = chart.querySelector('.axis .x-axis');
    expect(xAxis).not.toBeNull();

    update(chart, {
      axis: {
        showX: false,
      },
    });
    await page.waitForChanges();

    // need to query for the element again after update, otherwise it will still have it stored and the test will fail
    xAxis = chart.querySelector('.axis .x-axis');
    expect(xAxis).toBeNull();

    update(chart, {
      axis: {
        showX: true,
      },
    });
    await page.waitForChanges();

    // need to query for the element again after update, otherwise it will still have it stored and the test will fail
    xAxis = chart.querySelector('.axis .x-axis');
    expect(xAxis).not.toBeNull();
  });

  it('correctly re-renders y axis when axis.showY changes', async () => {
    const { chart, page } = await newChartSpecPage({
      axis: {
        showY: true,
      },
    });

    let yAxis = chart.querySelector('.axis .y-axis');
    expect(yAxis).not.toBeNull();

    update(chart, {
      axis: {
        showY: false,
      },
    });
    await page.waitForChanges();

    // need to query for the element again after update, otherwise it will still have it stored and the test will fail
    yAxis = chart.querySelector('.axis .y-axis');
    expect(yAxis).toBeNull();

    update(chart, {
      axis: {
        showY: true,
      },
    });
    await page.waitForChanges();

    // need to query for the element again after update, otherwise it will still have it stored and the test will fail
    yAxis = chart.querySelector('.axis .y-axis');
    expect(yAxis).not.toBeNull();
  });
});

describe('tooltip', () => {
  it('should render with custom tooltip', async () => {
    const { chart, page } = await newChartSpecPage({
      tooltip: props => <div class="custom-test-tooltip" {...props} />,
    });

    await page.waitForChanges();

    const tooltip = chart.querySelector('.custom-test-tooltip');
    expect(tooltip).not.toBeNull();
  });
});

describe('empty state', () => {
  it('renders empty data state when there is no data', async () => {
    const { chart } = await newChartSpecPage({
      messageOverrides,
      dataStreams: [{ ...STREAM, data: [] }],
    });

    expect(chart.innerHTML).toContain(messageOverrides.noDataPresentHeader);
    expect(chart.innerHTML).toContain(messageOverrides.noDataPresentSubHeader);
  });

  it('does not render empty data state when there is data', async () => {
    const { chart } = await newChartSpecPage({
      messageOverrides,
      dataStreams: [{ ...STREAM, data: [{ x: Date.now(), y: 123 }] }],
    });

    expect(chart.innerHTML).not.toContain(messageOverrides.noDataPresentHeader);
    expect(chart.innerHTML).not.toContain(messageOverrides.noDataPresentSubHeader);
  });

  it('does not render no data state when `displayNoDataPresentMsg` is false', async () => {
    const { chart } = await newChartSpecPage({
      messageOverrides,
      dataStreams: [{ ...STREAM, data: [] }],
      displaysNoDataPresentMsg: false,
    });

    expect(chart.innerHTML).not.toContain(messageOverrides.noDataPresentHeader);
    expect(chart.innerHTML).not.toContain(messageOverrides.noDataPresentSubHeader);
  });

  it('renders empty stream state when there is no stream infos or data', async () => {
    const { chart } = await newChartSpecPage({
      messageOverrides,
      dataStreams: [],
    });

    expect(chart.innerHTML).toContain(messageOverrides.noDataStreamsPresentHeader);
    expect(chart.innerHTML).toContain(messageOverrides.noDataStreamsPresentSubHeader);
  });
});
