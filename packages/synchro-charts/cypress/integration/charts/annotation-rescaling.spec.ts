import { SECOND_IN_MS } from '../../../src/utils/time';
import { visitDynamicWidget } from '../../../src/testing/selectors';
import { SearchQueryParams } from '../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { X_MAX, X_MIN, Y_MAX, Y_MIN } from '../../../src/testing/test-routes/charts/constants';

const WAIT_MS = SECOND_IN_MS * 2;
const baseChartHeight = 500;
const baseChartWidth = 700;

describe('annotations', () => {
  const viewPortStart = X_MIN;
  const viewPortEnd = X_MAX;
  const timelineParams: Partial<SearchQueryParams> = {
    componentTag: 'sc-line-chart',
    viewPortStart,
    viewPortEnd,
    dataStreams: [],
    width: '95%',
    height: '95%',
  };

  const testAnnotations = {
    x: [
      {
        value: new Date((X_MAX.getTime() + X_MIN.getTime()) / 2),
        label: {
          text: 'here is a x label',
          show: true,
        },
        showValue: true,
        color: 'red',
      },
    ],
    y: [
      {
        value: (Y_MAX - Y_MIN) / 2,
        label: {
          text: 'here is a y label',
          show: true,
        },
        showValue: true,
        color: 'blue',
      },
    ],
  };

  it('elements are located and scaled according to viewport size', () => {
    visitDynamicWidget(cy, {
      ...timelineParams,
      annotations: testAnnotations,
    });
    cy.waitForChart();
    cy.viewport(baseChartWidth, baseChartHeight);
    cy.waitForChart();
    cy.matchImageSnapshotOnCI();
  });

  it('rescales properly with vertical stretch', () => {
    visitDynamicWidget(cy, {
      ...timelineParams,
      annotations: testAnnotations,
    });
    cy.viewport(baseChartWidth, baseChartHeight);
    // cy.waitForChart();
    cy.viewport(baseChartWidth, baseChartHeight + 400);
    cy.wait(WAIT_MS);
    cy.matchImageSnapshotOnCI();
  });

  it('rescales properly with horizontal stretch', () => {
    visitDynamicWidget(cy, {
      ...timelineParams,
      annotations: testAnnotations,
    });
    cy.viewport(baseChartWidth, baseChartHeight);
    cy.wait(WAIT_MS);
    cy.viewport(baseChartWidth + 300, baseChartHeight);
    cy.wait(WAIT_MS);
    cy.matchImageSnapshotOnCI();
  });

  it('rescales properly with diagonal stretch', () => {
    visitDynamicWidget(cy, {
      ...timelineParams,
      annotations: testAnnotations,
    });
    cy.viewport(baseChartWidth, baseChartHeight);
    cy.wait(WAIT_MS);
    cy.viewport(baseChartWidth + 300, baseChartHeight + 300);
    cy.wait(WAIT_MS);
    cy.matchImageSnapshotOnCI();
  });
});
