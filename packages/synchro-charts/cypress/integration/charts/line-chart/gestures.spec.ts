/* eslint-disable cypress/no-unnecessary-waiting */
import { CHART_VIZ_CONTAINER_SELECTOR, visitDynamicWidget } from '../../../../src/testing/selectors';
import { SECOND_IN_MS } from '../../../../src/utils/time';

const root = 'localhost:3333/tests';

const VIEWPORT_HEIGHT = 800;
const VIEWPORT_WIDTH = 500;

const TIME_FOR_GESTURE_TO_COMPLETE = SECOND_IN_MS;

it('moves viewport when gestures are applied', () => {
  const START = new Date(2000, 0, 0);
  const END = new Date(2000, 0, 2);
  const OLD_Y_TICK_LABEL = 'Fri 31';

  visitDynamicWidget(cy, {
    componentTag: 'sc-line-chart',
    viewPortStart: START,
    viewPortEnd: END,
    gestures: true,
  });

  cy.waitForChart();

  // We have not applied the zoom, should contain only the more zoomed out labels.
  cy.contains(OLD_Y_TICK_LABEL).should('be.visible');

  // Zoom into chart
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');

  cy.contains(OLD_Y_TICK_LABEL).should('not.exist');
});

it('does not move viewport when gestures are not applied', () => {
  const START = new Date(2000, 0, 0);
  const END = new Date(2000, 0, 2);
  const OLD_Y_TICK_LABEL = 'Fri 31';

  visitDynamicWidget(cy, {
    componentTag: 'sc-scatter-chart',
    viewPortStart: START,
    viewPortEnd: END,
    gestures: false,
  });

  cy.waitForChart();

  // We have not applied the zoom, should contain only the more zoomed out labels.
  cy.contains(OLD_Y_TICK_LABEL).should('exist');

  // Try to zoom in, but we expect it to do nothing.
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');

  cy.contains(OLD_Y_TICK_LABEL).should('be.visible');
});

it('adjusts y range as data in the view changes', () => {
  cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  cy.visit(`${root}/chart/y-range?componentTag=sc-line-chart`);

  cy.waitForChart();

  // Ensure that this y value is present on the y axis
  const EXISTING_Y_VALUE = '18,000';
  cy.contains(EXISTING_Y_VALUE).should('exist');

  cy.get('.data-container').dblclick('left');
  cy.wait(SECOND_IN_MS * 0.25);
  cy.get('.data-container').dblclick('left');
  cy.wait(SECOND_IN_MS * 0.25);
  cy.get('.data-container').dblclick('left');

  // Y range has updated, and the y axis no longer contains the previous y value, since the y range has updated.
  cy.wait(TIME_FOR_GESTURE_TO_COMPLETE);
  cy.contains(EXISTING_Y_VALUE).should('not.exist');
});

describe('gestures while charts are synchronized', () => {
  it('zooms into both charts', () => {
    cy.visit(`${root}/sc-webgl-chart/multi`);
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    cy.waitForChart();

    const OLD_Y_TICK_LABEL = '1998';

    // We have not applied the zoom, should contain only the more zoomed out labels.
    cy.contains(OLD_Y_TICK_LABEL).should('exist');

    // Zoom in 5 times
    cy.get('.data-container').dblclick('center');
    cy.wait(SECOND_IN_MS * 0.25);
    cy.get('.data-container').dblclick('center');
    cy.wait(SECOND_IN_MS * 0.25);
    cy.get('.data-container').dblclick('center');
    cy.wait(SECOND_IN_MS * 0.25);
    cy.get('.data-container').dblclick('center');
    cy.wait(SECOND_IN_MS * 0.25);
    cy.get('.data-container').dblclick('center');

    cy.contains(OLD_Y_TICK_LABEL).should('not.exist');
  });
});
