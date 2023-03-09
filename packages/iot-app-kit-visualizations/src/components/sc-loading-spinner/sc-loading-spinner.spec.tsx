import { newSpecPage } from '@stencil/core/testing';
import { update } from '../charts/common/tests/merge';

import { CustomHTMLElement } from '../../utils/types';
import { Components } from '../../components';
import { ScLoadingSpinner } from './sc-loading-spinner';

const newLoadingSpinner = async (props: Partial<Components.IotAppKitVisLoadingSpinner> = {}) => {
  const page = await newSpecPage({
    components: [ScLoadingSpinner],
    html: '<div></div>',
    supportsShadowDom: true,
  });
  const loadingSpinner = page.doc.createElement('iot-app-kit-vis-loading-spinner') as CustomHTMLElement<
    Components.IotAppKitVisLoadingSpinner
  >;
  update(loadingSpinner, props);
  page.body.appendChild(loadingSpinner);
  await page.waitForChanges();
  // @ts-ignore
  const svg = loadingSpinner.shadowRoot.querySelector('svg') as SVGElement;
  return { page, loadingSpinner: svg };
};

describe('size', () => {
  it('does not specify height and width when no size provided', async () => {
    const { loadingSpinner } = await newLoadingSpinner({
      size: undefined,
    });
    expect(loadingSpinner.style.height).toBe('');
    expect(loadingSpinner.style.width).toBe('');
  });

  it('does specify height and width when size provided', async () => {
    const SIZE = 34;
    const { loadingSpinner } = await newLoadingSpinner({
      size: SIZE,
    });
    expect(loadingSpinner.style.height).toBe(`${SIZE}px`);
    expect(loadingSpinner.style.width).toBe(`${SIZE}px`);
  });
});

describe('dark mode', () => {
  it('does not have the dark class present when dark is false', async () => {
    const { loadingSpinner } = await newLoadingSpinner({
      dark: false,
    });
    expect(loadingSpinner).not.toHaveClass('dark');
  });

  it('does have the dark class present when dark is true', async () => {
    const { loadingSpinner } = await newLoadingSpinner({
      dark: true,
    });
    expect(loadingSpinner).toHaveClass('dark');
  });
});
