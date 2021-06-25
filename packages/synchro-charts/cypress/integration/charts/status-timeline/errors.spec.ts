import {
  ERROR_SYMBOL_SELECTOR,
  STATUS_TIMELINE_OVERLAY_ROW_SELECTOR,
  visitDynamicWidget,
} from '../../../../src/testing/selectors';
import { DATA_STREAM } from '../../../../src/testing/__mocks__/mockWidgetProperties';

it('displays error when there is an error', () => {
  visitDynamicWidget(cy, {
    componentTag: 'sc-status-chart',
    dataStreams: [{ ...DATA_STREAM, error: 'beep beep SEV-2' }],
  });

  cy.get(ERROR_SYMBOL_SELECTOR).should('be.visible');
  cy.contains(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR, DATA_STREAM.name)
    .should('be.visible')
    .get('.stream-info')
    .matchImageSnapshotOnCI();
});

it('truncates long error message', () => {
  visitDynamicWidget(cy, {
    componentTag: 'sc-status-chart',
    dataStreams: [
      { ...DATA_STREAM, error: 'a really really really really really long and not very useful error message.' },
    ],
  });

  cy.get(ERROR_SYMBOL_SELECTOR).should('be.visible');
  cy.contains(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR, DATA_STREAM.name)
    .should('be.visible')
    .get('.stream-info')
    .matchImageSnapshotOnCI();
});
