import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../components';
import { CustomHTMLElement } from '../../../utils/types';
import { update } from '../../charts/common/tests/merge';
import { ColorConfigurations } from '../../common/constants';
import { DIAMETER } from '../utils/util';
import { ScGaugeLoading } from './sc-gauge-loading';

const newValueSpecPage = async (props: Partial<Components.ScGaugeLoading> = {}) => {
  const page = await newSpecPage({
    components: [ScGaugeLoading],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const gaugeLoading = page.doc.createElement('sc-gauge-loading') as CustomHTMLElement<Components.ScGaugeLoading>;
  update(gaugeLoading, { offsetY: DIAMETER, ...props });
  page.body.appendChild(gaugeLoading);
  await page.waitForChanges();

  return { page, gaugeLoading };
};

it('renders loading component when isLoading is false', async () => {
  const loading = 'Loading';
  const { gaugeLoading } = await newValueSpecPage({
    strokeWidth: 1,
    iconSize: 20,
    labelSize: 30,
    loadingText: loading,
  });

  const gaugeLoadingSvg = gaugeLoading.querySelector('svg') as SVGGraphicsElement;
  const paths = gaugeLoadingSvg.querySelectorAll('path');
  const path = paths[paths.length - 1]?.attributes.getNamedItem('fill')?.value;
  const text = gaugeLoadingSvg.querySelector('text')?.attributes.getNamedItem('font-size')?.value;

  expect(gaugeLoadingSvg.textContent).toBe(loading);
  expect(path).toEqual(ColorConfigurations.GRAY);
  expect(text).toEqual('30');
});
