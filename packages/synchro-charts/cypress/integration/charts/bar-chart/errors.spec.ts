import {
  CHART_VIZ_CONTAINER_SELECTOR,
  ERROR_SYMBOL_SELECTOR,
  visitDynamicSitewiseWidget,
} from '../../../../src/testing/selectors';
import { DATA_STREAM } from '../../../../src/testing/__mocks__/mockWidgetProperties';

it('displays error when there is an error', () => {
  visitDynamicSitewiseWidget(cy, {
    componentTag: 'monitor-bar-chart',
    dataStreams: [{ ...DATA_STREAM, error: 'beep beep SEV-2' }],
  });

  cy.get(ERROR_SYMBOL_SELECTOR).should('be.visible');
  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});
