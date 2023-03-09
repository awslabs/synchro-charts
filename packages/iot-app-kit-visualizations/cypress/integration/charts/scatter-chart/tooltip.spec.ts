import {
  CHART_TOOLTIP_ROW_SELECTOR,
  CHART_TOOLTIP_SELECTOR,
  CHART_VIZ_CONTAINER_SELECTOR,
  visitDynamicWidget,
} from '../../../../src/testing/selectors';
import { SCREEN_SIZE } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { MINUTE_IN_MS, SECOND_IN_MS } from '../../../../src/utils/time';
import {
  NUMBER_EMPTY_STREAM,
  NUMBER_INFO_1,
  NUMBER_STREAM_1,
  NUMBER_STREAM_2,
  NUMBER_INFO_2,
} from '../../../../src/testing/__mocks__/mockWidgetProperties';

it('renders no tooltip when only info is empty', () => {
  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-scatter-chart',
    viewportStart: new Date(2000, 0, 0),
    viewportEnd: new Date(2000, 0, 0, 0, 5),
    dataStreams: [NUMBER_EMPTY_STREAM],
  });

  cy.waitForChart();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
    offsetX: 0,
    offsetY: SCREEN_SIZE.height / 2,
  });

  cy.wait(0.05 * SECOND_IN_MS);

  cy.get(CHART_TOOLTIP_SELECTOR).should('not.exist');
});

it('renders tooltip rows in order of values magnitude', () => {
  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-scatter-chart',
    viewportStart: new Date(2000, 0, 0),
    viewportEnd: new Date(2000, 0, 0, 0, 5),
    dataStreams: [NUMBER_STREAM_1, NUMBER_EMPTY_STREAM, NUMBER_STREAM_2],
  });

  cy.waitForChart();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
    offsetX: 0,
    offsetY: SCREEN_SIZE.height / 2,
  });

  cy.get(CHART_TOOLTIP_SELECTOR).should('be.visible');
  cy.get(CHART_TOOLTIP_ROW_SELECTOR).should('have.length', 2);

  // Tooltip row 1 - display second info because it's associated with a larger value
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(0)
    .contains(NUMBER_INFO_2.name)
    .should('be.visible');
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(0)
    .contains(NUMBER_STREAM_2.data[0].y)
    .should('be.visible');

  // Tooltip row 2 - display the row that smaller y value
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(1)
    .contains(NUMBER_INFO_1.name)
    .should('be.visible');
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(1)
    .contains(NUMBER_STREAM_1.data[0].y)
    .should('be.visible');

  // Tooltip row 3 - display the empty stream last
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .contains(NUMBER_EMPTY_STREAM.name)
    .should('not.exist');

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('renders tooltip to the left of the mouse when the mouse is on the right side', () => {
  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-scatter-chart',
    viewportStart: new Date(new Date(2000, 0, 0).getTime() - MINUTE_IN_MS),
    viewportEnd: new Date(2000, 0, 0, 0, 5),
    dataStreams: [NUMBER_STREAM_1],
  });

  cy.waitForChart();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
    offsetX: 300,
    offsetY: SCREEN_SIZE.height / 2,
  });

  cy.get(CHART_TOOLTIP_SELECTOR).should('be.visible');

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});
