import { Primitive } from '../../../src/utils/dataTypes';

const root = '/tests/sc-dial';

const getRoute = ({ latestValue, numCharts }: { latestValue?: Primitive; numCharts?: number }): string =>
  `${root}?latestValue=${latestValue}&numCharts=${numCharts || 1}`;
const WIDTH = 300;
const HEIGHT = 300;
beforeEach(() => {
  cy.viewport(WIDTH, HEIGHT);
});

it('renders latest value', () => {
  const LATEST_VALUE = 1238;
  cy.visit(getRoute({ latestValue: LATEST_VALUE }));

  cy.matchImageSnapshotOnCI();
});

it('renders string value', () => {
  const LATEST_VALUE = 'ABC';
  cy.visit(getRoute({ latestValue: LATEST_VALUE }));

  cy.matchImageSnapshotOnCI();
});
