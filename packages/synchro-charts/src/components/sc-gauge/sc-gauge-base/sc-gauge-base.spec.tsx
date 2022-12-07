import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../components';
import { CustomHTMLElement } from '../../../utils/types';
import { ScGridTooltip } from '../../sc-widget-grid/sc-grid-tooltip';
import { update } from '../../charts/common/tests/merge';
import { DEFAULT_CHART_CONFIG } from '../../charts/sc-webgl-base-chart/chartDefaults';
import { MINUTE_IN_MS } from '../../../utils/time';
import { NUMBER_STREAM_1 } from '../../../testing/__mocks__/mockWidgetProperties';
import { ScErrorBadge } from '../../sc-error-badge/sc-error-badge';
import { ScGaugeBase } from './sc-gauge-base';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
  yMin: 0,
  yMax: 5000,
};

const newValueSpecPage = async (propOverrides: Partial<Components.ScGaugeBase> = {}) => {
  const page = await newSpecPage({
    components: [ScGridTooltip, ScGaugeBase, ScErrorBadge],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const gaugeBase = page.doc.createElement('sc-gauge-base') as CustomHTMLElement<Components.ScGaugeBase>;
  const props: Partial<Components.ScGaugeBase> = {
    viewport: VIEWPORT,
    ...propOverrides,
  };
  update(gaugeBase, props);
  page.body.appendChild(gaugeBase);

  await page.waitForChanges();

  return { page, gaugeBase };
};

it('renders normal data when has data', async () => {
  const { gaugeBase } = await newValueSpecPage({
    propertyStream: NUMBER_STREAM_1,
    propertyPoint: NUMBER_STREAM_1.data[0],
  });

  const gaugeLoading = gaugeBase.querySelectorAll('[data-testid="loading"]');
  const gaugegaugeSvg = gaugeBase.querySelectorAll('sc-gauge-svg');
  const errorBadge = gaugeBase.querySelectorAll('sc-error-badge');
  expect(gaugeLoading.length).toBe(0);
  expect(gaugegaugeSvg.length).toBe(1);
  expect(errorBadge.length).toBe(0);
});

it('renders error message when has error data', async () => {
  const { gaugeBase } = await newValueSpecPage({
    propertyStream: { ...NUMBER_STREAM_1, error: 'Invalid value' },
    propertyPoint: NUMBER_STREAM_1.data[0],
  });

  const gaugeLoading = gaugeBase.querySelectorAll('[data-testid="loading"]');
  const gaugegaugeSvg = gaugeBase.querySelectorAll('sc-gauge-svg');
  const errorBadge = gaugeBase.querySelectorAll('sc-error-badge');
  expect(gaugeLoading.length).toBe(0);
  expect(gaugegaugeSvg.length).toBe(1);
  expect(errorBadge.length).toBe(1);
});

it('renders loading when loading condition', async () => {
  const { gaugeBase } = await newValueSpecPage({
    isLoading: true,
    propertyStream: { ...NUMBER_STREAM_1, data: [] },
    propertyPoint: undefined,
  });

  const gaugegaugeSvg = gaugeBase.querySelectorAll('sc-gauge-svg');
  const errorBadge = gaugeBase.querySelectorAll('sc-error-badge');
  expect(gaugegaugeSvg.length).toBe(1);
  expect(errorBadge.length).toBe(0);
});
