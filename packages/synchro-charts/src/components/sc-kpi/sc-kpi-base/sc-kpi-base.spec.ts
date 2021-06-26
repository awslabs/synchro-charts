import { newSpecPage } from '@stencil/core/testing';

import { update } from '../../charts/common/tests/merge';

import { CustomHTMLElement } from '../../../utils/types';
import { Components } from '../../../components.d';
import { ScKpiBase } from './sc-kpi-base';
import { DataStream, DataStreamInfo, DEFAULT_MESSAGE_OVERRIDES } from '../../../utils/dataTypes';

import { VIEW_PORT } from '../../charts/common/testUtil';
import { HOUR_IN_MS, YEAR_IN_MS } from '../../../utils/time';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { DATA_STREAM, THRESHOLD } from '../../../testing/__mocks__/mockWidgetProperties';
import { DataType } from '../../../utils/dataConstants';
import { StatusIcon } from '../../charts/common/constants';

const CURRENT_VALUE_SELECTOR = "[data-testid='current-value']";
const PREV_VALUE_SELECTOR = "[data-testid='previous-value']";
const TREND_SELECTOR = '.trend';

const STRING_DATA_STREAM_INFOS: DataStreamInfo[] = [
  {
    id: '1',
    resolution: 0,
    name: 'stream 1',
    color: 'red',
    dataType: DataType.STRING,
  },
];

