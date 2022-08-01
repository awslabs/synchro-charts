import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../utils/types';
import { DATA_STREAMS } from '../charts/common/tests/chart/constants';
import { ScDial } from './sc-dial';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';
import { MINUTE_IN_MS } from '../../utils/time';
import { update } from '../charts/common/tests/merge';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';
import { DataPoint, DataStream, Threshold } from '../../models';
import { Y_MAX, Y_MIN } from '../../testing/test-routes/charts/constants';
import { ScDialBase } from './sc-dial-base/sc-dial-base';
import { COMPARISON_OPERATOR, StatusIcon, StreamType } from '../../constants';
import { getThresholds } from '../charts/common/annotations/utils';
import { breachedThreshold } from '../charts/common/annotations/breachedThreshold';
import { isMinimalStaticViewport } from '../../utils/predicates';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
  yMin: Y_MIN,
  yMax: Y_MAX,
};

const newValueSpecPage = async (propOverrides: Partial<Components.ScDial> = {}) => {
  const page = await newSpecPage({
    components: [ScDial, ScDialBase],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dial = page.doc.createElement('sc-dial') as CustomHTMLElement<Components.ScDial>;
  const props: Partial<Components.ScDialBase> = {
    widgetId: 'test-dial-widget',
    dataStream: DATA_STREAMS[0],
    viewport: VIEWPORT,
    ...propOverrides,
  };
  update(dial, props);
  page.body.appendChild(dial);

  await page.waitForChanges();

  return { page, dial };
};

describe('Only input data stream', () => {
  it('Render dial base component', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const { dial } = await newValueSpecPage({ dataStream: { ...DATA_STREAM, data: [SOME_LATER_POINT] } });

    const dialBases = dial.querySelectorAll('sc-dial-base');
    expect(dialBases.length).toBe(1);
  });

  it('Only input dataStream', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { dial } = await newValueSpecPage({ dataStream: DATA });

    const dialBases = dial.querySelectorAll('sc-dial-base');
    expect(dialBases.length).toBe(1);

    expect(dialBases[0].propertyStream).toBe(DATA);
    expect(dialBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(dialBases[0].alarmStream).toBeUndefined();
    expect(dialBases[0].breachedThreshold).toBeUndefined();
    expect(dialBases[0].viewport).toBe(VIEWPORT);
    expect(dialBases[0].valueColor).toBeUndefined();
    expect(dialBases[0].isLoading).toBe(false);
  });

  it('DataStream is loading', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT], isLoading: true };
    const { dial } = await newValueSpecPage({ dataStream: DATA });

    const dialBases = dial.querySelectorAll('sc-dial-base');
    expect(dialBases.length).toBe(1);

    expect(dialBases[0].propertyStream).toBe(DATA);
    expect(dialBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(dialBases[0].alarmStream).toBeUndefined();
    expect(dialBases[0].breachedThreshold).toBeUndefined();
    expect(dialBases[0].viewport).toBe(VIEWPORT);
    expect(dialBases[0].valueColor).toBeUndefined();
    expect(dialBases[0].isLoading).toBe(true);
  });
});

