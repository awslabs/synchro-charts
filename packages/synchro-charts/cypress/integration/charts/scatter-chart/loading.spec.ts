import { LOADING_SPINNER_SELECTOR, visitDynamicSitewiseWidget } from '../../../../src/testing/selectors';
import { DATA_STREAM } from '../../../../src/testing/__mocks__/mockWidgetProperties';

it('renders spinner', () => {
  visitDynamicSitewiseWidget(cy, {
    componentTag: 'monitor-scatter-chart',
    dataStreams: [{ ...DATA_STREAM, isLoading: true }],
  });

  cy.get(LOADING_SPINNER_SELECTOR).should('be.visible');
});
