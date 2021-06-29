const bcRoot = 'localhost:3333/tests/sc-webgl-bar-chart';

// @ts-ignore
const VIEWPORT_HEIGHT = 600;
// @ts-ignore
const VIEWPORT_WIDTH = 500;

beforeEach(() => {
  cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
});

it('colors the whole bar when passes the threshold', () => {
  cy.visit(`${bcRoot}/threshold/coloration`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the whole bar when passes the threshold at exact point', () => {
  cy.visit(`${bcRoot}/threshold/coloration-exact-point`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the bars when passes the threshold with multiple data streams', () => {
  cy.visit(`${bcRoot}/threshold/coloration-multiple-data-stream`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the bars when passes the multiple thresholds', () => {
  cy.visit(`${bcRoot}/threshold/coloration-multiple-thresholds`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the bars when passes threshold band', () => {
  cy.visit(`${bcRoot}/threshold/coloration-band`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('does not color the bars when passes in show color false in threshold option', () => {
  cy.visit(`${bcRoot}/threshold/no-coloration`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});
