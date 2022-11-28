import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../components';
import { CustomHTMLElement } from '../../utils/types';
import { DATA_STREAMS } from '../charts/common/tests/chart/constants';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';
import { MINUTE_IN_MS } from '../../utils/time';
import { update } from '../charts/common/tests/merge';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';
import { DataPoint, DataStream, Threshold } from '../../models';
import { Y_MAX, Y_MIN } from '../../testing/test-routes/charts/constants';
import { COMPARISON_OPERATOR, StatusIcon, StreamType } from '../../constants';
import { getThresholds } from '../charts/common/annotations/utils';
import { breachedThreshold } from '../charts/common/annotations/breachedThreshold';
import { isMinimalStaticViewport } from '../../utils/predicates';
import { ScGauge } from './sc-gauge';
import { ScGaugeBase } from './sc-gauge-base/sc-gauge-base';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
  yMin: Y_MIN,
  yMax: Y_MAX,
};

const newValueSpecPage = async (propOverrides: Partial<Components.ScGauge> = {}) => {
  const page = await newSpecPage({
    components: [ScGauge, ScGaugeBase],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const gauge = page.doc.createElement('sc-gauge') as CustomHTMLElement<Components.ScGauge>;
  const props: Partial<Components.ScGaugeBase> = {
    widgetId: 'test-dial-widget',
    dataStream: DATA_STREAMS[0],
    viewport: VIEWPORT,
    ...propOverrides,
  };
  update(gauge, props);
  page.body.appendChild(gauge);

  await page.waitForChanges();

  return { page, gauge };
};

describe('Only input data stream', () => {
  it('Render dial base component', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const { gauge } = await newValueSpecPage({ dataStream: { ...DATA_STREAM, data: [SOME_LATER_POINT] } });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);
  });

  it('Only input dataStream', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { gauge } = await newValueSpecPage({ dataStream: DATA });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);

    expect(gaugeBases[0].propertyStream).toBe(DATA);
    expect(gaugeBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(gaugeBases[0].alarmStream).toBeUndefined();
    expect(gaugeBases[0].breachedThreshold).toBeUndefined();
    expect(gaugeBases[0].viewport).toBe(VIEWPORT);
    expect(gaugeBases[0].isLoading).toBe(false);
  });

  it('DataStream is loading', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT], isLoading: true };
    const { gauge } = await newValueSpecPage({ dataStream: DATA });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);

    expect(gaugeBases[0].propertyStream).toBe(DATA);
    expect(gaugeBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(gaugeBases[0].alarmStream).toBeUndefined();
    expect(gaugeBases[0].breachedThreshold).toBeUndefined();
    expect(gaugeBases[0].viewport).toBe(VIEWPORT);
    expect(gaugeBases[0].isLoading).toBe(true);
  });
});

