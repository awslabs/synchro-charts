import { newSpecPage } from '@stencil/core/testing';

import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../utils/types';
import { DATA_STREAMS } from '../charts/common/tests/chart/constants';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';
import { update } from '../charts/common/tests/merge';
import { MonitorWidgetGrid } from './monitor-widget-grid';
import { DataPoint, MinimalViewPortConfig } from '../../utils/dataTypes';
import { DAY_IN_MS, MINUTE_IN_MS } from '../../utils/time';
import { CellOptions, RenderCell } from './types';
import {
  ALARM_STREAM,
  ALARM_THRESHOLD,
  DATA_STREAM,
  DATA_WITH_ALARM_ASSOCIATION,
  STRING_STREAM_1,
} from '../../testing/__mocks__/mockWidgetProperties';

const mockCurrentTime = (mockedDate: Date) => {
  // @ts-ignore
  Date.now = jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.getTime());
};

const VIEW_PORT: MinimalViewPortConfig = {
  ...DEFAULT_CHART_CONFIG.viewPort,
  duration: MINUTE_IN_MS,
};

const widgetGridSpecPage = async (propOverrides: Partial<Components.MonitorWidgetGrid> = {}) => {
  const page = await newSpecPage({
    components: [MonitorWidgetGrid],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const renderCell: RenderCell = jest.fn();

  const widgetGrid = page.doc.createElement('monitor-widget-grid') as CustomHTMLElement<Components.MonitorWidgetGrid>;
  const props: Components.MonitorStatusGrid = {
    annotations: {},
    messageOverrides: {},
    liveModeOnlyMessage: 'liveModeOnlyMessage',
    labelsConfig: {},
    widgetId: 'monitor-status-grid-widget-id',
    isEditing: false,
    dataStreams: DATA_STREAMS,
    viewPort: VIEW_PORT,
    renderCell,
    ...propOverrides,
  };
  update(widgetGrid, props);
  page.body.appendChild(widgetGrid);

  await page.waitForChanges();

  return { page, widgetGrid, renderCell };
};

describe('when enabled', () => {
  it('renders cell', async () => {
    const { renderCell } = await widgetGridSpecPage();
    expect(renderCell).toBeCalled();
  });

  it('renders cell per info', async () => {
    const { renderCell } = await widgetGridSpecPage({
      dataStreams: [DATA_STREAM, { ...DATA_STREAM, id: '2' }, { ...DATA_STREAM, id: '3' }],
    });

    expect(renderCell).toBeCalledTimes(3);
  });

  it('renders string cell', async () => {
    const { renderCell } = await widgetGridSpecPage({
      dataStreams: [STRING_STREAM_1],
    });

    expect(renderCell).toBeCalledTimes(1);
    expect(renderCell).toBeCalledWith(
      expect.objectContaining({
        propertyStream: STRING_STREAM_1,
        propertyPoint: STRING_STREAM_1.data[0],
      } as Partial<CellOptions>)
    );
  });

  it('does not render a help icon', async () => {
    const { widgetGrid } = await widgetGridSpecPage();

    expect(widgetGrid.querySelector('monitor-help-tooltip')).toBeNull();
  });
});

describe('updating the viewport', () => {
  it('updates the viewport and renders a cell with the data point that was previously outside of the viewport', async () => {
    const laterDate = new Date(VIEW_PORT.end!.getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };

    const { renderCell, widgetGrid, page } = await widgetGridSpecPage({
      viewPort: VIEW_PORT,
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [SOME_LATER_POINT],
        },
      ],
    });

    expect(renderCell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        propertyPoint: undefined,
      })
    );

    update(widgetGrid, {
      viewPort: {
        ...VIEW_PORT,
        end: laterDate,
      },
    });

    await page.waitForChanges();

    expect(renderCell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        propertyPoint: SOME_LATER_POINT,
      })
    );
  });

  it('updates the viewport based on duration', async () => {
    const DATE_NOW = new Date(2000, 0, 0);
    mockCurrentTime(DATE_NOW);

    const { renderCell, widgetGrid, page } = await widgetGridSpecPage({
      viewPort: VIEW_PORT,
    });

    update(widgetGrid, {
      viewPort: {
        duration: DAY_IN_MS,
      },
    });

    await page.waitForChanges();

    expect(renderCell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        viewPort: {
          start: new Date(DATE_NOW.getTime() - DAY_IN_MS),
          end: DATE_NOW,
        },
      })
    );
  });

  it('updates the viewport based on duration and a start date', async () => {
    const { renderCell, widgetGrid, page } = await widgetGridSpecPage({
      viewPort: VIEW_PORT,
    });

    const startDate = new Date(2000, 0, 0);

    update(widgetGrid, {
      viewPort: {
        duration: DAY_IN_MS,
        start: startDate,
      },
    });

    await page.waitForChanges();

    expect(renderCell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        viewPort: {
          start: startDate,
          end: new Date(startDate.getTime() + DAY_IN_MS),
        },
      })
    );
  });

  it('updates the viewport based on duration and a end date', async () => {
    const { renderCell, widgetGrid, page } = await widgetGridSpecPage({
      viewPort: VIEW_PORT,
    });

    const endDate = new Date(2000, 0, 0);

    update(widgetGrid, {
      viewPort: {
        duration: DAY_IN_MS,
        end: endDate,
      },
    });

    await page.waitForChanges();

    expect(renderCell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        viewPort: {
          start: new Date(endDate.getTime() - DAY_IN_MS),
          end: endDate,
        },
      })
    );
  });
});

