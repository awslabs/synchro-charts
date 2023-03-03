import { visitDynamicWidget } from '../../../src/testing/selectors';
import { SearchQueryParams } from '../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { COMPARISON_OPERATOR, DataType } from '../../../src/constants';
import { DataPoint } from '../../../src/utils/dataTypes';
import { Threshold, YAnnotation } from '../../../src/components/charts/common/types';

const baseChartHeight = 500;
const baseChartWidth = 700;

const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 1);

const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 2000,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT: DataPoint<number> = {
  x: new Date(1999, 0, 0).getTime(),
  y: 4000,
};

const TEST_2_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2000, 0, 0).getTime(),
  y: 2000,
};

const yThreshold: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 3500,
  label: {
    text: 'here is a y label',
    show: true,
  },
  showValue: true,
  color: 'blue',
};

const yAnnotation: YAnnotation = {
  isEditable: true,
  value: 2900,
  label: {
    text: 'another y label',
    show: true,
  },
  showValue: true,
  color: 'green',
};

const query: Partial<SearchQueryParams> = {
  componentTag: 'sc-line-chart',
  viewportStart: X_MIN,
  viewportEnd: X_MAX,
  dataStreams: [
    {
      id: 'test',
      color: 'black',
      name: 'test stream',
      data: [TEST_DATA_POINT, TEST_DATA_POINT_2],
      resolution: 0,
      dataType: DataType.NUMBER,
    },
    {
      id: 'test2',
      color: 'orange',
      name: 'test stream2',
      data: [TEST_2_DATA_POINT, TEST_2_DATA_POINT_2],
      resolution: 0,
      dataType: DataType.NUMBER,
    },
  ],
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
        color: 'purple',
      },
    ],
    y: [
      yAnnotation,
      yThreshold,
      {
        ...yThreshold,
        isEditable: false,
        value: 2300,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        color: 'red',
      },
    ],
  },
};

it('elements are located and scaled according to viewport size', () => {
  visitDynamicWidget(cy, {
    ...query,
    dataStreams: [],
  });
  cy.waitForChart();
  cy.viewport(baseChartWidth, baseChartHeight);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('rescales properly with vertical stretch', () => {
  visitDynamicWidget(cy, {
    ...query,
  });
  cy.viewport(baseChartWidth, baseChartHeight);
  cy.waitForChart();
  cy.viewport(baseChartWidth, baseChartHeight + 550);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('rescales properly with horizontal stretch', () => {
  visitDynamicWidget(cy, {
    ...query,
  });
  cy.viewport(baseChartWidth, baseChartHeight);
  cy.waitForChart();
  cy.viewport(baseChartWidth + 525, baseChartHeight);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});

it('rescales properly with diagonal stretch', () => {
  visitDynamicWidget(cy, {
    ...query,
  });
  cy.viewport(baseChartWidth, baseChartHeight);
  cy.waitForChart();
  cy.viewport(baseChartWidth + 700, baseChartHeight + 700);
  cy.waitForChart();
  cy.matchImageSnapshotOnCI();
});
