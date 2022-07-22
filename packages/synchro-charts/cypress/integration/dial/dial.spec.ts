import { Y_MAX, Y_MIN } from '../../../src/testing/test-routes/charts/constants';
import { Primitive } from '../../../src/utils/dataTypes';
import { round } from '../../../src/utils/number';

const root = '/tests/sc-dial';
const VALUE_ERROR = '[data-testid="warning"]';
const VALUE_LOADING = '[data-testid="loading"]';
const VALUE_SVG = '[data-testid="current-value"]';
const errorMessage = 'SiteWise network error';

const getRoute = ({
  latestValue,
  isLoading,
  unit,
  error = '',
  alarm,
}: {
  latestValue?: Primitive;
  isLoading?: boolean;
  unit?: string;
  error?: string;
  alarm?: string;
}): string =>
  `${root}?latestValue=${latestValue}&&isloading=${isLoading}&&unit=${unit}&&error=${error}&&alarm=${alarm}`;
const WIDTH = 300;
const HEIGHT = 400;
beforeEach(() => {
  cy.viewport(WIDTH, HEIGHT);
});

it('renders latest value', () => {
  const LATEST_VALUE = 2238;
  const DATA = round((LATEST_VALUE / (Y_MAX - Y_MIN)) * 100);
  cy.visit(getRoute({ latestValue: LATEST_VALUE, unit: '', isLoading: false }));
  cy.wait(1000);
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', `${DATA}%`);

  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders string value', () => {
  const LATEST_VALUE = 'ABC';
  cy.visit(getRoute({ latestValue: LATEST_VALUE, unit: 'rpm', isLoading: false }));
  cy.wait(1000);
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', '-');
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', 'Only numbers are supported');

  cy.matchImageSnapshotOnCI();
});

it('renders loading status', () => {
  const LATEST_VALUE = 2238;
  cy.visit(getRoute({ latestValue: LATEST_VALUE, isLoading: true, unit: 'rpm' }));
  cy.wait(1000);
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', 'Loading');
  cy.get(VALUE_LOADING).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('renders unit value', () => {
  const LATEST_VALUE = 2238;
  cy.visit(getRoute({ latestValue: LATEST_VALUE, unit: 'rpm', isLoading: false }));
  cy.wait(1000);
  cy.get('.sc-dialbase-container')
    .invoke('text')
    .should('contain', `${LATEST_VALUE.toString()}rpm`);

  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders error value', () => {
  const LATEST_VALUE = 2238;
  cy.visit(getRoute({ latestValue: LATEST_VALUE, unit: '', error: errorMessage, isLoading: false }));
  cy.wait(1000);
  cy.get(VALUE_ERROR)
    .invoke('text')
    .should('contain', errorMessage);

  cy.matchImageSnapshotOnCI();
});

it('renders alarm Critica', () => {
  const LATEST_VALUE = 1250;
  cy.visit(getRoute({ latestValue: LATEST_VALUE, unit: '', alarm: 'low', isLoading: false }));
  cy.wait(1000);
  cy.get(VALUE_SVG)
    .should('be.visible')
    .should('contain', 'Critica');

  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders alarm Warning', () => {
  const LATEST_VALUE = 3250;
  cy.visit(getRoute({ latestValue: LATEST_VALUE, unit: '', alarm: 'middle', isLoading: false }));
  cy.wait(1000);
  cy.get(VALUE_SVG)
    .should('be.visible')
    .should('contain', 'Warning');

  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders alarm Normal', () => {
  const LATEST_VALUE = 4500;
  cy.visit(getRoute({ latestValue: LATEST_VALUE, unit: '', alarm: 'high', isLoading: false }));
  cy.wait(1000);
  cy.get(VALUE_SVG)
    .should('be.visible')
    .should('contain', 'Normal');

  cy.get(VALUE_ERROR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});
