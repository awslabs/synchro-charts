import {
  constructSearchQuery,
  SearchQueryParams,
} from '../../../src/testing/test-routes/status-grid/testCaseParameters';
import { SECOND_IN_MS } from '../../../src/utils/time';
import { NO_VALUE_PRESENT } from '../../../src/components/common/terms';

const WIDTH = 300;
const HEIGHT = 200;

const STREAM_NAME = 'Data 1';
const STREAM_NAME_TWO = 'Data 2';
const STREAM_NAME_THREE = 'Data 3';

const UNIT = 'unit';
const CELL = '.status-cell';

const root = 'http://localhost:3333/tests/status-grid';

const route = (params: SearchQueryParams): string => `${root}?${constructSearchQuery(params)}`;

beforeEach(() => {
  cy.viewport(WIDTH, HEIGHT);
});

it('renders number point', () => {
  const LATEST_NUMBER = 123.1;
  cy.visit(route({ latestValue: LATEST_NUMBER }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(UNIT).should('be.visible');
  cy.contains(Math.round(LATEST_NUMBER)).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('renders string point', () => {
  const LATEST_STRING = 'alarm';
  cy.visit(route({ latestValue: LATEST_STRING }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(UNIT).should('be.visible');
  cy.contains(LATEST_STRING).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('renders multiple data streams', () => {
  // We want a larger view port to fit all of our widgets!
  cy.viewport(2 * WIDTH, 2 * HEIGHT);
  cy.visit(route({ numDataStreams: 3, latestValue: 0 }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(STREAM_NAME_TWO).should('be.visible');
  cy.contains(STREAM_NAME_THREE).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('renders widgets outside of viewport that cannot fit the minimum cell size', () => {
  cy.viewport(WIDTH, 1.5 * HEIGHT);
  cy.visit(route({ numDataStreams: 3, latestValue: 0 }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(STREAM_NAME_TWO).should('be.visible');

  // Fits 2 widgets (1 full and one partial)
  cy.matchImageSnapshotOnCI();
});

it('renders as disabled when not enabled', () => {
  cy.visit(route({ isEnabled: false }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(CELL, NO_VALUE_PRESENT).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('renders as disabled when not enabled, and has alarm data present', () => {
  cy.visit(route({ isEnabled: false }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(CELL, NO_VALUE_PRESENT).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it.skip('renders only a colored box if all options are false', () => {
  cy.visit(route({ showName: false, showValue: false, showUnit: false }));

  cy.contains(STREAM_NAME).should('not.exist');
  cy.contains(NO_VALUE_PRESENT).should('be.visible');
  cy.contains(UNIT).should('not.exist');

  // Need to wait some amount of time for render,
  // since were not making any positive assertions on the DOM
  cy.wait(SECOND_IN_MS);

  cy.matchImageSnapshotOnCI();
});

it('renders only name when only showName is true', () => {
  cy.visit(route({ showName: true, showValue: false, showUnit: false }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(CELL, NO_VALUE_PRESENT).should('not.exist');
  cy.contains(UNIT).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('hides value when showStatus is false', () => {
  cy.visit(route({ showName: true, showValue: false, showUnit: true, latestValue: 10 }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(CELL, 10).should('not.exist');

  cy.matchImageSnapshotOnCI();
});

it('show placeholder when no value present', () => {
  cy.visit(route({ latestValue: undefined }));
  cy.contains(NO_VALUE_PRESENT).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('show colored background when threshold breached', () => {
  const LATEST_VALUE = 'ALARM';
  cy.visit(route({ latestValue: LATEST_VALUE, threshold: LATEST_VALUE, showIcon: false }));

  cy.contains(STREAM_NAME).should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('should change name label', () => {
  cy.visit(route({ isEditing: true }));

  const newName = 'Test';

  cy.get('[data-test-tag="expandable-input"]')
    .clear()
    .type(newName);

  cy.get('[data-test-tag="expandable-input"]').contains(newName);
});

it('show colored background and icon when threshold breached', () => {
  const VALUE = 'ALARM';
  cy.visit(route({ latestValue: VALUE, threshold: VALUE, showIcon: true }));

  cy.contains(STREAM_NAME).should('be.visible');
  cy.get('.status-cell')
    .get('.monitor-chart-icon')
    .should('be.visible');
});

it('should use color for label that contrasts with background color', () => {
  const VALUE = 'ALARM';
  cy.visit(route({ numDataStreams: 3, latestValue: VALUE, threshold: VALUE }));

  cy.viewport(2 * WIDTH, 2 * HEIGHT);

  cy.contains(STREAM_NAME).should('be.visible');
  cy.contains(STREAM_NAME_TWO).should('be.visible');
  cy.contains(STREAM_NAME_THREE).should('be.visible');

  cy.matchImageSnapshotOnCI();
});
