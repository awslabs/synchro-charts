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
  const dialLoading = page.doc.createElement('sc-gauge-loading') as CustomHTMLElement<Components.ScGaugeLoading>;
  update(dialLoading, { offsetY: DIAMETER, ...props });
  page.body.appendChild(dialLoading);
  await page.waitForChanges();

  return { page, dialLoading };
};

it('renders loading component when isLoading is false', async () => {
  const loading = 'Loading';
  const { dialLoading } = await newValueSpecPage({
    strokeWidth: 1,
    iconSize: 20,
    labelSize: 30,
    loadingText: loading,
  });

  const dialLoadingSvg = dialLoading.querySelector('svg') as SVGGraphicsElement;
  const paths = dialLoadingSvg.querySelectorAll('path');
  const path = paths[paths.length - 1]?.attributes.getNamedItem('fill')?.value;
  const text = dialLoadingSvg.querySelector('text')?.attributes.getNamedItem('font-size')?.value;

  expect(dialLoadingSvg.textContent).toBe(loading);
  expect(path).toEqual(ColorConfigurations.GRAY);
  expect(text).toEqual('30');
});
