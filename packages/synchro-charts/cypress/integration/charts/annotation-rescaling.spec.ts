import { visitDynamicWidget } from '../../../src/testing/selectors';
import { SearchQueryParams } from '../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { X_MAX, X_MIN, Y_MAX, Y_MIN } from '../../../src/testing/test-routes/charts/constants';
import { DataStream } from '../../../src/utils/dataTypes';
import { DataType } from '../../../src/constants';

const baseChartHeight = 500;
const baseChartWidth = 700;

const NUMBER_STREAM: DataStream = {
  id: 'id',
  color: 'cyan',
  name: 'number-some-name',
  dataType: DataType.NUMBER,
  resolution: 0,
  data: [
    {
      x: X_MAX.getTime(),
      y: 100,
    },
    {
      x: new Date(2000, 0, 1, 0, 0).getTime(),
      y: 40,
    },
    {
      x: new Date(2000, 0, 1, 2, 0).getTime(),
      y: 60,
    },
  ],
};

const viewportStart = X_MIN;
const viewportEnd = X_MAX;
const timelineParams: Partial<SearchQueryParams> = {
  componentTag: 'sc-bar-chart',
  viewportStart,
  viewportEnd,
  dataStreams: [NUMBER_STREAM],
  width: '95%',
  height: '95%',
  annotations: {
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
  },
};

it('elements are located and scaled according to viewport size', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
  });
  cy.waitForChart();
  cy.viewport(baseChartWidth, baseChartHeight);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('rescales properly with vertical stretch', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
  });
  cy.viewport(baseChartWidth, baseChartHeight);
  cy.waitForChart();
  cy.viewport(baseChartWidth, baseChartHeight + 550);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('rescales properly with horizontal stretch', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
  });
  cy.viewport(baseChartWidth, baseChartHeight);
  cy.waitForChart();
  cy.viewport(baseChartWidth + 525, baseChartHeight);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('rescales properly with diagonal stretch', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
  });
  cy.viewport(baseChartWidth, baseChartHeight);
  cy.waitForChart();
  cy.viewport(baseChartWidth + 700, baseChartHeight + 700);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});