const newValueSpecPage = async (propOverrides: Partial<Components.ScKpiBase> = {}) => {
  const page = await newSpecPage({
    components: [ScKpiBase],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const chart = page.doc.createElement('sc-kpi-base') as CustomHTMLElement<Components.ScKpiBase>;

  const props: Partial<Components.ScKpiBase> = {
    isEditing: false,
    isLoading: false,
    isRefreshing: false,
    isEnabled: true,
    messageOverrides: {},
    trendStream: undefined,
    propertyStream: DATA_STREAM,
    viewPort: VIEW_PORT,
    miniVersion: false,
    onChangeLabel: () => null,
    ...propOverrides,
  };

  update(chart, props);
  page.body.appendChild(chart);

  await page.waitForChanges();

  return { page, chart };
};

const SOME_Y_VALUE = 100;

describe('disabled', () => {
  it('renders placeholder text when point is within viewport', async () => {
    const { chart } = await newValueSpecPage({
      isEnabled: false,
      viewPort: {
        start: new Date(1999, 0, 0),
        end: new Date(2001, 0, 0),
        duration: YEAR_IN_MS,
      },
      propertyPoint: { x: new Date(2000, 0, 10).getTime(), y: 123 },
      propertyStream: DATA_STREAM,
    });

    const valueContainer = chart.querySelector(CURRENT_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer).not.toBeNull();
    expect(valueContainer.textContent).toEqual(NO_VALUE_PRESENT);
  });
});

describe('messageOverrides', () => {
  it.skip('when override provided, utilize it', async () => {
    const MY_MSG_OVERRIDE = 'MY_MSG_OVERRIDE';
    const { chart } = await newValueSpecPage({
      messageOverrides: {
        liveTimeFrameValueLabel: MY_MSG_OVERRIDE,
      },
      // Setup scenario where the 'live time frame value label' renders
      propertyPoint: {
        x: Date.now(),
        y: 123,
      },
      propertyStream: DATA_STREAM,
    });

    expect(chart.innerHTML).not.toContain(DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel);
    expect(chart.innerHTML).toContain(MY_MSG_OVERRIDE);
  });
});

describe('latest value', () => {
  it('renders single data points value which is within the viewPort', async () => {
    const { chart } = await newValueSpecPage({
      viewPort: {
        start: new Date(1999, 0, 0),
        end: new Date(2001, 0, 0),
        duration: HOUR_IN_MS,
      },
      propertyPoint: { x: new Date(2000, 0, 1).getTime(), y: SOME_Y_VALUE },
      propertyStream: DATA_STREAM,
    });

    const valueContainer = chart.querySelector(CURRENT_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer).not.toBeNull();
    expect((valueContainer.textContent as string).trim()).toEqual(SOME_Y_VALUE.toString());
  });

  it('renders no value when no data is present', async () => {
    const { chart } = await newValueSpecPage({ propertyPoint: undefined });
    const valueContainer = chart.querySelector(CURRENT_VALUE_SELECTOR) as HTMLElement;

    expect(valueContainer).not.toBeNull();
    expect(valueContainer.textContent).toBe(NO_VALUE_PRESENT);
  });

  it('renders data for a single datapoint that is outside of the date range', async () => {
    const LATEST_VALUE = 1298;
    const { chart } = await newValueSpecPage({
      viewPort: {
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
      },
      propertyPoint: { x: new Date(1999, 0, 0).getTime(), y: LATEST_VALUE },
      propertyStream: DATA_STREAM,
    });

    const valueContainer = chart.querySelector(CURRENT_VALUE_SELECTOR) as HTMLElement;

    expect(valueContainer).not.toBeNull();
    expect(valueContainer.textContent).toBe(LATEST_VALUE.toString());
  });

  it('renders data for a single datapoint that is outside of the date range defined by duration', async () => {
    const LATEST_VALUE = 8910;

    const { chart } = await newValueSpecPage({
      viewPort: { duration: YEAR_IN_MS },
      propertyPoint: { x: new Date(1994, 0, 0).getTime(), y: LATEST_VALUE },
      propertyStream: DATA_STREAM,
    });

    const valueContainer = chart.querySelector(CURRENT_VALUE_SELECTOR) as HTMLElement;

    expect(valueContainer).not.toBeNull();
    expect(valueContainer.textContent).toBe(LATEST_VALUE.toString());
  });
});

describe('trend', () => {
  it('displays previous value as a percentage', async () => {
    const SOME_PREVIOUS_Y = 999;
    const EXPECTED_PERCENTAGE = '90%';
    const { chart } = await newValueSpecPage({
      trendStream: {
        id: 'some-id',
        name: 'some-name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [
          { x: new Date(2000, 0, 0).getTime(), y: SOME_PREVIOUS_Y },
          { x: new Date(2000, 0, 1).getTime(), y: SOME_Y_VALUE },
        ],
      },
    });

    const valueContainer = chart.querySelector(PREV_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer).not.toBeNull();
    expect(valueContainer.textContent).toEqual(EXPECTED_PERCENTAGE);
  });

  it('displays the previous value from a given set of data partially within the viewPort', async () => {
    const Y_VALUE_1 = 100;
    const Y_VALUE_2 = 150;
    const Y_VALUE_3 = 125;
    const EXPECTED_PERCENTAGE = '16.7%';

    const { chart } = await newValueSpecPage({
      viewPort: {
        duration: 5 * YEAR_IN_MS,
      },
      trendStream: {
        id: 'some-id',
        name: 'some-name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [
          { x: new Date(2000, 0, 0).getTime(), y: 99999 },
          { x: Date.now() - 3 * YEAR_IN_MS, y: Y_VALUE_1 },
          { x: Date.now() - 2 * YEAR_IN_MS, y: Y_VALUE_2 },
          { x: Date.now() - YEAR_IN_MS, y: Y_VALUE_3 },
        ],
      },
    });

    const valueContainer = chart.querySelector(PREV_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer).not.toBeNull();
    expect(valueContainer.textContent).toEqual(EXPECTED_PERCENTAGE);
  });

  it('displays the trend as 0% when value and prevValue are both 0', async () => {
    const { chart } = await newValueSpecPage({
      viewPort: {
        duration: 5 * YEAR_IN_MS,
      },
      trendStream: {
        id: 'some-id',
        name: 'some-name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [{ x: Date.now() - 2 * YEAR_IN_MS, y: 0 }, { x: Date.now() - YEAR_IN_MS, y: 0 }],
      },
    });

    const valueContainer = chart.querySelector(PREV_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer.textContent).toEqual('0%');
  });

  it('displays no previous value on trend when previous value is 0 but current value is positive', async () => {
    const { chart } = await newValueSpecPage({
      viewPort: {
        duration: 5 * YEAR_IN_MS,
      },
      trendStream: {
        id: 'some-id',
        name: 'some-name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [{ x: Date.now() - 2 * YEAR_IN_MS, y: 0 }, { x: Date.now() - YEAR_IN_MS, y: 100 }],
      },
    });

    const valueContainer = chart.querySelector(PREV_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer.textContent).toBeEmpty();
  });

  it('displays no previous value on trend when previous value is 0 but current value is negative', async () => {
    const { chart } = await newValueSpecPage({
      viewPort: {
        duration: 5 * YEAR_IN_MS,
      },
      trendStream: {
        id: 'some-id',
        name: 'some-name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [{ x: Date.now() - 2 * YEAR_IN_MS, y: 0 }, { x: Date.now() - YEAR_IN_MS, y: -100 }],
      },
    });

    const valueContainer = chart.querySelector(PREV_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer.textContent).toBeEmpty();
  });

  it('does not display any previous value when there is no data', async () => {
    const { chart } = await newValueSpecPage({
      trendStream: {
        id: 'some-id',
        name: 'some-name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [],
      },
    });

    const valueContainer = chart.querySelector(PREV_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer).toBeNull();
  });

  it('does not display any previous value when there is only one datum', async () => {
    const { chart } = await newValueSpecPage({
      trendStream: {
        id: 'some-id',
        name: 'some-name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [{ x: Date.now(), y: 100 }],
      },
    });

    const valueContainer = chart.querySelector(PREV_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer).toBeNull();
  });

  it('does display a previous value when values are outside of date range', async () => {
    const { chart } = await newValueSpecPage({
      trendStream: {
        id: 'some-id',
        name: 'some-name',
        resolution: 0,
        dataType: DataType.NUMBER,
        data: [
          { x: new Date(1993, 0, 0).getTime(), y: 99999 },
          { x: new Date(1994, 0, 0).getTime(), y: 100 },
          { x: new Date(3333, 0, 0).getTime(), y: 200 },
          { x: new Date(5555, 0, 1).getTime(), y: 300 },
        ],
      },
    });

    const valueContainer = chart.querySelector(PREV_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer).not.toBeNull();
  });
});

