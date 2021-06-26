import { newSpecPage } from '@stencil/core/testing';
import { update } from '../charts/common/tests/merge';

import { CustomHTMLElement } from '../../utils/types';
import { ScExpandableInput } from './sc-expandable-input';
import { Components } from '../../components.d';

const noop = () => {};

const newInputSpecPage = async (props: Components.ScExpandableInput) => {
  const page = await newSpecPage({
    components: [ScExpandableInput],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const input = page.doc.createElement('sc-expandable-input') as CustomHTMLElement<Components.ScExpandableInput>;
  update(input, props);
  page.body.appendChild(input);
  await page.waitForChanges();
  return { page, input, span: input.firstChild as HTMLSpanElement };
};

it('sets default value of input', async () => {
  const INPUT_VALUE = 'some text';
  const { span } = await newInputSpecPage({
    value: INPUT_VALUE,
    isDisabled: true,
    onValueChange: noop,
  });
  expect(span.textContent).toEqual(INPUT_VALUE);
});

it('has class disabled when disabled', async () => {
  const INPUT_VALUE = 'some text';
  const { span } = await newInputSpecPage({
    value: INPUT_VALUE,
    isDisabled: true,
    onValueChange: noop,
  });
  expect(span.className).toInclude('disabled');
});

it('does not have class disabled when not disabled', async () => {
  const { span } = await newInputSpecPage({
    value: '',
    isDisabled: false,
    onValueChange: noop,
  });
  expect(span.className).not.toInclude('disabled');
});
