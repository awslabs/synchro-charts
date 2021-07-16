/* eslint-disable cypress/no-unnecessary-waiting */
import { SECOND_IN_MS } from '../../../../src/utils/time';
import { Y_VALUE } from '../../../../src/testing/test-routes/charts/constants';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

const SMALL_WAIT = 0.1 * SECOND_IN_MS;

describe('bar chart', () => {
  const root = 'localhost:3333/tests/sc-webgl-bar-chart';

  const VIEWPORT_HEIGHT = 600;
  const VIEWPORT_WIDTH = 500;

  beforeEach(() => {
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  });

  it('renders single bar', () => {
    cy.visit(`${root}/standard`);

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders bar margin when the time difference between the first data point and the second data point is the same as the resolution', () => {
    cy.visit(`${root}/margin`);

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders a single negative bar', () => {
    cy.visit(`${root}/negative`);

    cy.waitForChart();

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders bar chart from zero when all points are positive', () => {
    cy.visit(`${root}/start-from-zero`);

    cy.waitForChart();

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders bar chart from zero when all points are negative', () => {
    cy.visit(`${root}/start-from-zero`);

    cy.waitForChart();

    cy.get('#change-data-direction').click();
    cy.wait(SMALL_WAIT);

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders a positive bar and follow by a negative bar', () => {
    cy.visit(`${root}/pos-neg`);

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders multiple bars from a single data stream with multiple points', () => {
    cy.viewport(VIEWPORT_WIDTH, 700);
    cy.visit(`${root}/bar-chart-dynamic-data-streams`);

    cy.waitForChart();

    cy.get('#add-stream').click();
    cy.wait(SMALL_WAIT);
    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders the tooltip for the last bar when the mouse position is center and last bar is right biased', () => {
    cy.viewport(VIEWPORT_WIDTH, 700);
    cy.visit(`${root}/bar-chart-dynamic-data-streams`);

    cy.waitForChart();

    cy.get('#add-stream').click();
    cy.wait(SMALL_WAIT);

    cy.get('.data-container').trigger('mousemove', { offsetX: VIEWPORT_WIDTH / 2, offsetY: 100 });
    cy.get('.bar').should('be.visible');

    cy.get('.tooltip-container').contains(Y_VALUE);

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders no points or bar when data is added and then removed', () => {
    cy.visit(`${root}/bar-chart-dynamic-data`);

    cy.waitForChart();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#remove-data-point').click();

    cy.get('#remove-data-point').click();
    cy.wait(SMALL_WAIT);

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders one bar when one data point added dynamically', () => {
    cy.visit(`${root}/bar-chart-dynamic-data`);

    cy.waitForChart();

    cy.get('#add-data-point').click();
    cy.wait(SMALL_WAIT);
    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders two bars when data is added twice', () => {
    cy.visit(`${root}/bar-chart-dynamic-data`);

    cy.waitForChart();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.wait(SMALL_WAIT);

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders one data stream after two is added and one removed', () => {
    cy.visit(`${root}/bar-chart-dynamic-data`);

    cy.waitForChart();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#remove-data-point').click();
    cy.wait(SMALL_WAIT);

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders no data stream when stream is added and removed', () => {
    cy.visit(`${root}/bar-chart-dynamic-data-streams`);

    cy.waitForChart();

    cy.get('#add-stream').click();
    cy.get('#remove-stream').click();
    cy.wait(SMALL_WAIT);

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });
});

describe('handles buffer increasing in size after initialization', () => {
  const root = 'localhost:3333/tests/sc-webgl-bar-chart';
  const VIEWPORT_HEIGHT = 600;
  const VIEWPORT_WIDTH = 500;

  beforeEach(() => {
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  });

  it('renders bars that are added and do not fit beyond the initial buffer size', () => {
    cy.visit(`${root}/bar-chart-dynamic-buffer`);

    cy.waitForChart();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();

    cy.wait(SMALL_WAIT);

    // Should see 4 bars.
    addMatchImageSnapshotCommand({
      failureThresholdType: 'pixel',
      failureThreshold: 11,
      customDiffConfig: { threshold: 0.2 },
    });
    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders bars when switch to a viewport way outside the points and back to the original viewport', () => {
    cy.visit(`${root}/bar-chart-fast-viewport`);

    cy.waitForChart();

    cy.get('#change-viewport').click();
    cy.get('#change-viewport').click();
    cy.get('#change-viewport').click();
    cy.get('#change-viewport').click();
    cy.wait(SMALL_WAIT);

    // Should see the bars.
    cy.get('#chart-container').matchImageSnapshotOnCI();
  });
});
