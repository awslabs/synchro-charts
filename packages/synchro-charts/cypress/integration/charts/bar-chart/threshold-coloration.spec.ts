const root = 'localhost:3333/tests/sc-webgl-bar-chart';

const VIEWPORT_HEIGHT = 600;
const VIEWPORT_WIDTH = 500;

beforeEach(() => {
  cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
});

it('colors the whole bar when passes the threshold', () => {
  cy.visit(`${root}/threshold/coloration`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the whole bar when passes the threshold at exact point', () => {
  cy.visit(`${root}/threshold/coloration-exact-point`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the bars when passes the threshold with multiple data streams', () => {
  cy.visit(`${root}/threshold/coloration-multiple-data-stream`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the bars when passes the multiple thresholds', () => {
  cy.visit(`${root}/threshold/coloration-multiple-thresholds`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the bars when passes threshold band', () => {
  cy.visit(`${root}/threshold/coloration-band`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('does not color the bars when passes in show color false in threshold option', () => {
  cy.visit(`${root}/threshold/no-coloration`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});
