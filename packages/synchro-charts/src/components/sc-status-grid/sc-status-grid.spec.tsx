import { newSpecPage } from '@stencil/core/testing';

import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../utils/types';
import { DATA_STREAMS } from '../charts/common/tests/chart/constants';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';
import { update } from '../charts/common/tests/merge';
import { DataStream, DataPoint } from '../../utils/dataTypes';
import { MINUTE_IN_MS } from '../../utils/time';
import { ScGrid } from '../sc-grid/sc-grid';
import { ScStatusGrid } from './sc-status-grid';
import { ALARM_STREAM, ALARM_THRESHOLD, DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';
import { ScWidgetGrid } from '../sc-widget-grid/sc-widget-grid';
import { ScGridTooltip } from '../sc-widget-grid/sc-grid-tooltip';
import { DataType, StreamType } from '../../utils/dataConstants';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
};

const WIDGET_ID = 'test-widget-it';

const NUMBER_STREAM: DataStream<number> = {
  id: 'some-number-stream-id',
  name: 'some number stream',
  color: 'black',
  resolution: 0,
  dataType: DataType.NUMBER,
  data: [],
};

const STRING_STREAM: DataStream<string> = {
  id: 'some-string-stream-id',
  name: 'some string stream',
  color: 'red',
  resolution: 0,
  dataType: DataType.STRING,
  data: [],
};

