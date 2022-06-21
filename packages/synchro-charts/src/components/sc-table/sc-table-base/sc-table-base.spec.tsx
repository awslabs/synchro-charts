import { newSpecPage } from '@stencil/core/testing';

import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { ScTableBase } from './sc-table-base';
import { update } from '../../charts/common/tests/merge';
import { Row } from '../constructTableData';
import { DataType } from '../../../utils/dataConstants';
import { StatusIcon } from '../../charts/common/constants';

// this is mock output that get thrown out of `constructTableData` utility
const mockRows: Row[] = [
  {
    Rule: {
      dataStream: {
        id: 'rule-cell-id-1',
        name: 'rule',
        data: [{ x: new Date('1999-12-31T08:00:00.000Z').getTime(), y: 'y < 30' }],
        resolution: 0,
        dataType: DataType.STRING,
      },
    },
    Severity: {
      dataStream: {
        id: 'severity-cell-id-1',
        name: 'severity',
        data: [{ x: new Date('1999-12-31T08:00:00.000Z').getTime(), y: 3 }],
        resolution: 0,
        dataType: DataType.NUMBER,
      },
    },
    Alarm: {
      dataStream: {
        id: 'alarm-cell-id-1',
        name: 'alarm',
        data: [{ x: new Date('1999-12-31T08:00:00.000Z').getTime(), y: 'NORMAL' }],
        resolution: 0,
        dataType: DataType.NUMBER,
      },
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
    messageOverrides: {
      liveModeOnlyMessage: 'liveModeOnlyMessage',
    },
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
