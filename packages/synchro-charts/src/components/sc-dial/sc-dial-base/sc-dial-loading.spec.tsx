import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../components';
import { CustomHTMLElement } from '../../../utils/types';
import { update } from '../../charts/common/tests/merge';
import { ScDialLoading } from './sc-dial-loading';

const DIAMETER = 138;
const newValueSpecPage = async (props: Partial<Components.ScDialLoading> = {}) => {
  const page = await newSpecPage({
    components: [ScDialLoading],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dialLoading = page.doc.createElement('sc-dial-loading') as CustomHTMLElement<Components.ScDialLoading>;
  update(dialLoading, { diameter: DIAMETER, ...props });
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
  const circle = dialLoadingSvg.querySelector('circle')?.attributes.getNamedItem('stroke-width')?.value;
  const text = dialLoadingSvg.querySelector('text')?.attributes.getNamedItem('font-size')?.value;

  expect(dialLoadingSvg.textContent).toBe(loading);
  expect(circle).toEqual('1');
  expect(text).toEqual('30');
});
