import { visitDynamicWidget } from '../../../src/testing/selectors';
import { SearchQueryParams } from '../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { COMPARISON_OPERATOR, DataType } from '../../../src/constants';
import { DataPoint } from '../../../src/utils/dataTypes';
import { Threshold, YAnnotation } from '../../../src/components/charts/common/types';
import { GRADIENT_RECT_SELECTOR } from '../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';

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

const yThresholdOne: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 3500,
  label: {
    text: 'here is a y label',
    show: true,
  },
  showValue: true,
  color: 'blue',
  id: 'threshold-one',
};

const yThresholdTwo: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
  value: 2400,
  label: {
    text: 'hello y label',
    show: true,
  },
  showValue: true,
  color: 'red',
  id: 'threshold-two',
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

const timelineParams: Partial<SearchQueryParams> = {
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
};

const root = '/tests/sc-webgl-chart/annotations/annotation-editable';

it('correctly positions and rotates the elements', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      y: [yThresholdOne, yAnnotation, yThresholdTwo],
      displayThresholdGradient: true,
    },
  });

  cy.matchImageSnapshotOnCI();
});

it('handles id collision', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      y: [
        yThresholdOne,
        yAnnotation,
        { ...yThresholdOne, value: 2400, comparisonOperator: COMPARISON_OPERATOR.LESS_THAN },
      ],
      displayThresholdGradient: true,
    },
  });

  cy.matchImageSnapshotOnCI();
});

it('changing operator updates threshold gradients', () => {
  cy.visit(root);
  cy.waitForChart();

  const firstFilter = '[style*="#blue-threshold"]';
  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(firstFilter)
    .invoke('attr', 'transform')
    .should('eq', 'rotate(0)');

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(firstFilter)
    .invoke('attr', 'display')
    .should('eq', 'inline');

  const secondFilter = '[style*="#green-threshold"]';
  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(secondFilter)
    .invoke('attr', 'transform')
    .should('eq', 'rotate(180)');

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(secondFilter)
    .invoke('attr', 'display')
    .should('eq', 'inline');

  const thirdFilter = '[style*="#red-annotation"]';
  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(thirdFilter)
    .invoke('attr', 'display')
    .should('eq', 'none');

  cy.get('#change-operator').click();

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(firstFilter)
    .invoke('attr', 'display')
    .should('eq', 'none');

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(secondFilter)
    .invoke('attr', 'transform')
    .should('eq', 'rotate(0)');

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(secondFilter)
    .invoke('attr', 'display')
    .should('eq', 'inline');

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(thirdFilter)
    .invoke('attr', 'transform')
    .should('eq', 'rotate(180)');

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(thirdFilter)
    .invoke('attr', 'display')
    .should('eq', 'inline');

  cy.matchImageSnapshotOnCI();
});

it('changing color updates threshold gradients', () => {
  cy.visit(root);
  cy.waitForChart();
  cy.get('#change-color').click();
  cy.matchImageSnapshotOnCI();
});

it('enableDisable updates threshold gradients', () => {
  cy.visit(root);
  cy.waitForChart();
  cy.get('#change-gradient').click();

  const firstFilter = '[style*="#blue-threshold"]';

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(firstFilter)
    .invoke('attr', 'display')
    .should('eq', 'none');

  const secondFilter = '[style*="#green-threshold"]';

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(secondFilter)
    .invoke('attr', 'display')
    .should('eq', 'none');

  const thirdFilter = '[style*="#red-annotation"]';
  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(thirdFilter)
    .invoke('attr', 'display')
    .should('eq', 'none');

  cy.get('#change-gradient').click();

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(firstFilter)
    .invoke('attr', 'display')
    .should('eq', 'inline');

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(secondFilter)
    .invoke('attr', 'display')
    .should('eq', 'inline');

  cy.get(GRADIENT_RECT_SELECTOR)
    .filter(thirdFilter)
    .invoke('attr', 'display')
    .should('eq', 'none');
});
