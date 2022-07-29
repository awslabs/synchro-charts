import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../utils/types';
import { DATA_STREAMS } from '../charts/common/tests/chart/constants';
import { ScDial } from './sc-dial';
import { DEFAULT_CHART_CONFIG } from '../charts/sc-webgl-base-chart/chartDefaults';
import { DAY_IN_MS, MINUTE_IN_MS } from '../../utils/time';
import { update } from '../charts/common/tests/merge';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';
import { DataPoint } from '../../models';
import { Y_MAX, Y_MIN } from '../../testing/test-routes/charts/constants';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
  yMin: Y_MIN,
  yMax: Y_MAX,
};

const mockCurrentTime = (mockedDate: Date) => {
  // @ts-ignore
  Date.now = jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.getTime());
};

const newValueSpecPage = async (propOverrides: Partial<Components.ScDial> = {}) => {
  const page = await newSpecPage({
    components: [ScDial],
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

describe('updating the viewport', () => {
  it('updates the viewport and renders a cell with the data point that was previously outside of the viewport', async () => {
    const laterDate = new Date((new Date(2020, 1, 0, 0) as Date).getTime() + MINUTE_IN_MS);
    const SOME_LATER_POINT: DataPoint<number> = { y: 111, x: laterDate.getTime() };

    const { dial, page } = await newValueSpecPage({
      viewport: DEFAULT_CHART_CONFIG.viewport,
      dataStream: {
        ...DATA_STREAM,
        data: [SOME_LATER_POINT],
      },
    });

    update(dial, {
      viewport: {
        ...DEFAULT_CHART_CONFIG.viewport,
      },
    });

    await page.waitForChanges();
  });

  it('updates the viewport based on duration', async () => {
    const DATE_NOW = new Date(2000, 0, 0);
    mockCurrentTime(DATE_NOW);

    const { dial, page } = await newValueSpecPage({
      viewport: VIEWPORT,
    });

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2000, 1, 0);

    update(dial, {
      viewport: {
        start: startDate,
        end: endDate,
        duration: DAY_IN_MS,
        yMin: Y_MIN,
        yMax: Y_MAX,
      },
    });

    await page.waitForChanges();
  });

  it('updates the viewport based on a start date and end date', async () => {
    const { dial, page } = await newValueSpecPage({
      viewport: VIEWPORT,
    });

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2000, 1, 0);

    update(dial, {
      viewport: {
        start: startDate,
        end: endDate,
        duration: DAY_IN_MS,
        yMin: Y_MIN,
        yMax: Y_MAX,
      },
    });

    await page.waitForChanges();
  });
});