const statusGridSpecPage = async (propOverrides: Partial<Components.ScStatusGrid> = {}) => {
  const page = await newSpecPage({
    components: [ScGrid, ScStatusGrid, ScWidgetGrid, ScGridTooltip],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const statusGrid = page.doc.createElement('sc-status-grid') as CustomHTMLElement<Components.ScStatusGrid>;
  const props: Partial<Components.ScStatusGrid> = {
    widgetId: WIDGET_ID,
    dataStreams: DATA_STREAMS,
    viewport: VIEWPORT,
    labelsConfig: {
      showValue: true,
      showName: true,
      showUnit: true,
    },
    ...propOverrides,
  };
  update(statusGrid, props);
  page.body.appendChild(statusGrid);

  await page.waitForChanges();

  return { page, statusGrid };
};

describe('when enabled', () => {
  it('renders a grid cell', async () => {
    const { statusGrid } = await statusGridSpecPage();

    const cells = statusGrid.querySelectorAll('sc-status-cell');

    expect(cells.length).not.toBe(0);
  });

  it('passes down a default labelsConfig when none provided', async () => {
    const { statusGrid } = await statusGridSpecPage({ labelsConfig: undefined });
    const cell = statusGrid.querySelector('sc-status-cell') as HTMLScStatusCellElement;

    expect(cell.labelsConfig).toEqual({
      showValue: true,
      showName: true,
      showUnit: true,
    });
  });

  it('renders cell per numerical data stream', async () => {
    const dataStreams = [NUMBER_STREAM, { ...NUMBER_STREAM, id: 'id-2' }];

    const { statusGrid } = await statusGridSpecPage({ dataStreams });

    const cells = statusGrid.querySelectorAll('sc-status-cell');
    expect(cells.length).toBe(dataStreams.length);
  });

  it('does render string data streams', async () => {
    const { statusGrid } = await statusGridSpecPage({ dataStreams: [STRING_STREAM] });

    const cells = statusGrid.querySelectorAll('sc-status-cell');
    expect(cells).toHaveLength(1);
  });

  it('does not render a help icon', async () => {
    const { statusGrid } = await statusGridSpecPage();

    expect(statusGrid.querySelector('sc-help-tooltip')).toBeNull();
  });

  it('renders on cell for an alarm plus a property info, when associated', async () => {
    const point: DataPoint<number> = {
      x: (VIEWPORT.end as Date).getTime(),
      y: 100,
    };
    const ASSOCIATED_DATA_STREAM: DataStream<number> = {
      ...DATA_STREAM,
      data: [point],
      associatedStreams: [{ id: ALARM_STREAM.id, type: StreamType.ALARM }],
    };
    const { statusGrid } = await statusGridSpecPage({
      dataStreams: [ALARM_STREAM, ASSOCIATED_DATA_STREAM],
      annotations: { y: [ALARM_THRESHOLD] },
    });

    // alarm and property are visualized together within a single cell
    const cells = statusGrid.querySelectorAll('sc-status-cell');
    expect(cells.length).toBe(1);

    const cell = cells[0];

    expect(cell.isEnabled).not.toBeFalse();
    expect(cell.alarmStream).toBe(ALARM_STREAM);
    expect(cell.alarmPoint).toBe(ALARM_STREAM.data[0]);
    expect(cell.propertyPoint).toBe(point);
    expect(cell.propertyStream).toBe(ASSOCIATED_DATA_STREAM);
  });
});

describe('alarms', () => {
  it('with an alarm data stream that is breached, display the color of the breached threshold', async () => {
    const ASSOCIATED_DATA_STREAM: DataStream<number> = {
      ...DATA_STREAM,
      associatedStreams: [{ id: ALARM_STREAM.id, type: StreamType.ALARM }],
    };
    const { statusGrid } = await statusGridSpecPage({
      dataStreams: [ALARM_STREAM, ASSOCIATED_DATA_STREAM],
      annotations: { y: [ALARM_THRESHOLD] },
    });

    const cells = statusGrid.querySelectorAll('sc-status-cell');
    expect(cells).toHaveLength(1);

    const cell = cells[0];
    expect(cell.alarmStream).toBe(ALARM_STREAM);
    expect(cell).toEqualAttribute('valueColor', ALARM_THRESHOLD.color);
    expect(cell).toEqualAttribute('icon', ALARM_THRESHOLD.icon);
    expect(cell.propertyStream).toBe(ASSOCIATED_DATA_STREAM);
  });

  it('with an alarm data stream that is breached, display the color of the breached threshold only on alarm stream when alarm is not associated', async () => {
    const { statusGrid } = await statusGridSpecPage({
      dataStreams: [DATA_STREAM, ALARM_STREAM],
      annotations: { y: [ALARM_THRESHOLD] },
    });

    const cells = statusGrid.querySelectorAll('sc-status-cell');
    expect(cells).toHaveLength(2);

    const propertyCell = cells[0];
    expect(propertyCell.propertyStream).toBe(DATA_STREAM);
    expect(propertyCell).not.toHaveAttribute('valueColor');
    expect(propertyCell).not.toHaveAttribute('icon');
    expect(propertyCell.alarmStream).toBeUndefined();
    expect(propertyCell.alarmPoint).toBeUndefined();

    const alarmCell = cells[1];
    expect(alarmCell.alarmStream).toBe(ALARM_STREAM);
    expect(alarmCell).toEqualAttribute('valueColor', ALARM_THRESHOLD.color);
    expect(alarmCell).toEqualAttribute('icon', ALARM_THRESHOLD.icon);
    expect(alarmCell.propertyStream).toBeUndefined();
    expect(alarmCell.propertyPoint).toBeUndefined();
  });
});

describe('when disabled', () => {
  it('renders cell per data stream', async () => {
    const NON_LIVE_VIEWPORT = {
      ...VIEWPORT,
      duration: undefined,
    };

    const { statusGrid } = await statusGridSpecPage({
      viewport: NON_LIVE_VIEWPORT,
      dataStreams: [NUMBER_STREAM, STRING_STREAM],
    });

    const cells = statusGrid.querySelectorAll('sc-status-cell');
    expect(cells.length).toBe(2);
  });

  it('renders a help icon', async () => {
    const NON_LIVE_VIEWPORT = {
      ...VIEWPORT,
      duration: undefined,
    };

    const { statusGrid } = await statusGridSpecPage({
      viewport: NON_LIVE_VIEWPORT,
    });

    expect(statusGrid.querySelector('sc-help-tooltip')).not.toBeNull();
  });
});

it('should dispatch widgetUpdated with data stream updates when label changed', async () => {
  const { page, statusGrid } = await statusGridSpecPage({ dataStreams: [NUMBER_STREAM, STRING_STREAM] });

  const cell = statusGrid.querySelector('sc-status-cell') as HTMLScStatusCellElement;

  const newName = 'New Name';

  const spy = jest.fn();
  page.doc.addEventListener('widgetUpdated', spy);

  const changeLabelEvent = new CustomEvent('changeLabel', {
    streamId: NUMBER_STREAM.id,
    name: newName,
  } as any);

  cell.dispatchEvent(changeLabelEvent);
  await page.waitForChanges();

  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0].detail).toEqual(
    expect.objectContaining({
      dataStreams: [
        { id: NUMBER_STREAM.id, name: newName },
        { id: STRING_STREAM.id, name: STRING_STREAM.name },
      ],
      widgetId: WIDGET_ID,
    })
  );
});
