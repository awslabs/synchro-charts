import { visitDynamicWidget } from '../../../../src/testing/selectors';
import { SearchQueryParams } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { Threshold, XAnnotation } from '../../../../src/components/charts/common/types';
import { COMPARISON_OPERATOR, DataType } from '../../../../src/constants';
import { DataPoint } from '../../../../src/utils/dataTypes';
import { moveHandle, moveHandleFilter, moveHandleWithPause, parseTransformYValue } from '../utils-draggable';
import { Y_THRESHOLD, Y_ANNOTATION, X_ANNOTATION } from '../../../../src/testing/test-routes/charts/constants';
import {
  DRAGGABLE_HANDLE_SELECTOR,
  ELEMENT_GROUP_SELECTOR,
} from '../../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';
import { FOCUS_TRANSITION_TIME } from '../../../../src/components/charts/common/annotations/draggableAnnotations';

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

it('changing isEditable updates draggable annotations', () => {
  cy.visit(root);
  cy.waitForChart();

  const moveFirst = 400;
  const firstFilter = '[style*="stroke: blue;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, firstFilter, 0, moveFirst);

  const secondFilter = '[style*="stroke: red;"]';
  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .filter(secondFilter)
    .should('not.exist');

  const moveThird = -50;
  const thirdFilter = '[style*="stroke: green;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, thirdFilter, 0, moveThird);

  cy.get('#change-editable').click();

  const moveFourth = 350;

  cy.wrap(
    new Promise(resolve => {
      cy.document().then(doc => {
        doc.addEventListener('widgetUpdated', resolve);
        cy.get(DRAGGABLE_HANDLE_SELECTOR)
          .filter(firstFilter)
          .should('not.exist');
        cy.get(DRAGGABLE_HANDLE_SELECTOR)
          .filter(thirdFilter)
          .should('not.exist');
        moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, secondFilter, 0, moveFourth);
      });
    })
  ).then(() => {
    cy.matchImageSnapshotOnCI();
  });
});

it('drags properly without snapping back even if outdated annotation is passed in', () => {
  cy.visit(root);
  cy.waitForChart();

  const moveThird = 200;
  const selector = DRAGGABLE_HANDLE_SELECTOR;
  const waitTime = 3 * 1000; // we wait 3 s which will allow 2 instances of outdated annotations to be passed in
  const handleFilter = '[style*="stroke: green;"]';
  const textFilter = '[style*="fill: green;"]';

  cy.window().then(win => {
    cy.get(selector)
      .filter(handleFilter)
      .trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .filter(handleFilter)
      .trigger('mousemove', { clientX: 0, clientY: moveThird, force: true, view: win });
    cy.wait(waitTime);

    cy.matchImageSnapshot(); // also doubles as test for focus mode

    cy.get('g.y-annotation-editable > g.y-elements-group > text.y-value-text')
      .filter(textFilter)
      .should('have.text', '3980');

    cy.get(DRAGGABLE_HANDLE_SELECTOR)
      .filter(handleFilter)
      .invoke('attr', 'y')
      .then(str => parseFloat(str!))
      .should('be.gte', 130)
      .should('be.lte', 232);

    cy.get(selector)
      .filter(handleFilter)
      .trigger('mouseup', { force: true, view: win });
    cy.wait(2 * FOCUS_TRANSITION_TIME);

    cy.get('g.y-annotation-editable > g.y-elements-group > text.y-value-text')
      .filter(textFilter)
      .should('have.text', '3980');

    cy.get(DRAGGABLE_HANDLE_SELECTOR)
      .filter(handleFilter)
      .invoke('attr', 'y')
      .then(str => parseFloat(str!))
      .should('be.gte', 130)
      .should('be.lte', 232);
  });
});

it('changing showValue updates draggable annotations', () => {
  cy.visit(root);
  cy.waitForChart();

  cy.get('#change-showvalue').click();

  const moveFirst = 400;
  const firstFilter = '[style*="stroke: blue;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, firstFilter, 0, moveFirst);

  const secondFilter = '[style*="stroke: red;"]';
  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .filter(secondFilter)
    .should('not.exist');

  const moveThird = -50;
  const thirdFilter = '[style*="stroke: green;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, thirdFilter, 0, moveThird);

  cy.waitForChart();

  cy.matchImageSnapshotOnCI();
});

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
        moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 120);
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

  cy.get(DRAGGABLE_HANDLE_SELECTOR).should('not.exist');
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

  cy.get(ELEMENT_GROUP_SELECTOR)
    .invoke('attr', 'transform')
    .then(str => parseTransformYValue(str!))
    .should('be.gte', 292)
    .should('be.lte', 294);

  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 0);

  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .invoke('attr', 'y')
    .then(str => parseFloat(str!))
    .should('be.gte', 35)
    .should('be.lte', 37);

  cy.get(ELEMENT_GROUP_SELECTOR)
    .invoke('attr', 'transform')
    .then(str => parseTransformYValue(str!))
    .should('be.gte', 46)
    .should('be.lte', 48);
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
      displayThresholdGradient: true,
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
