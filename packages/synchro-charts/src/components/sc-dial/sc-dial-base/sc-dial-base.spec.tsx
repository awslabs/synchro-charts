import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { ScGridTooltip } from '../../sc-widget-grid/sc-grid-tooltip';
import { ScDialBase } from './sc-dial-base';
import { update } from '../../charts/common/tests/merge';
import { DEFAULT_CHART_CONFIG } from '../../charts/sc-webgl-base-chart/chartDefaults';
import { MINUTE_IN_MS } from '../../../utils/time';
import { NUMBER_STREAM_1 } from '../../../testing/__mocks__/mockWidgetProperties';
import { ScErrorBadge } from '../../sc-error-badge/sc-error-badge';

const VIEWPORT = {
  ...DEFAULT_CHART_CONFIG.viewport,
  duration: MINUTE_IN_MS,
  yMin: 0,
  yMax: 5000,
};

const newValueSpecPage = async (propOverrides: Partial<Components.ScDialBase> = {}) => {
  const page = await newSpecPage({
    components: [ScGridTooltip, ScDialBase, ScErrorBadge],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dialBase = page.doc.createElement('sc-dial-base') as CustomHTMLElement<Components.ScDialBase>;
  const props: Partial<Components.ScDialBase> = {
    viewport: VIEWPORT,
    ...propOverrides,
  };
  update(dialBase, props);
  page.body.appendChild(dialBase);

  await page.waitForChanges();

  return { page, dialBase };
};

it('renders normal data when has data', async () => {
  const { dialBase } = await newValueSpecPage({
    propertyStream: NUMBER_STREAM_1,
    propertyPoint: NUMBER_STREAM_1.data[0],
  });

  const dialLoading = dialBase.querySelectorAll('[data-testid="loading"]');
  const dialDialSvg = dialBase.querySelectorAll('sc-dial-svg');
  const errorBadge = dialBase.querySelectorAll('sc-error-badge');
  expect(dialLoading.length).toBe(0);
  expect(dialDialSvg.length).toBe(1);
  expect(errorBadge.length).toBe(0);
});

it('renders error message when has error data', async () => {
  const { dialBase } = await newValueSpecPage({
    propertyStream: { ...NUMBER_STREAM_1, error: 'Invalid value' },
    propertyPoint: NUMBER_STREAM_1.data[0],
  });

  const dialLoading = dialBase.querySelectorAll('[data-testid="loading"]');
  const dialDialSvg = dialBase.querySelectorAll('sc-dial-svg');
  const errorBadge = dialBase.querySelectorAll('sc-error-badge');
  expect(dialLoading.length).toBe(0);
  expect(dialDialSvg.length).toBe(1);
  expect(errorBadge.length).toBe(1);
});

it('renders loading when loading condition', async () => {
  const { dialBase } = await newValueSpecPage({
    isLoading: true,
    propertyStream: { ...NUMBER_STREAM_1, data: [] },
    propertyPoint: undefined,
  });

  const dialDialSvg = dialBase.querySelectorAll('sc-dial-svg');
  const errorBadge = dialBase.querySelectorAll('sc-error-badge');
  expect(dialDialSvg.length).toBe(1);
  expect(errorBadge.length).toBe(0);
});
