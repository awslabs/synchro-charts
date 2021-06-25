import { MINUTE_IN_MS, SECOND_IN_MS } from '../../../src/utils/time';
import { tableMockData } from '../../../src/testing/test-routes/sc-table/tableDataMock';
import {
  ERROR_SYMBOL_SELECTOR,
  LOADING_SPINNER_SELECTOR,
  visitDynamicWidget,
} from '../../../src/testing/selectors';

const COLUMN_SELECTOR = 'th';
const CELL_SELECTOR = 'td';
const EMPTY_STATUS_SELECTOR = '.empty-status';
const DISABLE_STATUS_SELECTOR = '.disable-status';

const DATE_OF_POINT = new Date(2000, 0, 0);

const viewPortStart = new Date(DATE_OF_POINT.getTime() - MINUTE_IN_MS);
const viewPortEnd = new Date(DATE_OF_POINT.getTime() + 5 * MINUTE_IN_MS);

it('renders table column values', () => {
  const { tableColumns, dataStreams, annotations } = tableMockData({});
  visitDynamicWidget(cy, {
    componentTag: 'sc-table',
    duration: MINUTE_IN_MS,
    dataStreams,
    tableColumns,
    annotations,
    viewPortStart,
    viewPortEnd,
  });

  cy.get(COLUMN_SELECTOR)
    .should('be.visible')
    .should('have.length', 3);

  cy.get(COLUMN_SELECTOR)
    .first()
    .invoke('text')
    .should('equal', 'Rule');

  cy.get(COLUMN_SELECTOR)
    .last()
    .invoke('text')
    .should('equal', 'Alarm');
});

it('renders table row values', () => {
  const { tableColumns, dataStreams, annotations } = tableMockData({});
  visitDynamicWidget(cy, {
    componentTag: 'sc-table',
    duration: MINUTE_IN_MS,
    dataStreams,
    tableColumns,
    annotations,
    viewPortStart,
    viewPortEnd,
  });

  cy.get(CELL_SELECTOR)
    .should('be.visible')
    .should('have.length', 3);

  cy.get(CELL_SELECTOR)
    .first()
    .invoke('text')
    .should('equal', 'y < 30');

  cy.get(CELL_SELECTOR)
    .last()
    .invoke('text')
    .should('equal', 'NORMAL');

  cy.get('sc-table-cell div')
    .should('be.visible')
    .then($el => {
      // Expected to be green, which matches the breached threshold on the last value
      expect($el).to.have.css('color', 'rgb(0, 128, 0)');
    });

  cy.matchImageSnapshotOnCI();
});

it('renders loading spinner for cells in a table', () => {
  const { tableColumns, dataStreams, annotations } = tableMockData({ showLoading: true });

  visitDynamicWidget(cy, {
    componentTag: 'sc-table',
    dataStreams,
    delayBeforeDataLoads: 5 * SECOND_IN_MS,
    duration: MINUTE_IN_MS,
    tableColumns,
    annotations,
    viewPortStart,
    viewPortEnd,
  });

  cy.get(CELL_SELECTOR).should('be.visible');
  cy.get(CELL_SELECTOR)
    .get(LOADING_SPINNER_SELECTOR)
    .should('be.visible');
});

it('renders error string and icon in a table', () => {
  const { tableColumns, dataStreams, annotations, errorMsg } = tableMockData({ showError: true });

  visitDynamicWidget(cy, {
    componentTag: 'sc-table',
    dataStreams,
    duration: MINUTE_IN_MS,
    delayBeforeDataLoads: 5 * SECOND_IN_MS,
    tableColumns,
    annotations,
    viewPortStart,
    viewPortEnd,
  });

  cy.get(CELL_SELECTOR)
    .get(ERROR_SYMBOL_SELECTOR)
    .should('be.visible');

  cy.contains(CELL_SELECTOR, errorMsg).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

describe('layout edge cases', () => {
  it('hides rows that cannot fit on the widget', () => {
    const { tableColumns, dataStreams } = tableMockData({ tableDataLength: 4 });
    visitDynamicWidget(cy, {
      componentTag: 'sc-table',
      dataStreams,
      duration: MINUTE_IN_MS,
      tableColumns,
      viewPortStart,
      viewPortEnd,
      height: 140, // short enough not all 4 rows can be shown
    });

    cy.get(CELL_SELECTOR)
      .first()
      .should('be.visible');
    cy.get(CELL_SELECTOR)
      .last()
      .should('not.be.visible');

    // Should have no scroll bar visible within the snapshot
    cy.matchImageSnapshotOnCI();
  });

  it('wraps text when cell text is very long', () => {
    const { tableColumns, dataStreams } = tableMockData({ tableDataLength: 1 });
    visitDynamicWidget(cy, {
      componentTag: 'sc-table',
      duration: MINUTE_IN_MS,
      dataStreams: [
        {
          ...dataStreams[0],
          data: [
            {
              x: viewPortStart.getTime(),
              y:
                'this is a cell with very very long text, i am unsure why i need to be this long but this is not the place to ask such questions. there is a secrete message embedded within this string. or is there?',
            },
          ],
        },
      ],
      tableColumns: [tableColumns[0]],
      viewPortStart,
      viewPortEnd,
      height: 140,
      width: 100,
    });

    cy.get(CELL_SELECTOR)
      .first()
      .should('be.visible');

    // Should have no scroll bar visible within the snapshot
    cy.matchImageSnapshotOnCI();
  });

  it('displays many columns by hiding those that cannot fit behind a scroll area', () => {
    const NUM_COLUMNS = 10;
    visitDynamicWidget(cy, {
      componentTag: 'sc-table',
      tableColumns: new Array(NUM_COLUMNS).fill(0).map((_, i) => ({
        header: `column-${i + 1}`,
        rows: [undefined],
      })),
      duration: MINUTE_IN_MS,
      viewPortStart,
      viewPortEnd,
      width: 500, // small enough that not all columns can fit
    });

    cy.get('table').should('be.visible');
    cy.get('td').should('be.visible');

    // Should have no scroll bar visible within the snapshot
    cy.matchImageSnapshotOnCI();
  });
});

it('empty state', () => {
  const { tableColumns, annotations } = tableMockData({ tableDataLength: 0 });
  visitDynamicWidget(cy, {
    componentTag: 'sc-table',
    duration: MINUTE_IN_MS,
    dataStreams: [],
    tableColumns,
    annotations,
    viewPortStart,
    viewPortEnd,
  });
  cy.get('sc-table')
    .get(EMPTY_STATUS_SELECTOR)
    .should('be.visible');
});

it('disable state', () => {
  const { tableColumns, annotations } = tableMockData({ tableDataLength: 0 });
  visitDynamicWidget(cy, {
    componentTag: 'sc-table',
    duration: undefined,
    dataStreams: [],
    tableColumns,
    annotations,
    viewPortStart,
    viewPortEnd,
  });
  cy.get('sc-table')
    .get(DISABLE_STATUS_SELECTOR)
    .should('be.visible');
});
