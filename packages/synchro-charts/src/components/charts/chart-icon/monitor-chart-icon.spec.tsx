import { newSpecPage } from '@stencil/core/testing';

import { MonitorChartIcon } from './monitor-chart-icon';
import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { update } from '../common/tests/merge';
import { StatusIcon } from '../common/constants';

const newChartIconSpecPage = async (props: Partial<Components.MonitorChartIcon>) => {
  const page = await newSpecPage({
    components: [MonitorChartIcon],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const chartIcon = page.doc.createElement('monitor-chart-icon') as CustomHTMLElement<Components.MonitorChartIcon>;
  const defaultProps: Components.MonitorChartIcon = {
    name: StatusIcon.NORMAL,
  };

  update(chartIcon, { ...defaultProps, ...props });

  page.body.appendChild(chartIcon);

  await page.waitForChanges();

  return { page, chartIcon };
};

it('creates empty icon if no name is provided', async () => {
  const { chartIcon } = await newChartIconSpecPage({});
  expect(chartIcon.querySelectorAll('.monitor-chart-icon')).not.toBeEmpty();
  const icon = chartIcon.querySelector('svg');
  expect(icon).not.toBeEmpty;
});

it('creates normal status icon if NORMAL is provided', async () => {
  const { chartIcon } = await newChartIconSpecPage({
    name: StatusIcon.NORMAL,
  });
  const icon = chartIcon.querySelector('svg');
  expect(icon).not.toBeEmpty;
  expect(icon).toEqualAttribute('fill', '#1d8102');
});

it('creates normal status icon with color provided', async () => {
  const { chartIcon } = await newChartIconSpecPage({
    name: StatusIcon.NORMAL,
    color: 'white',
  });
  const icon = chartIcon.querySelector('svg');
  expect(icon).not.toBeEmpty;
  expect(icon).toEqualAttribute('fill', 'white');
});
