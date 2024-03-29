import { LOADING_SPINNER_SELECTOR, visitDynamicWidget } from '../../../../src/testing/selectors';
import { DATA_STREAM } from '../../../../src/testing/__mocks__/mockWidgetProperties';

it('renders spinner', () => {
  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-line-chart',
    dataStreams: [{ ...DATA_STREAM, isLoading: true }],
  });

  cy.get(LOADING_SPINNER_SELECTOR).should('be.visible');
});
