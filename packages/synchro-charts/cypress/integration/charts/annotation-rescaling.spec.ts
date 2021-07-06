import { SECOND_IN_MS } from '../../../src/utils/time';

const root = 'localhost:3333';

const WAIT_MS = SECOND_IN_MS * 2;
const baseChartHeight = 500;
const baseChartWidth = 600;

describe('annotations', () => {
  it('elements are located and scaled according to viewport size', () => {
    cy.visit(`${root}/tests/sc-webgl-chart/annotations/annotation-rescaling`);
    cy.viewport(baseChartWidth, baseChartHeight);
    cy.wait(WAIT_MS);
    cy.matchImageSnapshotOnCI();
  });

  it('rescales properly with vertical stretch', () => {
    cy.visit(`${root}/tests/sc-webgl-chart/annotations/annotation-rescaling`);
    cy.viewport(baseChartWidth, baseChartHeight);
    cy.wait(WAIT_MS);
    cy.viewport(baseChartWidth, baseChartHeight + 400);
    cy.wait(WAIT_MS);
    cy.matchImageSnapshotOnCI();
  });

  it('rescales properly with horizontal stretch', () => {
    cy.visit(`${root}/tests/sc-webgl-chart/annotations/annotation-rescaling`);
    cy.viewport(baseChartWidth, baseChartHeight);
    cy.wait(WAIT_MS);
    cy.viewport(baseChartWidth + 300, baseChartHeight);
    cy.wait(WAIT_MS);
    cy.matchImageSnapshotOnCI();
  });

  it('rescales properly with diagonal stretch', () => {
    cy.visit(`${root}/tests/sc-webgl-chart/annotations/annotation-rescaling`);
    cy.viewport(baseChartWidth, baseChartHeight);
    cy.wait(WAIT_MS);
    cy.viewport(baseChartWidth + 300, baseChartHeight + 300);
    cy.wait(WAIT_MS);
    cy.matchImageSnapshotOnCI();
  });
});