describe('mini version of value base', () => {
  it('does not show descriptor', async () => {
    const { chart } = await newValueSpecPage({
      miniVersion: true,
    });

    const descriptor = chart.querySelectorAll('.descriptor');
    expect(descriptor.length).toBe(0);
  });
});

describe('error badge', () => {
  it('displays error when `error` present', async () => {
    const { chart } = await newValueSpecPage({
      propertyStream: { ...DATA_STREAM, error: 'my-custom-error' },
    });

    const errorBadge = chart.querySelectorAll("[data-testid='warning']");
    expect(errorBadge.length).toBe(1);
  });

  it('does not display error when `error` is undefined', async () => {
    const { chart } = await newValueSpecPage({
      propertyStream: { ...DATA_STREAM, error: undefined },
    });

    const errorBadge = chart.querySelector("[data-testid='warning']");
    expect(errorBadge).toBeNull();
  });
});

describe('loading state', () => {
  it('shows loading screen when loading set to true', async () => {
    const { chart } = await newValueSpecPage({ isLoading: true });

    const loading = chart.querySelectorAll('sc-loading-spinner');
    expect(loading.length).toBe(1);
  });

  it('does not show loading screen when is loading changed to false', async () => {
    const { chart, page } = await newValueSpecPage({ isLoading: true });

    expect(chart.querySelectorAll('sc-loading-spinner').length).toBe(1);

    update(chart, { isLoading: false });
    await page.waitForChanges();

    expect(chart.querySelectorAll('sc-loading-spinner').length).toBe(0);
  });

  it('does show loading screen when data gets populated if still loading', async () => {
    const { chart, page } = await newValueSpecPage({ isLoading: true });

    expect(chart.querySelectorAll('sc-loading-spinner').length).toBe(1);

    update(chart, {
      propertyPoint: { x: new Date(1994, 0, 0).getTime(), y: 100 },
    });
    await page.waitForChanges();

    expect(chart.querySelectorAll('sc-loading-spinner').length).toBe(1);
  });
});

describe('valueColor', () => {
  it('renders value the provided `valueColor`', async () => {
    const valueColor = 'red';
    const { chart } = await newValueSpecPage({ valueColor, propertyPoint: { x: Date.now(), y: 123 } });

    const valueContainer = chart.querySelector('.value-wrapper') as HTMLElement;
    expect(valueContainer.style.color).toBe(valueColor);
  });
});

describe('icon', () => {
  it('renders no icon when `icon` not present', async () => {
    const { chart } = await newValueSpecPage({ breachedThreshold: { ...THRESHOLD, icon: undefined } });

    const chartIcon = chart.querySelector('sc-chart-icon') as HTMLScChartIconElement;
    expect(chartIcon).toBeNull();
  });

  it('renders icon when `provided`', async () => {
    const { chart } = await newValueSpecPage({ breachedThreshold: { ...THRESHOLD, icon: StatusIcon.DISABLED } });

    const chartIcon = chart.querySelector('sc-chart-icon') as HTMLScChartIconElement;
    expect(chartIcon).not.toBeNull();
  });

  it('does not render icon when not enabled', async () => {
    const { chart } = await newValueSpecPage({
      breachedThreshold: { ...THRESHOLD, icon: StatusIcon.DISABLED },
      isEnabled: false,
    });

    const chartIcon = chart.querySelector('sc-chart-icon');
    expect(chartIcon).toBeNull();
  });
});

describe('string data type behavior', () => {
  const INFO = STRING_DATA_STREAM_INFOS[0];
  const STRING_DATA_STREAM: DataStream<string> = {
    id: INFO.id,
    name: INFO.name,
    color: INFO.color,
    resolution: 0,
    dataType: DataType.STRING,
    data: [{ x: new Date(2000, 0, 0).getTime(), y: 'RED' }, { x: new Date(2000, 0, 1).getTime(), y: 'BLUE' }],
  };

  it('does not show trends when the current data type is string', async () => {
    const { chart } = await newValueSpecPage({
      propertyStream: STRING_DATA_STREAM,
      trendStream: STRING_DATA_STREAM,
    });

    const trendContainer = chart.querySelector(TREND_SELECTOR);
    expect(trendContainer).toBeNull();
  });

  it('renders string', async () => {
    const LATEST_STRING = 'LATEST_STRING';

    const { chart } = await newValueSpecPage({
      propertyPoint: { x: new Date(2000, 0, 1).getTime(), y: LATEST_STRING },
      propertyStream: STRING_DATA_STREAM,
      trendStream: STRING_DATA_STREAM,
    });

    const valueContainer = chart.querySelector(CURRENT_VALUE_SELECTOR) as HTMLElement;
    expect(valueContainer.textContent).toEqual(LATEST_STRING);
  });
});
