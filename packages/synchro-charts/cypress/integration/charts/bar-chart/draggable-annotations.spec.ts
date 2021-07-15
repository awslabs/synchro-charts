import { visitDynamicWidget } from '../../../../src/testing/selectors';
import { SearchQueryParams } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { TEST_DATA_POINT_STANDARD, X_MAX, X_MIN } from '../../../../src/testing/test-routes/charts/constants';
import { Threshold, XAnnotation, YAnnotation } from '../../../../src/components/charts/common/types';
import { COMPARISON_OPERATOR, DataType } from '../../../../src/constants';
import { MINUTE_IN_MS } from '../../../../src/utils/time';
import { DRAGGABLE_HANDLE_SELECTOR } from '../../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';

const viewPortStart = X_MIN;
const viewPortEnd = X_MAX;

const yThreshold: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 100,
  label: {
    text: 'here is a y label',
    show: true,
  },
  showValue: true,
  color: 'blue',
};

const yAnnotation: YAnnotation = {
  isEditable: true,
  value: 2600,
  label: {
    text: 'another y label',
    show: true,
  },
  showValue: true,
  color: 'green',
};

const xAnnotation: XAnnotation = {
  value: new Date(X_MIN.getTime() + (1 / 3) * (X_MAX.getTime() - X_MIN.getTime())),
  label: {
    text: 'here is a x label',
    show: true,
  },
  showValue: true,
  color: 'red',
};

const timelineParams: Partial<SearchQueryParams> = {
  componentTag: 'sc-bar-chart',
  viewPortStart,
  viewPortEnd,
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

function moveHandle(selector: string, x: number, y: number) {
  cy.window().then(win => {
    cy.get(selector).trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .trigger('mousemove', { clientX: x, clientY: y, force: true, view: win })
      .trigger('mouseup', { force: true, view: win });
  });
}

function moveHandleFilter(selector: string, filter: string, x: number, y: number) {
  cy.window().then(win => {
    cy.get(selector)
      .filter(filter)
      .trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .filter(filter)
      .trigger('mousemove', { clientX: x, clientY: y, force: true, view: win })
      .trigger('mouseup', { force: true, view: win });
  });
}

function moveHandlWithPause(selector: string, x: number, y: number) {
  cy.window().then(win => {
    cy.get(selector).trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .trigger('mousemove', { clientX: x, clientY: y, force: true, view: win })
      .wait(500);
  });
}

it('editable threshold is draggable and recolors data within viewport', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [yThreshold],
    },
  });
  cy.waitForChart();
  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 0);
  cy.matchImageSnapshotOnCI();
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
  moveHandlWithPause(DRAGGABLE_HANDLE_SELECTOR, 0, -500);
  cy.matchImageSnapshotOnCI();
});

it('draggable annotation rescales axis in negative direction', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [yAnnotation],
    },
  });
  cy.waitForChart();
  moveHandlWithPause(DRAGGABLE_HANDLE_SELECTOR, 0, 1000);
  cy.matchImageSnapshotOnCI();
});

it('non-Editable annotation is not draggable', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [
        {
          ...yAnnotation,
          isEditable: false,
        },
      ],
    },
  });
  cy.waitForChart();
  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 200);
  cy.matchImageSnapshotOnCI();
});

it('hidden value annotation is draggable', () => {
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
  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 200);
  cy.matchImageSnapshotOnCI();
});

it.only('allows independent dragging of multiple annotations', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [xAnnotation],
      y: [
        {
          ...yThreshold,
          showValue: false,
          color: 'red',
        },
        {
          ...yAnnotation,
          color: 'blue',
        },
        {
          ...yThreshold,
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
});
