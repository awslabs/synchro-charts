/* eslint-disable cypress/no-unnecessary-waiting */
import { CHART_SIZE } from '../../../src/testing/test-routes/charts/shaders/chartSize';
import { SECOND_IN_MS } from '../../../src/utils/time';
import { visitDynamicWidget } from '../../../src/testing/selectors';
import { DataType } from '../../../src/utils/dataConstants';

const WAIT_MS = SECOND_IN_MS * 2;

it('renders data to a millisecond level of granularity', () => {
  const start = new Date(2020, 0, 0);
  const end = new Date(start.getTime() + 5);

  visitDynamicWidget(cy, {
    componentTag: 'sc-line-chart',
    dataStreams: [
      {
        id: 'some-data-stream',
        name: 'granular-data-stream',
        dataType: DataType.NUMBER,
        resolution: 0,
        data: [
          {
            x: start.getTime(),
            y: 1,
          },
          {
            x: start.getTime() + 1,
            y: 2,
          },
          {
            x: start.getTime() + 2,
            y: 3,
          },
          {
            x: start.getTime() + 3,
            y: 4,
          },
          {
            x: start.getTime() + 4,
            y: 5,
          },
        ],
      },
    ],
    viewportStart: start,
    viewportEnd: end,
  });

  cy.waitForChart();

  // Should display each point a millisecond apart
  cy.get('.data-container').matchImageSnapshotOnCI();
});

describe('bar chart', () => {
  it('renders a single bar', () => {
    cy.visit('/tests/sc-webgl-chart/single-bar');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders a colored bar as red', () => {
    cy.visit('/tests/sc-webgl-chart/single-colored-bar');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders multiple data streams as two bars', () => {
    cy.visit('/tests/sc-webgl-chart/multiple-bars');
    cy.viewport(200, 200);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });
});

describe('line chart', () => {
  it('renders colored point as red', () => {
    cy.visit('/tests/sc-webgl-chart/colored-point');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders circle correctly with anti-aliasing', () => {
    cy.visit('/tests/sc-webgl-chart/circle-point-shaders');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders straight line segment between two dots', () => {
    cy.visit('/tests/sc-webgl-chart/straight-line-segment');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders straight line segment between two dots as the color purple', () => {
    cy.visit('/tests/sc-webgl-chart/straight-line-segment-colored');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders angled line segment between two dots with anti-aliasing', () => {
    cy.visit('/tests/sc-webgl-chart/angled-line-segment');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders multiple data streams as disconnected lines', () => {
    // NOTE: There should be two parallel lines connecting two pairs of dots
    cy.visit('/tests/sc-webgl-chart/multiple-lines');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders multiple data streams as disconnected lines, with lines and points overlapping', () => {
    // NOTE: Ensure that alpha channels are mixing properly within the overlapped region
    cy.visit('/tests/sc-webgl-chart/multiple-lines-overlapping');
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });
});
