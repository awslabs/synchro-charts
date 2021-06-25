import { CHART_VIZ_CONTAINER_SELECTOR } from '../../../../src/testing/selectors';

const root = 'localhost:3333/tests/status-chart';

const VIEWPORT_HEIGHT = 600;
const VIEWPORT_WIDTH = 500;

beforeEach(() => {
  cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
});

it('colors the whole status when passes the threshold', () => {
  cy.visit(`${root}/threshold/coloration`);

  cy.waitForStatusTimeline();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('colors the whole status when passes the threshold at exact point', () => {
  cy.visit(`${root}/threshold/coloration-exact-point`);

  cy.waitForStatusTimeline();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('colors the status when passes the threshold with multiple data streams', () => {
  cy.visit(`${root}/threshold/coloration-multiple-data-stream`);

  cy.waitForStatusTimeline();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('colors the status when passes the multiple thresholds', () => {
  cy.visit(`${root}/threshold/coloration-multiple-thresholds`);

  cy.waitForStatusTimeline();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('colors the status when passes threshold band', () => {
  cy.visit(`${root}/threshold/coloration-band`);

  cy.waitForStatusTimeline();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('colors the status when passes threshold band with discrete numeric data', () => {
  cy.visit(`${root}/threshold/coloration-band?isDiscreteNumericData=1`);

  cy.waitForStatusTimeline();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});

it('colors the status when passes threshold band with string data', () => {
  cy.visit(`${root}/threshold/coloration-band?isStringData=1`);

  cy.waitForStatusTimeline();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
});
