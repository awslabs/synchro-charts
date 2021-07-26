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
  LINE_SELECTOR,
  TEXT_VALUE_SELECTOR,
} from '../../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';
import { moveHandle, moveHandleFilter, moveHandlWithPause } from '../utils-draggable';

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
  moveHandlWithPause(DRAGGABLE_HANDLE_SELECTOR, 0, -500);

  cy.get('g.axis.y-axis > g.tick').should('have.length', 17);
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(16)
    .should('have.text', '8,000');
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
  moveHandlWithPause(DRAGGABLE_HANDLE_SELECTOR, 0, 1000);

  cy.get('g.axis.y-axis > g.tick').should('have.length', 9);
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(8)
    .should('have.text', '3,000');
  cy.get('g.axis.y-axis > g.tick > text')
    .eq(0)
    .should('have.text', '−5,000');
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

  cy.get(LINE_SELECTOR)
    .invoke('attr', 'y1')
    .then(str => parseFloat(str!))
    .should('be.gte', 360)
    .should('be.lte', 362);

  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 200);

  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .invoke('attr', 'y')
    .then(str => parseFloat(str!))
    .should('be.gte', 132)
    .should('be.lte', 134);

  cy.get(LINE_SELECTOR)
    .invoke('attr', 'y1')
    .then(str => parseFloat(str!))
    .should('be.gte', 143)
    .should('be.lte', 145);
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
