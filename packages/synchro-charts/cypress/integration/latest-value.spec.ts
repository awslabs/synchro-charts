import { LATEST_VALUE_SELECTOR } from '../../src/testing/selectors';

const root = 'http://localhost:3333/tests/latest-value';

it('renders nothing when there is no data', () => {
  const NUM_DATA_POINTS = 0;
  cy.visit(`${root}?numDataPoints=${NUM_DATA_POINTS}`);

  cy.get('[data-testid="latest-value"]').should('not.exist');
});

it('renders the latest value and only value within the view port', () => {
  const NUM_DATA_POINTS = 1;
  cy.visit(`${root}?numDataPoints=${NUM_DATA_POINTS}`);

  const LATEST_VALUE = 100;

  cy.get(LATEST_VALUE_SELECTOR)
    .invoke('text')
    .should('equal', LATEST_VALUE.toString());
});

it('renders the latest value with two data points in the view port', () => {
  const NUM_DATA_POINTS = 2;
  cy.visit(`${root}?numDataPoints=${NUM_DATA_POINTS}`);

  const LATEST_VALUE = 200;

  cy.get(LATEST_VALUE_SELECTOR)
    .invoke('text')
    .should('equal', LATEST_VALUE.toString());
});
