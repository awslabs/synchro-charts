/* eslint-disable cypress/no-unnecessary-waiting */
import { DataType } from '../../../../src/constants';
import { visitDynamicWidget } from '../../../../src/testing/selectors';
import { DataStream } from '../../../../src/utils/dataTypes';
import { MINUTE_IN_MS } from '../../../../src/utils/time';

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
    {
      x: new Date(2000, 0, 0, 0, 0, 50).getTime(),
      y: 50,
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
  it('renders 2 buckets with different opacities', () => {
    visitDynamicWidget(cy, {
      componentTag: 'sc-heatmap',
      viewportStart: new Date(START.getTime() - 1.5 * MINUTE_IN_MS),
      viewportEnd: END,
      dataStreams: [DATA_STREAM_1],
    });

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders 4 buckets with darkest opacity from 1 datastream', () => {
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
