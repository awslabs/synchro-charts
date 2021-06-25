/* eslint-disable no-underscore-dangle */
import { newSpecPage } from '@stencil/core/testing';
import userEvent from '@testing-library/user-event';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../utils/types';
import { update } from '../charts/common/tests/merge';
import { ScHelpTooltip } from './sc-help-tooltip';

const TOOLTIP_SELECTOR = '[role="tooltip"]';

const getTooltip = (el: HTMLElement | HTMLDocument) => el.querySelector(TOOLTIP_SELECTOR);

const isTooltipOpen = (el: HTMLElement) => {
  // Defaults to have the tooltip closed
  // @ts-ignore - _styles is a weird stencil thing.
  const styles = getTooltip(el).style._styles;
  return styles.get('display') !== 'none';
};

const newHelpIconSpecPage = async (props: Components.ScHelpTooltip) => {
  const page = await newSpecPage({
    components: [ScHelpTooltip],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const helpIcon = page.doc.createElement('sc-help-tooltip') as CustomHTMLElement<Components.ScHelpTooltip>;

  update(helpIcon, props);

  page.body.appendChild(helpIcon);

  await page.waitForChanges();

  return { page, helpIcon };
};

it('renders correctly', async () => {
  const { helpIcon } = await newHelpIconSpecPage({ message: 'msg' });

  expect(helpIcon).toMatchSnapshot();
});

it('renders message provided', async () => {
  const MSG = 'some msg';
  const { helpIcon } = await newHelpIconSpecPage({ message: MSG });

  expect(helpIcon.innerHTML).toContain(MSG);
});

it('opens tooltip', async () => {
  let { helpIcon } = await newHelpIconSpecPage({ message: 'msg' });

  expect(isTooltipOpen(helpIcon)).toBeFalse();

  // Open tooltip
  userEvent.hover(helpIcon.querySelector('div') as HTMLElement);

  expect(isTooltipOpen(helpIcon)).toBeTrue();

  userEvent.unhover(helpIcon.querySelector('div') as HTMLElement);

  helpIcon = (await newHelpIconSpecPage({ message: 'msg' })).helpIcon;

  expect(isTooltipOpen(helpIcon)).toBeFalse();
});

it('should remove tooltip when component unloads', async () => {
  const { helpIcon, page } = await newHelpIconSpecPage({ message: 'msg' });

  helpIcon.remove();

  expect(getTooltip(page.doc)).toBeNull();
});