describe('alarm', () => {
  const ANNOTIONS = {
    y: [
      {
        color: '#000',
        value: 'Normal',
        comparisonOperator: COMPARISON_OPERATOR.EQUAL,
        dataStreamIds: ['some-id'],
        icon: StatusIcon.NORMAL,
      },
    ],
  };
  const ASSOCIATEDSTREAMS = [
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
    const { dial } = await newValueSpecPage({ dataStream: DATA, annotations: ANNOTIONS });

    const dialBases = dial.querySelectorAll('sc-dial-base');
    expect(dialBases.length).toBe(1);

    expect(dialBases[0].propertyStream).toBe(DATA);
    expect(dialBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(dialBases[0].alarmStream).toBeUndefined();
    expect(dialBases[0].breachedThreshold).toBeUndefined();
    expect(dialBases[0].viewport).toBe(VIEWPORT);
    expect(dialBases[0].valueColor).toBeUndefined();
    expect(dialBases[0].isLoading).toBe(false);
  });

  it('when `associatedStreams` does not include datastream id', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { dial } = await newValueSpecPage({
      dataStream: DATA,
      annotations: ANNOTIONS,
      associatedStreams: ASSOCIATEDSTREAMS,
    });

    const dialBases = dial.querySelectorAll('sc-dial-base');
    expect(dialBases.length).toBe(1);

    expect(dialBases[0].propertyStream).toBe(DATA);
    expect(dialBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(dialBases[0].alarmStream).toBeUndefined();
    expect(dialBases[0].breachedThreshold).toBeUndefined();
    expect(dialBases[0].viewport).toBe(VIEWPORT);
    expect(dialBases[0].valueColor).toBeUndefined();
    expect(dialBases[0].isLoading).toBe(false);
  });

  it('when `associatedStreams` includes datastream id', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { dial } = await newValueSpecPage({
      dataStream: DATA,
      annotations: ANNOTIONS,
      associatedStreams: [ASSOCIATEDSTREAMS[0], { id: DATA_STREAM.id, type: StreamType.ALARM }],
    });

    const dialBases = dial.querySelectorAll('sc-dial-base');
    expect(dialBases.length).toBe(1);

    const threshold = getThresholds(ANNOTIONS).filter(a => a.icon)[0] || getBreachedThreshold(SOME_LATER_POINT, DATA);
    expect(dialBases[0].propertyStream).toBe(DATA);
    expect(dialBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(dialBases[0].alarmStream).toBe(DATA);
    expect(dialBases[0].breachedThreshold).toBe(threshold);
    expect(dialBases[0].viewport).toBe(VIEWPORT);
    expect(dialBases[0].valueColor).toBeUndefined();
    expect(dialBases[0].isLoading).toBe(false);
  });

  it('when `annotations` includes y and thresholdOptions', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const { dial } = await newValueSpecPage({
      dataStream: DATA,
      annotations: { ...ANNOTIONS, thresholdOptions: { showColor: true } },
      associatedStreams: [ASSOCIATEDSTREAMS[0], { id: DATA_STREAM.id, type: StreamType.ALARM }],
    });

    const dialBases = dial.querySelectorAll('sc-dial-base');
    expect(dialBases.length).toBe(1);

    const threshold = getThresholds(ANNOTIONS).filter(a => a.icon)[0] || getBreachedThreshold(SOME_LATER_POINT, DATA);
    expect(dialBases[0].propertyStream).toBe(DATA);
    expect(dialBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(dialBases[0].alarmStream).toBe(DATA);
    expect(dialBases[0].breachedThreshold).toBe(threshold);
    expect(dialBases[0].viewport).toBe(VIEWPORT);
    expect(dialBases[0].valueColor).toBe(ANNOTIONS.y[0].color);
    expect(dialBases[0].isLoading).toBe(false);
  });

  it('when `annotations` includes y without datastream id in dataStreamIds', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };
    const DATA = { ...DATA_STREAM, data: [SOME_LATER_POINT] };
    const ANNOTIONS_0 = {
      y: [
        {
          color: '#000',
          value: 'Normal',
          comparisonOperator: COMPARISON_OPERATOR.EQUAL,
          dataStreamIds: ['car-speed-alarm'],
          icon: StatusIcon.NORMAL,
        },
      ],
    };
    const { dial } = await newValueSpecPage({
      dataStream: DATA,
      annotations: ANNOTIONS_0,
      associatedStreams: [ASSOCIATEDSTREAMS[0], { id: DATA_STREAM.id, type: StreamType.ALARM }],
    });

    const dialBases = dial.querySelectorAll('sc-dial-base');
    expect(dialBases.length).toBe(1);

    const threshold =
      getThresholds(ANNOTIONS_0)
        .filter(a => a.icon)
        .filter(a => a.dataStreamIds?.includes(DATA_STREAM.id))[0] || getBreachedThreshold(SOME_LATER_POINT, DATA);

    expect(threshold).toBeUndefined();
    expect(dialBases[0].propertyStream).toBe(DATA);
    expect(dialBases[0].propertyPoint).toBe(SOME_LATER_POINT);
    expect(dialBases[0].alarmStream).toBe(DATA);
    expect(dialBases[0].breachedThreshold).toBeUndefined();
    expect(dialBases[0].viewport).toBe(VIEWPORT);
    expect(dialBases[0].valueColor).toBeUndefined();
    expect(dialBases[0].isLoading).toBe(false);
  });
});
