import { SCREEN_SIZE } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { Annotation, Threshold } from '../../../../src/components/charts/common/types';
import { visitDynamicWidget } from '../../../../src/testing/selectors';
import { COMPARISON_OPERATOR } from '../../../../src/components/charts/common/constants';

const createUniqueThresholds = (num: number): Threshold[] =>
  new Array(num).fill(0).map((_: unknown, i) => ({
    comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    value: 100 * i,
    color: 'red',
  }));

beforeEach(() => {
  cy.viewport(SCREEN_SIZE.width, SCREEN_SIZE.height);
});

it('renders threshold legend', () => {
  const eqThreshold: Threshold<string> = {
    comparisonOperator: COMPARISON_OPERATOR.EQUAL,
    value: 'ALARM',
    color: 'red',
  };

  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-status-timeline',
    annotations: {
      y: [eqThreshold],
    },
  });

  cy.get('iot-app-kit-vis-threshold-legend').should('be.visible');
  cy.get('iot-app-kit-vis-threshold-legend-row').should('be.visible');
  cy.get('iot-app-kit-vis-threshold-legend-row').should('have.length', 1);

  cy.contains('iot-app-kit-vis-threshold-legend-row', eqThreshold.value).should('be.visible');

  cy.get('iot-app-kit-vis-threshold-legend').matchImageSnapshotOnCI();
});

it('renders many thresholds at once', () => {
  const NUM_THRESHOLDS = 20;
  const thresholds = createUniqueThresholds(NUM_THRESHOLDS);

  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-status-timeline',
    annotations: {
      y: thresholds,
    },
  });

  cy.waitForStatusTimeline();

  cy.matchImageSnapshotOnCI();
});

it('does not render annotations (that are not thresholds)', () => {
  const annotation: Annotation<number> = {
    value: 123,
    color: 'red',
  };

  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-status-timeline',
    annotations: {
      y: [annotation],
    },
  });

  cy.waitForStatusTimeline();

  cy.contains('iot-app-kit-vis-threshold-legend-row').should('have.length', 0);
});
