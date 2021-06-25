import { CHART_VIZ_CONTAINER_SELECTOR, visitDynamicWidget } from '../../../../src/testing/selectors';
import { DATA_STREAM } from '../../../../src/testing/__mocks__/mockWidgetProperties';
import { messageOverrides } from '../../../../src/testing/__mocks__/mockMessgeOverrides';

const componentTag = 'sc-line-chart';

it('renders the "no streams present" messaging when no streams preset', () => {
  visitDynamicWidget(cy, {
    componentTag,
    dataStreams: [],
    messageOverrides,
  });

  cy.waitForChart();

  cy.contains(messageOverrides.noDataStreamsPresentHeader).should('be.visible');
  cy.contains(messageOverrides.noDataStreamsPresentSubHeader).should('be.visible');

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('renders the "no data present" messaging when no data preset', () => {
  visitDynamicWidget(cy, {
    componentTag,
    dataStreams: [{ ...DATA_STREAM, data: [] }],
    messageOverrides,
  });

  cy.waitForChart();

  cy.contains(messageOverrides.noDataPresentHeader).should('be.visible');
  cy.contains(messageOverrides.noDataPresentSubHeader).should('be.visible');

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});
