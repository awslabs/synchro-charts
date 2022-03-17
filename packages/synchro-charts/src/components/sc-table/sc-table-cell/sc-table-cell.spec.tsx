import { newSpecPage } from '@stencil/core/testing';

import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { ScTableCell } from './sc-table-cell';
import { update } from '../../charts/common/tests/merge';
import { Cell } from '../constructTableData';
import { ERROR_SYMBOL_SELECTOR, LOADING_SPINNER_SELECTOR } from '../../../testing/selectors';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { ScErrorBadge } from '../../sc-error-badge/sc-error-badge';
import { ScChartIcon } from '../../charts/chart-icon/sc-chart-icon';
import { DataType } from '../../../utils/dataConstants';
import { MINUTE_IN_MS } from '../../../utils/time';

// this is mock output that passed down from `sc-table-base`
const CELL: Cell = {
  dataStream: {
    id: 'rule-cell-id-1',
    name: 'rule-cell',
    data: [{ x: new Date(2000, 0, 0).getTime(), y: 'y < 30' }],
    resolution: 0,
    dataType: DataType.NUMBER,
  },
};

const cellSpecPage = async (propOverrides: Partial<Components.ScTableCell> = {}) => {
  const page = await newSpecPage({
    components: [ScTableCell, ScErrorBadge, ScChartIcon],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const cell = page.doc.createElement('sc-table-cell') as CustomHTMLElement<Components.ScTableCell>;
  const props: Partial<Components.ScTableCell> = {
    cell: CELL,
    ...propOverrides,
  };

  update(cell, props);
  page.body.appendChild(cell);

  await page.waitForChanges();

  return { page, cell };
};

it('renders cell value', async () => {
  const { cell } = await cellSpecPage();

  expect(cell.innerHTML).toContain('y &lt; 30');
});

it('renders aggregated data', async () => {
  const Y_VALUE = 1232.2;
  const { cell } = await cellSpecPage({
    cell: {
      dataStream: {
        id: 'some-id',
        color: 'black',
        name: 'name',
        data: [],
        dataType: DataType.NUMBER,
        resolution: MINUTE_IN_MS,
        aggregates: { [MINUTE_IN_MS]: [{ x: Date.now(), y: Y_VALUE }] },
      },
    },
  });

  expect(cell.innerHTML).toContain(Y_VALUE);
});

it('indicates no data is present when a data stream is present but with no data', async () => {
  const rowData = {
    ...CELL,
    dataStream: {
      ...CELL.dataStream,
      data: [],
    },
  } as Cell;
  const { cell } = await cellSpecPage({ cell: rowData });

  expect(cell.innerHTML).toContain(NO_VALUE_PRESENT);
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).toBeNull();
  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).toBeNull();
});

it('renders a blank cell when there is no associated data stream', async () => {
  const rowData = {
    ...CELL,
    dataStream: undefined,
  } as Cell;
  const { cell } = await cellSpecPage({ cell: rowData });

  expect(cell.innerHTML).not.toContain(NO_VALUE_PRESENT);
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).toBeNull();
  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).toBeNull();
});

it('renders a blank cell when there is no associated cell data', async () => {
  const { cell } = await cellSpecPage({ cell: undefined });

  expect(cell.innerHTML).not.toContain(NO_VALUE_PRESENT);
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).toBeNull();
  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).toBeNull();
});

it('renders cell with error message', async () => {
  const rowData = {
    ...CELL,
    dataStream: {
      ...CELL.dataStream,
      error: 'STOPPED',
    },
  } as Cell;

  const { cell } = await cellSpecPage({ cell: rowData });

  expect(cell.innerHTML).toContain('STOPPED');
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).not.toBeNull();
});

it('renders cell with error message when has error and is loading', async () => {
  const rowData = {
    ...CELL,
    dataStream: {
      ...CELL.dataStream,
      error: 'STOPPED',
      isLoading: true,
    },
  } as Cell;

  const { cell } = await cellSpecPage({ cell: rowData });

  expect(cell.innerHTML).toContain('STOPPED');
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).not.toBeNull();
  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).toBeNull();
});

it('renders cell with loading spinner', async () => {
  const rowData = {
    ...CELL,
    dataStream: {
      ...CELL.dataStream,
      isLoading: true,
    },
  } as Cell;

  const { cell } = await cellSpecPage({ cell: rowData });

  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).not.toBeNull();
});
