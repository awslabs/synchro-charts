import { CHART_VIZ_CONTAINER_SELECTOR, visitDynamicWidget } from '../../../../src/testing/selectors';

it('moves viewport when gestures are applied', () => {
  const START = new Date(2000, 0, 0);
  const END = new Date(2000, 0, 2);
  const OLD_Y_TICK_LABEL = 'Fri 31';

  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-scatter-chart',
    viewportStart: START,
    viewportEnd: END,
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
    componentTag: 'iot-app-kit-vis-scatter-chart',
    viewportStart: START,
    viewportEnd: END,
    gestures: false,
  });

  cy.waitForChart();

  // We have not applied the zoom, should contain only the more zoomed out labels.
  cy.contains(OLD_Y_TICK_LABEL).should('exist');

  // Try to zoom in, but we expect it to do nothing.
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).dblclick('center');

  cy.contains(OLD_Y_TICK_LABEL).should('be.visible');
});
