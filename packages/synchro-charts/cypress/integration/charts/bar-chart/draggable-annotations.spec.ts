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
import { DRAGGABLE_HANDLE_SELECTOR } from '../../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';
import { moveHandle, moveHandleFilter, moveHandlWithPause } from '../utils-draggable.spec';

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

it('editable threshold is draggable and recolors data within viewport', () => {
  visitDynamicWidget(cy, {
    ...timelineParams,
    annotations: {
      x: [X_ANNOTATION],
      y: [Y_THRESHOLD],
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
      x: [X_ANNOTATION],
      y: [Y_THRESHOLD],
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
      x: [X_ANNOTATION],
      y: [Y_ANNOTATION],
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
  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 200);
  cy.matchImageSnapshotOnCI();
});

it('hidden value annotation is draggable', () => {
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
  moveHandle(DRAGGABLE_HANDLE_SELECTOR, 0, 200);
  cy.matchImageSnapshotOnCI();
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
});
