import { newSpecPage } from '@stencil/core/testing';

import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../utils/types';
import { DATA_STREAMS } from '../charts/common/tests/chart/constants';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';
import { update } from '../charts/common/tests/merge';
import { ScKpi } from './sc-kpi';
import { ScSizeProvider } from '../sc-size-provider/sc-size-provider';
import { MINUTE_IN_MS } from '../../utils/time';
import {
  ALARM_STREAM,
  ALARM_THRESHOLD,
  DATA_STREAM,
  DATA_WITH_ALARM_ASSOCIATION,
  STRING_STREAM_1,
  STRING_STREAM_2,
} from '../../testing/__mocks__/mockWidgetProperties';
import { ScWidgetGrid } from '../sc-widget-grid/sc-widget-grid';
import { ScGridTooltip } from '../sc-widget-grid/sc-grid-tooltip';
import { DataPoint, MinimalLiveViewport } from '../../utils/dataTypes';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
};

const newValueSpecPage = async (propOverrides: Partial<Components.ScKpi> = {}) => {
  const page = await newSpecPage({
    components: [ScKpi, ScSizeProvider, ScWidgetGrid, ScGridTooltip],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const kpi = page.doc.createElement('sc-kpi') as CustomHTMLElement<Components.ScKpi>;
  const props: Partial<Components.ScKpi> = {
    widgetId: 'test-kpi-widget',
    isEditing: false,
    dataStreams: DATA_STREAMS,
    viewport: VIEWPORT,
    ...propOverrides,
  };
  update(kpi, props);
  page.body.appendChild(kpi);

  await page.waitForChanges();

  return { page, kpi };
};
describe('when enabled', () => {
  it('renders a base kpi', async () => {
    const { kpi } = await newValueSpecPage({ dataStreams: [DATA_STREAM] });

    const kpiBases = kpi.querySelectorAll('sc-kpi-base');
    expect(kpiBases.length).toBe(1);
  });

  it('renders base kpi per numerical data stream', async () => {
    const dataStreams = [DATA_STREAM, STRING_STREAM_1, STRING_STREAM_2];

    const { kpi } = await newValueSpecPage({ dataStreams });

    const kpiBases = kpi.querySelectorAll('sc-kpi-base');
    expect(kpiBases.length).toBe(dataStreams.length);
  });

  it('does render string data streams', async () => {
    const { kpi } = await newValueSpecPage({ dataStreams: [STRING_STREAM_1] });

    const kpiBases = kpi.querySelectorAll('sc-kpi-base');
    expect(kpiBases).toHaveLength(1);
  });

  it('does not render a help icon', async () => {
    const viewport: MinimalLiveViewport = {
      yMin: 0,
      yMax: 10000,
      duration: MINUTE_IN_MS,
    };
    const { kpi } = await newValueSpecPage({ viewport });

    expect(kpi.querySelector('sc-help-tooltip')).toBeNull();
  });

  it('displays error from data stream', async () => {
    const error = 'some error';
    const { kpi } = await newValueSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          error,
        },
      ],
      annotations: { y: [ALARM_THRESHOLD] },
    });

    const cell = kpi.querySelector('sc-kpi-base');
    expect(cell).toEqualAttribute('error', error);
  });

  describe('alarms', () => {
    const pointInViewport: DataPoint<number> = {
      x: new Date(2000, 0, 0).getTime(),
      y: 100,
    };

    it('with an alarm data stream that is breached, display the color of the breached threshold', async () => {
      const stream = { ...DATA_WITH_ALARM_ASSOCIATION, data: [pointInViewport] };

      const { kpi } = await newValueSpecPage({
        dataStreams: [ALARM_STREAM, stream],
        annotations: { y: [ALARM_THRESHOLD] },
      });

      const cells = kpi.querySelectorAll('sc-kpi-base');
      expect(cells).toHaveLength(1);

      const cell = cells[0];

      expect(cell.isEnabled).not.toBeFalse();

      expect(cell.alarmStream).toBe(ALARM_STREAM);
      expect(cell.alarmPoint).toBe(ALARM_STREAM.data[0]);

      expect(cell.propertyStream).toBe(stream);
      expect(cell.propertyPoint).toBe(pointInViewport);
    });

    it('with an alarm data stream that is breached, display the color of the breached threshold only on alarm stream when alarm is not associated', async () => {
      const stream = { ...DATA_STREAM, data: [pointInViewport] };
      const { kpi } = await newValueSpecPage({
        dataStreams: [stream, ALARM_STREAM],
        annotations: { y: [ALARM_THRESHOLD] },
      });

      const cells = kpi.querySelectorAll('sc-kpi-base');
      expect(cells).toHaveLength(2);

      const propertyCell = cells[0];
      expect(propertyCell.propertyStream).toBe(stream);
      expect(propertyCell.propertyPoint).toBe(pointInViewport);

      expect(propertyCell.alarmStream).toBeUndefined();
      expect(propertyCell.alarmPoint).toBeUndefined();

      expect(propertyCell).not.toHaveAttribute('valueColor');
      expect(propertyCell).not.toHaveAttribute('icon');

      const alarmCell = cells[1];
      expect(alarmCell.alarmPoint).toBe(ALARM_STREAM.data[0]);
      expect(alarmCell.alarmStream).toBe(ALARM_STREAM);

      expect(alarmCell.propertyPoint).toBeUndefined();
      expect(alarmCell.propertyStream).toBeUndefined();

      expect(alarmCell).toEqualAttribute('valueColor', ALARM_THRESHOLD.color);
      expect(alarmCell).toEqualAttribute('icon', ALARM_THRESHOLD.icon);
    });
  });
});

describe('when disabled', () => {
  it('renders base kpi per data stream', async () => {
    const NON_LIVE_VIEWPORT = {
      ...DEFAULT_CHART_CONFIG.viewport,
    };

    const dataStreams = [STRING_STREAM_1, STRING_STREAM_2, DATA_STREAM, ALARM_STREAM];

    const { kpi } = await newValueSpecPage({
      viewport: NON_LIVE_VIEWPORT,
      dataStreams,
    });

    const kpiBases = kpi.querySelectorAll('sc-kpi-base');
    expect(kpiBases.length).toBe(dataStreams.length);
  });

  it('renders a help icon', async () => {
    const NON_LIVE_VIEWPORT = {
      ...DEFAULT_CHART_CONFIG.viewport,
    };

    const { kpi } = await newValueSpecPage({
      viewport: NON_LIVE_VIEWPORT,
    });

    expect(kpi.querySelector('sc-help-tooltip')).not.toBeNull();
  });
});
