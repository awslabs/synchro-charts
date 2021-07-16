import { visitDynamicWidget } from '../../../../src/testing/selectors';
import { SearchQueryParams } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { Threshold, XAnnotation, YAnnotation } from '../../../../src/components/charts/common/types';
import { COMPARISON_OPERATOR, DataType } from '../../../../src/constants';
import { DRAGGABLE_HANDLE_SELECTOR } from '../../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';
import { DataPoint } from '../../../../src/utils/dataTypes';

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

const viewportStart = X_MIN;
const viewportEnd = X_MAX;

const yThreshold: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  value: 2200,
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
  value: new Date(X_MIN.getTime() + (1 / 4) * (X_MAX.getTime() - X_MIN.getTime())),
  label: {
    text: 'here is a x label',
    show: true,
  },
  showValue: true,
  color: 'purple',
};

const timelineParams: Partial<SearchQueryParams> = {
  componentTag: 'sc-scatter-chart',
  viewportStart,
  viewportEnd,
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
  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 0);
  cy.matchImageSnapshotOnCI();
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
          ...yAnnotation,
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
});
