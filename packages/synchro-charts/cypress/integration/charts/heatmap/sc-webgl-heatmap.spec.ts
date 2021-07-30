/* eslint-disable cypress/no-unnecessary-waiting */
import { DataType } from '../../../../src/constants';
import { SCREEN_SIZE } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import {
  CHART_TOOLTIP_SELECTOR,
  CHART_VIZ_CONTAINER_SELECTOR,
  visitDynamicWidget,
} from '../../../../src/testing/selectors';
import { DataStream } from '../../../../src/utils/dataTypes';
import { MINUTE_IN_MS, SECOND_IN_MS } from '../../../../src/utils/time';

const VIEWPORT_HEIGHT = 600;
const VIEWPORT_WIDTH = 500;

const START = new Date(2000, 0, 0, 0, 0);
const END = new Date(2000, 0, 0, 0, 1);

const DATA_STREAM_1: DataStream = {
  id: 'number-1-id',
  color: 'black',
  name: 'number-1-name',
  dataType: DataType.NUMBER,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0, 45).getTime(),
      y: 100,
    },
    {
      x: new Date(2000, 0, 0, 0, 0, 46).getTime(),
      y: 40,
    },
    {
      x: new Date(2000, 0, 0, 0, 0, 50).getTime(),
      y: 40,
    },
  ],
};

const DATA_STREAM_2: DataStream = {
  id: 'number-2-id',
  color: 'black',
  name: 'number-2-name',
  dataType: DataType.NUMBER,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0, 45).getTime(),
      y: 100,
    },
    {
      x: new Date(2000, 0, 0, 0, 0, 50).getTime(),
      y: 50,
    },
  ],
};

beforeEach(() => {
  cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
});

describe('heatmap', () => {
  it('renders 2 buckets with lightest opacity', () => {
    visitDynamicWidget(cy, {
      componentTag: 'sc-heatmap',
      viewportStart: new Date(START.getTime() - 1.5 * MINUTE_IN_MS),
      viewportEnd: END,
      dataStreams: [DATA_STREAM_1],
    });

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders 3 buckets with darkest opacity from 1 datastream', () => {
    visitDynamicWidget(cy, {
      componentTag: 'sc-heatmap',
      viewportStart: START,
      viewportEnd: END,
      dataStreams: [DATA_STREAM_1],
    });

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders 4 buckets from 2 datastreams', () => {
    visitDynamicWidget(cy, {
      componentTag: 'sc-heatmap',
      viewportStart: START,
      viewportEnd: END,
      dataStreams: [DATA_STREAM_1, DATA_STREAM_2],
    });

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders 1 negative bucket', () => {
    visitDynamicWidget(cy, {
      componentTag: 'sc-heatmap',
      viewportStart: START,
      viewportEnd: END,
      dataStreams: [
        {
          ...DATA_STREAM_1,
          data: [
            {
              x: new Date(2000, 0, 0, 0, 0, 45).getTime(),
              y: -40,
            },
          ],
        },
      ],
    });

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });
});

describe('heatmap tooltip', () => {
  const NUMERICAL_STREAM_INFO: DataStreamInfo = {
    id: 'tooltip stream',
    unit: 'mph',
    dataType: DataType.NUMBER,
    name: 'tooltip-stream-name',
    resolution: 0,
  };

  const NUMERICAL_STREAM: DataStream<number> = {
    ...NUMERICAL_STREAM_INFO,
    data: [
      {
        x: new Date(2000, 0, 0).getTime(),
        y: 10,
      },
    ],
  };

  const DATE_OF_POINT = NUMERICAL_STREAM.data[0].x;

  it('should show tooltip with minutes and seconds', () => {
    // View port which contains the point
    const viewportStart = new Date(DATE_OF_POINT - SECOND_IN_MS);
    const viewportEnd = new Date(DATE_OF_POINT + SECOND_IN_MS);
    visitDynamicWidget(cy, {
      componentTag: 'sc-heatmap',
      dataStreams: [NUMERICAL_STREAM],
      viewportStart,
      viewportEnd,
    });

    cy.waitForChart();

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
      offsetX: SCREEN_SIZE.width / 2,
      offsetY: SCREEN_SIZE.height / 4,
    });

    cy.get(CHART_TOOLTIP_SELECTOR).should('be.visible');
  });

  it('should show tooltip with hours, minutes, seconds', () => {
    // View port which contains the point
    const viewportStart = new Date(DATE_OF_POINT - MINUTE_IN_MS);
    const viewportEnd = new Date(DATE_OF_POINT + MINUTE_IN_MS);
    visitDynamicWidget(cy, {
      componentTag: 'sc-heatmap',
      dataStreams: [NUMERICAL_STREAM],
      viewportStart,
      viewportEnd,
    });

    cy.waitForChart();

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
      offsetX: SCREEN_SIZE.width / 2,
      offsetY: SCREEN_SIZE.height / 4,
    });

    cy.get(CHART_TOOLTIP_SELECTOR).should('be.visible');
  });
});
