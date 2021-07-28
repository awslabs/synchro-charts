import { visitDynamicWidget } from '../../../../src/testing/selectors';
import { SearchQueryParams } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { Threshold, XAnnotation } from '../../../../src/components/charts/common/types';
import { COMPARISON_OPERATOR, DataType } from '../../../../src/constants';
import {
  DRAGGABLE_HANDLE_SELECTOR,
  LINE_SELECTOR,
  TEXT_VALUE_SELECTOR,
} from '../../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';
import { DataPoint } from '../../../../src/utils/dataTypes';
import { X_ANNOTATION, Y_THRESHOLD, Y_ANNOTATION } from '../../../../src/testing/test-routes/charts/constants';
import { moveHandle, moveHandleFilter, moveHandleWithPause } from '../utils-draggable';

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
  ...Y_THRESHOLD,
  value: 2200,
};

const xAnnotation: XAnnotation = {
  ...X_ANNOTATION,
  value: new Date(X_MIN.getTime() + (1 / 4) * (X_MAX.getTime() - X_MIN.getTime())),
};

const timelineParams: Partial<SearchQueryParams> = {
  componentTag: 'sc-scatter-chart',
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

it('editable threshold is draggable, recolors data within viewport, emits widgetUpdate event', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [yThreshold],
    },
  });
  cy.waitForChart();
  cy.wrap(
    new Promise(resolve => {
      cy.document().then(doc => {
        doc.addEventListener('widgetUpdated', resolve);
        moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 0);
      });
    })
  ).then(() => {
    cy.matchImageSnapshotOnCI();
  });
});

it('draggable annotation rescales axis in positive direction', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [yThreshold],
    },
  });
  cy.waitForChart();
  moveHandleWithPause(DRAGGABLE_HANDLE_SELECTOR, 0, -500);

  cy.get('g.axis.y-axis > g.tick').should('have.length', 17);
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(16)
    .should('have.text', '9,000');
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(0)
    .should('have.text', '1,000');
});

it('draggable annotation rescales axis in negative direction', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [Y_ANNOTATION],
    },
  });
  cy.waitForChart();
  moveHandleWithPause(DRAGGABLE_HANDLE_SELECTOR, 0, 1000);

  cy.get('g.axis.y-axis > g.tick').should('have.length', 10);
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(9)
    .should('have.text', '5,000');
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(0)
    .should('have.text', '−4,000');
});

it('non-Editable annotation is not draggable', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [
        {
          ...Y_ANNOTATION,
          isEditable: false,
        },
      ],
    },
  });
  cy.waitForChart();
  cy.get(TEXT_VALUE_SELECTOR)
    .invoke('attr', 'y')
    .as('initialY_text');

  cy.get(LINE_SELECTOR)
    .invoke('attr', 'y1')
    .as('initialY_line');

  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 200);

  cy.get(TEXT_VALUE_SELECTOR)
    .invoke('attr', 'y')
    .as('afterY_text');

  cy.get(LINE_SELECTOR)
    .invoke('attr', 'y1')
    .as('afterY_line');

  cy.get('@initialY_text').then(initialY => {
    cy.get('@afterY_text').then(afterY => {
      expect(initialY).to.include(afterY);
    });
  });

  cy.get('@initialY_line').then(initialY => {
    cy.get('@afterY_line').then(afterY => {
      expect(initialY).to.include(afterY);
    });
  });
});

it('annotation with hidden value is draggable', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [
        {
          ...yThreshold,
          showValue: false,
        },
      ],
    },
  });
  cy.waitForChart();
  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .invoke('attr', 'y')
    .then(str => parseFloat(str!))
    .should('be.gte', 281)
    .should('be.lte', 283);

  cy.get(LINE_SELECTOR)
    .invoke('attr', 'y1')
    .then(str => parseFloat(str!))
    .should('be.gte', 292)
    .should('be.lte', 294);

  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 0);

  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .invoke('attr', 'y')
    .then(str => parseFloat(str!))
    .should('be.gte', 32)
    .should('be.lte', 34);

  cy.get(LINE_SELECTOR)
    .invoke('attr', 'y1')
    .then(str => parseFloat(str!))
    .should('be.gte', 43)
    .should('be.lte', 45);
});

it('allows independent dragging of multiple annotations', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [
        {
          ...yThreshold,
          showValue: false,
          color: 'red',
          comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
        },
        {
          ...Y_ANNOTATION,
          color: 'blue',
        },
        {
          ...yThreshold,
          value: 3600,
          color: 'green',
        },
      ],
    },
  });
  cy.waitForChart();

  const moveFirst = 180;
  const firstFilter = '[style*="stroke: blue;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, firstFilter, 0, moveFirst);

  const moveSecond = 100;
  const secondFilter = '[style*="stroke: red;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, secondFilter, 0, moveSecond);

  const moveThird = 400;
  const thirdFilter = '[style*="stroke: green;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, thirdFilter, 0, moveThird);
  cy.matchImageSnapshotOnCI();
});
