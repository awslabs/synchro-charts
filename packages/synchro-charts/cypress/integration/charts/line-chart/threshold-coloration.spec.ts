const root = 'localhost:3333/tests/sc-webgl-chart';

const VIEWPORT_HEIGHT = 500;
const VIEWPORT_WIDTH = 500;

beforeEach(() => {
  cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
});

it('colors part of the line segment that passes a greater than threshold', () => {
  cy.visit(`${root}/threshold/coloration-split-half`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors the dot when the threshold is equal to one single point', () => {
  cy.visit(`${root}/threshold/coloration-exact-point`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors part of the line segments that passes a greater than threshold for two data streams', () => {
  cy.visit(`${root}/threshold/coloration-multiple-data-stream`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('colors part of the line segments that passes a two greater than threshold for two data streams', () => {
  cy.visit(`${root}/threshold/coloration-multiple-thresholds`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('creates a threshold band coloration with one less than threshold and one greater than threshold', () => {
  cy.visit(`${root}/threshold/coloration-band`);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});
