import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { update } from '../charts/common/tests/merge';

import { CustomHTMLElement, Size } from '../../utils/types';
import { Components } from '../../components.d';
import { ScSizeProvider } from './sc-size-provider';
import { ScBox } from '../../testing/testing-ground/sc-box/sc-box';
import { SECOND_IN_MS } from '../../utils/time';
import { wait } from '../../testing/wait';

const newWidgetSizerSpecPage = async (containerSize: Size, overrides: Partial<Components.ScSizeProvider> = {}) => {
  const { width, height } = containerSize;
  const page = await newSpecPage({
    components: [ScSizeProvider, ScBox],
    html: `<div id="container" style="width: ${width}px; height: ${height}px"></div>`,
    supportsShadowDom: false,
  });
  const widgetSizer = page.doc.createElement('sc-size-provider') as CustomHTMLElement<Components.ScSizeProvider>;

  const defaultProps: Components.ScSizeProvider = {
    renderFunc: jest.fn((size: Size) => <sc-box size={size} />),
  };
  update(widgetSizer, { ...defaultProps, ...overrides });

  page.body.appendChild(widgetSizer);

  await page.waitForChanges();
  return { page, widgetSizer };
};

const CONTAINER_SIZE = { width: 200, height: 300 };

/**
 * NOTE: Having the size set enables the `renderFunc` to be called on every re-render, making
 *       it a useful condition for certain tests.
 *
 * Warning: Observer will not fire or work as expected in jest test. This makes certain unit tests impossible to write.
 */

it.skip('does not render on initial load when size is not set', async () => {
  // container size is the size of the container holder our widget
  const { widgetSizer } = await newWidgetSizerSpecPage(CONTAINER_SIZE, { size: undefined });
  expect(widgetSizer.renderFunc).not.toBeCalled();
});

describe.skip('when size is set', () => {
  const size = { width: 120, height: 300 };

  it('renders on initial load when size is set', async () => {
    const { widgetSizer } = await newWidgetSizerSpecPage(CONTAINER_SIZE, { size });
    expect(widgetSizer.renderFunc).toBeCalledTimes(1);
  });

  it('does not re-render in idle time when the DOM is not changing dimensions', async () => {
    const { widgetSizer, page } = await newWidgetSizerSpecPage(CONTAINER_SIZE, { size });

    jest.resetAllMocks();

    await wait(SECOND_IN_MS);
    await page.waitForChanges();

    expect(widgetSizer.renderFunc).not.toBeCalled();
  });

  it.skip('does re-render when size is updated after a period of time', () => {
    // TODO: Need to manually manipulate the DOM without altering the props to have a good assertion here.
  });
});