describe('alarm', () => {
  const alarmValue = {
    low: {
      value: 'Critical',
      icon: StatusIcon.ERROR,
    },
    middle: {
      value: 'Warning',
      icon: StatusIcon.LATCHED,
    },
    high: {
      value: 'Normal',
      icon: StatusIcon.NORMAL,
    },
  };
  const ANNOTIONS = {
    y: [
      {
        color: '#C03F25',
        value: 1650,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        dataStreamIds: ['some-id'],
        label: {
          text: alarmValue.low.value,
          show: true,
        },
        icon: alarmValue.low.icon,
      },
      {
        color: '#F29D38',
        value: 3300,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
        dataStreamIds: ['some-id'],
        label: {
          text: alarmValue.middle.value,
          show: true,
        },
        icon: alarmValue.middle.icon,
      },
      {
        color: '#3F7E23',
        value: 3300,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        dataStreamIds: ['some-id'],
        label: {
          text: alarmValue.high.value,
          show: true,
        },
        icon: alarmValue.high.icon,
      },
    ],
  };

  const outerRingRange = [
    { percent: 0, value: 0, color: '', showValue: 0 },
    { percent: 0.33, value: 1650, color: '#C03F25', showValue: 1650 },
    { percent: 0.66, value: 3300, color: '#F29D38', showValue: 3300 },
    { percent: 1, value: 3300, color: '#3F7E23', showValue: 5000 },
  ];
  const ASSOCIATED_STREAMS = [
    {
      id: 'car-speed-alarm',
      type: StreamType.ALARM,
    },
  ];
  const getBreachedThreshold = (point: DataPoint | undefined, dataStream: DataStream): Threshold | undefined =>
    breachedThreshold({
      value: point && point.y,
      date: isMinimalStaticViewport(VIEWPORT) ? new Date(VIEWPORT.end) : new Date(),
      dataStreams: [dataStream],
      dataStream,
      thresholds: getThresholds(ANNOTIONS),
    });
  it('when `associatedStreams` is empty but `annotations` has value', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { gauge } = await newValueSpecPage({ dataStream: DATA, annotations: ANNOTIONS });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);

    expect(gaugeBases[0].propertyStream).toBe(DATA);
    expect(gaugeBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(gaugeBases[0].alarmStream).toBeUndefined();
    expect(gaugeBases[0].breachedThreshold).toBeUndefined();
    expect(gaugeBases[0].viewport).toBe(VIEWPORT);
    expect(gaugeBases[0].isLoading).toBe(false);
  });

  it('when `associatedStreams` does not include datastream id', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { gauge } = await newValueSpecPage({
      dataStream: DATA,
      annotations: ANNOTIONS,
      associatedStreams: ASSOCIATED_STREAMS,
    });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);

    expect(gaugeBases[0].propertyStream).toBe(DATA);
    expect(gaugeBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(gaugeBases[0].alarmStream).toBeUndefined();
    expect(gaugeBases[0].breachedThreshold).toBeUndefined();
    expect(gaugeBases[0].viewport).toBe(VIEWPORT);
    expect(gaugeBases[0].isLoading).toBe(false);
  });

  it('when `associatedStreams` includes datastream id', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { gauge } = await newValueSpecPage({
      dataStream: DATA,
      annotations: ANNOTIONS,
      associatedStreams: [ASSOCIATED_STREAMS[0], { id: DATA_STREAM.id, type: StreamType.ALARM }],
    });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);

    const threshold = getBreachedThreshold(SOME_LATER_POINT, DATA);
    expect(gaugeBases[0].propertyStream).toBe(DATA);
    expect(gaugeBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(gaugeBases[0].alarmStream).toBe(DATA);
    expect(gaugeBases[0].breachedThreshold).toBe(threshold);
    expect(gaugeBases[0].viewport).toBe(VIEWPORT);
    expect(gaugeBases[0].isLoading).toBe(false);
  });

  it('when `annotations` includes y and thresholdOptions', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { gauge } = await newValueSpecPage({
      dataStream: DATA,
      annotations: { ...ANNOTIONS, thresholdOptions: { showColor: true } },
      associatedStreams: [ASSOCIATED_STREAMS[0], { id: DATA_STREAM.id, type: StreamType.ALARM }],
    });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);

    const threshold = getBreachedThreshold(SOME_LATER_POINT, DATA);
    expect(gaugeBases[0].propertyStream).toBe(DATA);
    expect(gaugeBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(gaugeBases[0].alarmStream).toBe(DATA);
    expect(gaugeBases[0].breachedThreshold).toBe(threshold);
    expect(gaugeBases[0].viewport).toBe(VIEWPORT);
    expect(gaugeBases[0].isLoading).toBe(false);
  });

  it('when `annotations` includes y without datastream id in dataStreamIds', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT], id: 'test-id' };
    const associatedStreams = [ASSOCIATED_STREAMS[0]];
    const { gauge } = await newValueSpecPage({
      dataStream: DATA,
      annotations: ANNOTIONS,
      associatedStreams,
    });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);

    expect(gaugeBases[0].propertyStream).toBe(DATA);
    expect(gaugeBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(gaugeBases[0].alarmStream).toBeUndefined();
    expect(gaugeBases[0].breachedThreshold).toBeUndefined();
    expect(gaugeBases[0].viewport).toBe(VIEWPORT);
    expect(gaugeBases[0].isLoading).toBe(false);
  });

  it('The outer ring gets the display range when `annotations` includes y with arrays', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT], id: 'test-id' };
    const associatedStreams = [ASSOCIATED_STREAMS[0]];
    const { gauge } = await newValueSpecPage({
      dataStream: DATA,
      annotations: ANNOTIONS,
      associatedStreams,
    });

    const gaugeBases = gauge.querySelectorAll('sc-gauge-base');
    expect(gaugeBases.length).toBe(1);

    expect(JSON.stringify(gaugeBases[0].outerRingRange)).toBe(JSON.stringify(outerRingRange));
  });
});
