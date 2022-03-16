import { newSpecPage } from '@stencil/core/testing';

import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { ScTableBase } from './sc-table-base';
import { update } from '../../charts/common/tests/merge';
import { Row } from '../constructTableData';
import { StatusIcon } from '../../charts/common/constants';

// this is mock output that get thrown out of `constructTableData` utility
const mockRows: Row[] = [
  {
    Rule: {
      content: 'y < 30',
    },
    Severity: {
      content: '3',
    },
    Alarm: {
      content: 'NORMAL',
      color: 'green',
      icon: StatusIcon.NORMAL,
    },
  },
];

const tableBaseSpecPage = async (propOverrides: Partial<Components.ScTableBase> = {}) => {
  const page = await newSpecPage({
    components: [ScTableBase],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const tableBase = page.doc.createElement('sc-table-base') as CustomHTMLElement<Components.ScTableBase>;
  const props: Components.ScTableBase = {
    rows: mockRows,
    columns: [],
    isEnabled: true,
    liveModeOnlyMessage: 'liveModeOnlyMessage',
    messageOverrides: {},
    ...propOverrides,
  };

  update(tableBase, props);
  page.body.appendChild(tableBase);

  await page.waitForChanges();

  return { page, tableBase, props };
};

it('renders body row', async () => {
  const { tableBase } = await tableBaseSpecPage();
  const rows = tableBase.querySelectorAll('tbody > tr');
  expect(rows.length).toBe(1);
});
