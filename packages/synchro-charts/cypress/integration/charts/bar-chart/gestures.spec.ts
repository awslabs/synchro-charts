/* eslint-disable cypress/no-unnecessary-waiting */
import { CHART_VIZ_CONTAINER_SELECTOR, visitDynamicWidget } from '../../../../src/testing/selectors';
import { SECOND_IN_MS } from '../../../../src/utils/time';

const root = '/tests';

const VIEWPORT_HEIGHT = 500;
const VIEWPORT_WIDTH = 500;

const TIME_FOR_GESTURE_TO_COMPLETE = 0.1 * SECOND_IN_MS;

it('moves viewport when gestures are applied', () => {
  const START = new Date(2000, 0, 0);
  const END = new Date(2000, 0, 2);
  const OLD_X_AXIS_TICK = 'Fri 31';

  visitDynamicWidget(cy, {
    componentTag: 'sc-bar-chart',
    viewPortStart: START,
    viewPortEnd: END,
    gestures: true,
  });

  cy.waitForChart();

  // We have not applied the zoom, should contain only the more zoomed out labels.
  cy.contains(OLD_X_AXIS_TICK).should('be.visible');

  // Zoom into chart
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');

  cy.contains(OLD_X_AXIS_TICK).should('not.exist');
});

it('does not move viewport when gestures are not applied', () => {
  const START = new Date(2000, 0, 0);
  const END = new Date(2000, 0, 2);
  const OLD_X_AXIS_TICK = 'Fri 31';

  visitDynamicWidget(cy, {
    componentTag: 'sc-bar-chart',
    viewPortStart: START,
    viewPortEnd: END,
    gestures: false,
  });

  cy.waitForChart();

  // We have not applied the zoom, should contain only the more zoomed out labels.
  cy.contains(OLD_X_AXIS_TICK).should('exist');

  // Try to zoom in, but we expect it to do nothing.
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');

  cy.contains(OLD_X_AXIS_TICK).should('be.visible');
});

it('adjusts y range as data in the view changes', () => {
  cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  cy.visit(`${root}/chart/y-range?componentTag=sc-bar-chart`);

  const EXISTING_Y_VALUE = '18,000';

  cy.waitForChart();

  // Ensure that this y value is present on the y axis
  cy.contains(EXISTING_Y_VALUE).should('exist');

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');

  // Y range has updated, and the y axis no longer contains the previous y value, since the y range has updated.
  cy.wait(TIME_FOR_GESTURE_TO_COMPLETE);
  cy.contains(EXISTING_Y_VALUE).should('not.exist');
});
