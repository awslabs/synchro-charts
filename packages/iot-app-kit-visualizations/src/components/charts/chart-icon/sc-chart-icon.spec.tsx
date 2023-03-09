import { newSpecPage } from '@stencil/core/testing';

import { ScChartIcon } from './sc-chart-icon';
import { Components } from '../../../components';
import { CustomHTMLElement } from '../../../utils/types';
import { update } from '../common/tests/merge';
import { StatusIcon } from '../common/constants';

const newChartIconSpecPage = async (props: Partial<Components.IotAppKitVisChartIcon>) => {
  const page = await newSpecPage({
    components: [ScChartIcon],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const chartIcon = page.doc.createElement('iot-app-kit-vis-chart-icon') as CustomHTMLElement<
    Components.IotAppKitVisChartIcon
  >;
  const defaultProps: Components.IotAppKitVisChartIcon = {
    name: StatusIcon.NORMAL,
  };

  update(chartIcon, { ...defaultProps, ...props });

  page.body.appendChild(chartIcon);

  await page.waitForChanges();

  return { page, chartIcon };
};

it('creates empty icon if no name is provided', async () => {
  const { chartIcon } = await newChartIconSpecPage({});
  expect(chartIcon.querySelectorAll('.sc-chart-icon')).not.toBeEmpty();
  const icon = chartIcon.querySelector('svg');
  expect(icon).not.toBeEmpty();
});

it('creates normal status icon if NORMAL is provided', async () => {
  const { chartIcon } = await newChartIconSpecPage({
    name: StatusIcon.NORMAL,
  });
  const icon = chartIcon.querySelector('svg');
  expect(icon).not.toBeEmpty();
  expect(icon).toEqualAttribute('fill', '#1d8102');
});

it('creates normal status icon with color provided', async () => {
  const { chartIcon } = await newChartIconSpecPage({
    name: StatusIcon.NORMAL,
    color: 'white',
  });
  const icon = chartIcon.querySelector('svg');
  expect(icon).not.toBeEmpty();
  expect(icon).toEqualAttribute('fill', 'white');
});
