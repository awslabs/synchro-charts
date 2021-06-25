import { newSpecPage } from '@stencil/core/testing';
import { update } from '../charts/common/tests/merge';

import { CustomHTMLElement } from '../../utils/types';
import { ScDataStreamName } from './sc-data-stream-name';
import { Components } from '../../components';

const noop = () => {};

const newDataStreamNameSpecPage = async (props: Partial<Components.ScDataStreamName>) => {
  const page = await newSpecPage({
    components: [ScDataStreamName],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dataStreamName = page.doc.createElement('sc-data-stream-name') as CustomHTMLElement<
    Components.ScDataStreamName
  >;
  const defaultProps: Components.ScDataStreamName = {
    onNameChange: noop,
    isEditing: false,
    label: 'some-label',
  };
  update(dataStreamName, { ...defaultProps, ...props });
  page.body.appendChild(dataStreamName);
  await page.waitForChanges();
  return { page, dataStreamName };
};

it('displays label in tooltip when detailed label not provided', async () => {
  const LABEL = 'new-label';
  const { dataStreamName } = await newDataStreamNameSpecPage({
    label: LABEL,
  });
  expect(dataStreamName.innerText).toInclude(LABEL);
});

it('displays detailed label in tooltip when provided', async () => {
  const LABEL = 'new-label';
  const DETAILED_LABEL = 'detailed-label';
  const { dataStreamName } = await newDataStreamNameSpecPage({
    label: LABEL,
    detailedLabel: DETAILED_LABEL,
  });
  expect(dataStreamName.innerText).toInclude(DETAILED_LABEL);
  expect(dataStreamName.innerText).not.toInclude(LABEL);
});
