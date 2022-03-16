import { newSpecPage } from '@stencil/core/testing';

import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { ScTableCell } from './sc-table-cell';
import { update } from '../../charts/common/tests/merge';
import { DisplayCell } from '../constructTableData';
import { ERROR_SYMBOL_SELECTOR, LOADING_SPINNER_SELECTOR } from '../../../testing/selectors';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { ScErrorBadge } from '../../sc-error-badge/sc-error-badge';
import { ScChartIcon } from '../../charts/chart-icon/sc-chart-icon';

const CELL: DisplayCell = {
  content: 'y < 30',
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

it('indicates no data is present when a undefined cell is passed in', async () => {
  const { cell } = await cellSpecPage({ cell: undefined });

  expect(cell.innerHTML).toContain(NO_VALUE_PRESENT);
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).toBeNull();
  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).toBeNull();
});

it('indicates no data is present when a empty object cell is passed in', async () => {
  const { cell } = await cellSpecPage({ cell: {} });

  expect(cell.innerHTML).toContain(NO_VALUE_PRESENT);
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).toBeNull();
  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).toBeNull();
});

it('renders cell with error message', async () => {
  const { cell } = await cellSpecPage({ cell: { error: 'STOPPED' } });

  expect(cell.innerHTML).toContain('STOPPED');
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).not.toBeNull();
});

it('renders cell with error message when has error and is loading', async () => {
  const rowData = {
    error: 'STOPPED',
    isLoading: true,
  } as DisplayCell;

  const { cell } = await cellSpecPage({ cell: rowData });

  expect(cell.innerHTML).toContain('STOPPED');
  expect(cell.querySelector(ERROR_SYMBOL_SELECTOR)).not.toBeNull();
  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).toBeNull();
});

it('renders cell with loading spinner', async () => {
  const rowData = {
    isLoading: true,
  } as DisplayCell;

  const { cell } = await cellSpecPage({ cell: rowData });

  expect(cell.querySelector(LOADING_SPINNER_SELECTOR)).not.toBeNull();
});
