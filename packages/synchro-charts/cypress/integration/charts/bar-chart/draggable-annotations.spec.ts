import { visitDynamicWidget } from '../../../../src/testing/selectors';
import { SearchQueryParams } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import {
  TEST_DATA_POINT_STANDARD,
  X_ANNOTATION,
  Y_ANNOTATION,
  X_MAX,
  X_MIN,
  Y_THRESHOLD,
} from '../../../../src/testing/test-routes/charts/constants';
import { DataType } from '../../../../src/constants';
import { MINUTE_IN_MS } from '../../../../src/utils/time';
import {
  DRAGGABLE_HANDLE_SELECTOR,
  ELEMENT_GROUP_SELECTOR,
} from '../../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';
import { moveHandle, moveHandleFilter, moveHandleWithPause, parseTransformYValue } from '../utils-draggable';

const timelineParams: Partial<SearchQueryParams> = {
  componentTag: 'sc-bar-chart',
  viewportStart: X_MIN,
  viewportEnd: X_MAX,
  dataStreams: [
    {
      id: 'test',
      color: 'black',
      name: 'test stream',
      data: [],
      aggregates: { [MINUTE_IN_MS]: [TEST_DATA_POINT_STANDARD] },
      resolution: MINUTE_IN_MS,
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
      x: [X_ANNOTATION],
      y: [Y_THRESHOLD],
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
      x: [X_ANNOTATION],
      y: [Y_THRESHOLD],
    },
  });
  cy.waitForChart();
  moveHandleWithPause(DRAGGABLE_HANDLE_SELECTOR, 0, -500);

  cy.get('g.axis.y-axis > g.tick').should('have.length', 17);
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(16)
    .should('have.text', '8k');
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(0)
    .should('have.text', '0');
});

it('draggable annotation rescales axis in negative direction', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [X_ANNOTATION],
      y: [Y_ANNOTATION],
    },
  });
  cy.waitForChart();
  moveHandleWithPause(DRAGGABLE_HANDLE_SELECTOR, 0, 1000);

  cy.get('g.axis.y-axis > g.tick').should('have.length', 9);
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(8)
    .should('have.text', '3k');
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(0)
    .should('have.text', '−5k');
});

it('non-Editable annotation is not draggable', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [X_ANNOTATION],
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
      x: [X_ANNOTATION],
      y: [
        {
          ...Y_THRESHOLD,
          showValue: false,
        },
      ],
    },
  });
  cy.waitForChart();
  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .invoke('attr', 'y')
    .then(str => parseFloat(str!))
    .should('be.gte', 349)
    .should('be.lte', 351);

  cy.get(ELEMENT_GROUP_SELECTOR)
    .invoke('attr', 'transform')
    .then(str => parseTransformYValue(str!))
    .should('be.gte', 360)
    .should('be.lte', 362);

  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 200);

  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .invoke('attr', 'y')
    .then(str => parseFloat(str!))
    .should('be.gte', 165)
    .should('be.lte', 167);

  cy.get(ELEMENT_GROUP_SELECTOR)
    .invoke('attr', 'transform')
    .then(str => parseTransformYValue(str!))
    .should('be.gte', 176)
    .should('be.lte', 178);
});

it('allows independent dragging of multiple annotations', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [X_ANNOTATION],
      y: [
        {
          ...Y_THRESHOLD,
          showValue: false,
          color: 'red',
        },
        {
          ...Y_ANNOTATION,
          color: 'blue',
        },
        {
          ...Y_THRESHOLD,
          value: 1500,
          color: 'green',
        },
      ],
    },
  });
  cy.waitForChart();

  const moveFirst = 400;
  const firstFilter = '[style*="stroke: blue;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, firstFilter, 0, moveFirst);

  const moveSecond = 150;
  const secondFilter = '[style*="stroke: red;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, secondFilter, 0, moveSecond);

  const moveThird = -50;
  const thirdFilter = '[style*="stroke: green;"]';
  moveHandleFilter(DRAGGABLE_HANDLE_SELECTOR, thirdFilter, 0, moveThird);
  cy.matchImageSnapshotOnCI();
});
