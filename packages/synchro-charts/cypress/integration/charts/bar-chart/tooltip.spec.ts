import {
  CHART_TOOLTIP_ROW_SELECTOR,
  CHART_TOOLTIP_SELECTOR,
  CHART_VIZ_CONTAINER_SELECTOR,
  visitDynamicWidget,
} from '../../../../src/testing/selectors';
import { SCREEN_SIZE } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { MINUTE_IN_MS, SECOND_IN_MS } from '../../../../src/utils/time';
import {
  STRING_STREAM_1,
  NUMBER_EMPTY_STREAM,
  NUMBER_INFO_1,
  NUMBER_STREAM_1,
  NUMBER_STREAM_2,
  NUMBER_INFO_2,
  START_DATE,
} from '../../../../src/testing/__mocks__/mockWidgetProperties';

it('renders no tooltip when only info is empty or string', () => {
  visitDynamicWidget(cy, {
    componentTag: 'sc-bar-chart',
    viewPortStart: new Date(START_DATE.getTime() - MINUTE_IN_MS),
    viewPortEnd: new Date(START_DATE.getTime() + 10 * MINUTE_IN_MS),
    dataStreams: [
      { ...NUMBER_EMPTY_STREAM, resolution: SECOND_IN_MS },
      { ...STRING_STREAM_1, data: [], aggregates: { [SECOND_IN_MS]: STRING_STREAM_1.data }, resolution: SECOND_IN_MS },
    ],
  });

  cy.waitForChart();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
    offsetX: 0,
    offsetY: SCREEN_SIZE.height / 2,
  });

  cy.wait(0.05 * SECOND_IN_MS);

  cy.get(CHART_TOOLTIP_SELECTOR).should('not.exist');
});

it('renders no tooltip when there is no data for the requested resolution', () => {
  visitDynamicWidget(cy, {
    componentTag: 'sc-bar-chart',
    viewPortStart: new Date(START_DATE.getTime() - MINUTE_IN_MS),
    viewPortEnd: new Date(START_DATE.getTime() + 10 * MINUTE_IN_MS),
    dataStreams: [{ ...NUMBER_STREAM_1, resolution: SECOND_IN_MS }],
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
  const resolution = MINUTE_IN_MS;
  visitDynamicWidget(cy, {
    componentTag: 'sc-bar-chart',
    viewPortStart: new Date(START_DATE.getTime() - MINUTE_IN_MS),
    viewPortEnd: new Date(START_DATE.getTime() + 10 * MINUTE_IN_MS),
    dataStreams: [
      { ...NUMBER_STREAM_1, data: [], aggregates: { [resolution]: NUMBER_STREAM_1.data }, resolution },
      { ...NUMBER_STREAM_2, data: [], aggregates: { [resolution]: NUMBER_STREAM_2.data }, resolution },
    ],
  });

  cy.waitForChart();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
    offsetX: 0,
    offsetY: SCREEN_SIZE.height / 2,
  });

  cy.wait(0.05 * SECOND_IN_MS);

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

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});