describe('live time frame', () => {
  const POINT: DataPoint<number> = { x: (VIEW_PORT.end as Date).getTime(), y: 100 };
  const STRING_POINT: DataPoint<string> = { x: (VIEW_PORT.end as Date).getTime(), y: 'im a string!' };

  it('does render cell with string data', async () => {
    const stream = { ...STRING_STREAM_1, data: [STRING_POINT] };
    const { renderCell } = await widgetGridSpecPage({
      dataStreams: [stream],
    });

    expect(renderCell).toBeCalledTimes(1);
    expect(renderCell).toBeCalledWith(
      expect.objectContaining({
        propertyPoint: STRING_POINT,
        propertyStream: stream,
      } as Partial<CellOptions>)
    );
  });

  it('does render cell with raw data', async () => {
    const stream = {
      ...DATA_STREAM,
      data: [POINT],
      resolution: 0,
    };

    const { renderCell } = await widgetGridSpecPage({
      dataStreams: [stream],
    });

    expect(renderCell).toBeCalledTimes(1);
    expect(renderCell).toBeCalledWith(
      expect.objectContaining({
        propertyPoint: POINT,
        propertyStream: stream,
      } as Partial<CellOptions>)
    );
  });

  it('does not render point which is past the end of the viewport', async () => {
    const stream = {
      ...DATA_STREAM,
      // Shift point to be one minute past the end of the viewport
      data: [{ ...POINT, x: (VIEW_PORT.end as Date).getTime() + MINUTE_IN_MS }],
    };

    const { renderCell } = await widgetGridSpecPage({
      dataStreams: [stream],
    });

    expect(renderCell).toBeCalledTimes(1);
    expect(renderCell).toBeCalledWith(
      expect.objectContaining({
        propertyPoint: undefined,
        propertyStream: stream,
      } as Partial<CellOptions>)
    );
  });

  it('does not pass `point` to cell when no point is defined', async () => {
    const stream = {
      ...DATA_STREAM,
      data: [],
    };

    const { renderCell } = await widgetGridSpecPage({
      dataStreams: [stream],
    });

    expect(renderCell).toBeCalledTimes(1);
    expect(renderCell).toBeCalledWith(
      expect.objectContaining({
        propertyPoint: undefined,
        propertyStream: stream,
      } as Partial<CellOptions>)
    );
  });

  it('does not render cell with non-raw data', async () => {
    const stream = {
      ...DATA_STREAM,
      resolution: MINUTE_IN_MS,
      data: [],
      aggregation: {
        [MINUTE_IN_MS]: [POINT],
      },
    };
    const { renderCell } = await widgetGridSpecPage({
      dataStreams: [stream],
    });

    expect(renderCell).toBeCalledTimes(1);
    expect(renderCell).toBeCalledWith(
      expect.objectContaining({
        propertyPoint: undefined,
        propertyStream: stream,
      } as Partial<CellOptions>)
    );
  });

  describe('alarms', () => {
    const propertyPoint: DataPoint<number> = {
      x: new Date(2000, 0, 0).getTime(),
      y: 100,
    };

    it('with an alarm data stream that is breached, display the color of the breached threshold', async () => {
      const propertyStream = { ...DATA_WITH_ALARM_ASSOCIATION, data: [propertyPoint] };
      const { renderCell } = await widgetGridSpecPage({
        dataStreams: [ALARM_STREAM, propertyStream],
        annotations: { y: [ALARM_THRESHOLD] },
      });

      // Has only one cell
      expect(renderCell).toBeCalledTimes(1);

      // Renders a combined property and alarm cell
      expect(renderCell).toBeCalledWith(
        expect.objectContaining({
          isEnabled: true,
          alarmPoint: (ALARM_STREAM.data[0] as unknown) as DataPoint,
          alarmStream: ALARM_STREAM,
          propertyPoint,
          propertyStream,
          breachedThreshold: ALARM_THRESHOLD,
          valueColor: ALARM_THRESHOLD.color,
          icon: ALARM_THRESHOLD.icon,
        } as Partial<CellOptions>)
      );
    });

    it('with an alarm data stream that is breached, display the color of the breached threshold only on alarm stream when alarm is not associated', async () => {
      const stream = { ...DATA_STREAM, data: [propertyPoint] };
      const { renderCell } = await widgetGridSpecPage({
        dataStreams: [stream, ALARM_STREAM],
        annotations: { y: [ALARM_THRESHOLD] },
      });

      expect(renderCell).toBeCalledTimes(2);

      /** Property Cell */
      expect(renderCell).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          propertyStream: stream,
          propertyPoint,
          valueColor: undefined,
          icon: undefined,
          breachedThreshold: undefined,
        } as Partial<CellOptions>)
      );

      /** Alarm Cell */
      expect(renderCell).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          alarmStream: ALARM_STREAM,
          alarmPoint: (ALARM_STREAM.data[0] as unknown) as DataPoint,
          valueColor: ALARM_THRESHOLD.color,
          icon: ALARM_THRESHOLD.icon,
          breachedThreshold: ALARM_THRESHOLD,
        } as Partial<CellOptions>)
      );
    });
  });
});

describe('historical time frame', () => {
  const NON_LIVE_VIEW_PORT: MinimalViewPortConfig = {
    ...VIEW_PORT,
    duration: undefined,
  };

  it('renders cell as disabled', async () => {
    const { renderCell } = await widgetGridSpecPage({
      viewPort: NON_LIVE_VIEW_PORT,
      dataStreams: [DATA_STREAM],
    });

    expect(renderCell).toBeCalledTimes(1);
    expect(renderCell).toBeCalledWith(
      expect.objectContaining({
        isEnabled: false,
        propertyPoint: undefined,
        valueColor: undefined,
      } as Partial<CellOptions>)
    );
  });

  it('renders a help icon', async () => {
    const { widgetGrid } = await widgetGridSpecPage({
      viewPort: NON_LIVE_VIEW_PORT,
    });

    expect(widgetGrid.querySelector('monitor-help-tooltip')).not.toBeNull();
  });
});
