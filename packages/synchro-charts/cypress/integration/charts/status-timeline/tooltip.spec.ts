import {
  CHART_TOOLTIP_ROW_SELECTOR,
  CHART_TOOLTIP_SELECTOR,
  CHART_VIZ_CONTAINER_SELECTOR,
  visitDynamicWidget,
} from '../../../../src/testing/selectors';
import { SCREEN_SIZE } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { NO_VALUE_PRESENT } from '../../../../src/components/common/terms';
import { MINUTE_IN_MS } from '../../../../src/utils/time';
import {
  NUMBER_EMPTY_INFO,
  STRING_INFO_1,
  STRING_INFO_2,
  STRING_STREAM_2,
  STRING_STREAM_1,
  NUMBER_EMPTY_STREAM,
  NUMBER_STREAM_1,
} from '../../../../src/testing/__mocks__/mockWidgetProperties';
import { ANNOTATIONS } from '../../../../src/testing/dynamicWidgetUtils/constants';

it('renders with tooltip for multiple data streams with order in which they were added', () => {
  // tooltip position is based on info order, *not* data order.
  visitDynamicWidget(cy, {
    componentTag: 'sc-status-timeline',
    viewportStart: new Date(2000, 0, 0),
    viewportEnd: new Date(2000, 0, 0, 0, 5),
    dataStreams: [STRING_STREAM_1, NUMBER_EMPTY_STREAM, STRING_STREAM_2],
    annotations: ANNOTATIONS,
    alarms: { expires: MINUTE_IN_MS },
  });

  cy.waitForStatusTimeline();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
    offsetX: 0,
    offsetY: SCREEN_SIZE.height / 2,
  });

  cy.get(CHART_TOOLTIP_SELECTOR).should('be.visible');

  /** Tooltip rows contain expected name and value */
  cy.get(CHART_TOOLTIP_ROW_SELECTOR).should('have.length', 3);

  // row 1
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(0)
    .contains(STRING_INFO_1.name)
    .should('be.visible');
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(0)
    .contains(STRING_STREAM_1.data[0].y)
    .should('be.visible');

  // row 2
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(1)
    .contains(NUMBER_EMPTY_INFO.name)
    .should('be.visible');
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(1)
    .contains(NO_VALUE_PRESENT)
    .should('be.visible');

  // row 3
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(2)
    .contains(STRING_INFO_2.name)
    .should('be.visible');
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(2)
    .contains(STRING_STREAM_2.data[0].y)
    .should('be.visible');

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('renders tooltip to the left of the mouse when the mouse is on the right side', () => {
  visitDynamicWidget(cy, {
    componentTag: 'sc-status-timeline',
    viewportStart: new Date(new Date(2000, 0, 0).getTime() - MINUTE_IN_MS),
    viewportEnd: new Date(2000, 0, 0, 0, 5),
    dataStreams: [NUMBER_STREAM_1],
  });

  cy.waitForChart();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
    offsetX: 600,
    offsetY: SCREEN_SIZE.height / 2,
  });

  cy.get(CHART_TOOLTIP_SELECTOR).should('be.visible');

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});
