import { newSpecPage } from '@stencil/core/testing';
import { update } from '../charts/common/tests/merge';

import { CustomHTMLElement } from '../../utils/types';
import { MonitorDataStreamName } from './monitor-data-stream-name';
import { Components } from '../../components.d';

const noop = () => {};

const newDataStreamNameSpecPage = async (props: Partial<Components.MonitorDataStreamName>) => {
  const page = await newSpecPage({
    components: [MonitorDataStreamName],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dataStreamName = page.doc.createElement('monitor-data-stream-name') as CustomHTMLElement<
    Components.MonitorDataStreamName
  >;
  const defaultProps: Components.MonitorDataStreamName = {
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
