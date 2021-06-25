const root = 'localhost:3333/tests/monitor-scatter-chart';

const VIEWPORT_HEIGHT = 500;
const VIEWPORT_WIDTH = 500;

beforeEach(() => {
  cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
});

it('colors the breaching dot with threshold color', () => {
  cy.visit(`${root}/threshold/coloration`);

  cy.waitForChart();

  cy.matchImageSnapshotOnCI();
});

it('colors the breaching dot with threshold color when threshold is exactly the same as the data point', () => {
  cy.visit(`${root}/threshold/coloration-exact-point`);

  cy.waitForChart();

  cy.matchImageSnapshotOnCI();
});

it('colors the breaching dots for multiple data streams', () => {
  cy.visit(`${root}/threshold/coloration-multiple-data-stream`);

  cy.waitForChart();

  cy.matchImageSnapshotOnCI();
});

it('colors the breaching dots for one data streams with multiple thresholds', () => {
  cy.visit(`${root}/threshold/coloration-multiple-thresholds`);

  cy.waitForChart();

  cy.matchImageSnapshotOnCI();
});

it('creates a threshold band coloration with a greater than and a lower than threshold.', () => {
  cy.visit(`${root}/threshold/coloration-band`);

  cy.waitForChart();

  cy.matchImageSnapshotOnCI();
});

it('does not color the scatter plot when passes in show color false in threshold option', () => {
  cy.visit(`${root}/threshold/no-coloration`);

  cy.waitForChart();

  cy.matchImageSnapshotOnCI();
});
