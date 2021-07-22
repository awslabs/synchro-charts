import { Primitive } from '../../../src/utils/dataTypes';
import { NO_VALUE_PRESENT } from '../../../src/components/common/terms';
import { visitDynamicWidget } from '../../../src/testing/selectors';
import {
  ALARM_STREAM,
  ALARM_STREAM_INFO,
  ALARM_THRESHOLD,
  DATA_WITH_ALARM_ASSOCIATION,
  DATA_WITH_ALARM_INFO,
} from '../../../src/testing/__mocks__/mockWidgetProperties';

const root = '/tests/kpi';

const VALUE_SELECTOR = '[data-testid="current-value"]';
const PREV_VALUE_SELECTOR = '[data-testid="previous-value"]';

const getRoute = ({
  isEnabled,
  latestValue,
  numCharts,
}: {
  isEnabled: boolean;
  latestValue?: Primitive;
  numCharts?: number;
}): string => `${root}?isEnabled=${isEnabled}&latestValue=${latestValue}&numCharts=${numCharts || 1}`;

const WIDTH = 500;
const HEIGHT = 400;
const STREAM_NAME = 'Quality 1';
const STREAM_NAME_TWO = 'Quality 2';
const STREAM_NAME_THREE = 'Quality 3';

beforeEach(() => {
  cy.viewport(WIDTH, HEIGHT);
});

it('renders latest value', () => {
  const LATEST_VALUE = 1238;
  cy.visit(getRoute({ isEnabled: true, latestValue: LATEST_VALUE }));

  cy.contains(STREAM_NAME).should('be.visible');

  cy.get(VALUE_SELECTOR)
    .invoke('text')
    .should('contain', LATEST_VALUE.toString());

  cy.get(PREV_VALUE_SELECTOR).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('renders odd number of kpi widgets in a grid', () => {
  const NUM_CHARTS = 3;
  cy.visit(getRoute({ isEnabled: true, latestValue: 10, numCharts: NUM_CHARTS }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(STREAM_NAME_TWO).should('be.visible');
  cy.contains(STREAM_NAME_THREE).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('renders string value', () => {
  const LATEST_VALUE = 'ABC';
  cy.visit(getRoute({ isEnabled: true, latestValue: LATEST_VALUE }));

  cy.contains(STREAM_NAME).should('be.visible');

  cy.get(VALUE_SELECTOR)
    .invoke('text')
    .should('contain', LATEST_VALUE);

  // We do not display trends on text data.
  cy.get(PREV_VALUE_SELECTOR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders disabled when disabled', () => {
  const LATEST_VALUE = 1238.1;
  cy.visit(getRoute({ isEnabled: false, latestValue: LATEST_VALUE }));

  cy.contains(STREAM_NAME).should('be.visible');

  cy.get(VALUE_SELECTOR)
    .invoke('text')
    .should('equal', NO_VALUE_PRESENT);

  cy.get(PREV_VALUE_SELECTOR).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('renders only title and no-value-present indicator when viewport is not live', () => {
  visitDynamicWidget(cy, {
    componentTag: 'sc-kpi',
    dataStreamInfos: [ALARM_STREAM_INFO, DATA_WITH_ALARM_INFO],
    dataStreams: [ALARM_STREAM, DATA_WITH_ALARM_ASSOCIATION],
    annotations: { y: [ALARM_THRESHOLD] },
    duration: undefined,
  });

  cy.contains('.value-wrapper', NO_VALUE_PRESENT).should('be.visible');

  // Should not display as breached when disabled
  cy.get('sc-chart-icon').should('not.exist');

  cy.matchImageSnapshotOnCI();
});
