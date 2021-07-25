/* eslint-disable cypress/no-unnecessary-waiting */
// import { SECOND_IN_MS } from '../../../../src/utils/time';
// import { Y_VALUE } from '../../../../src/testing/test-routes/charts/constants';
import { DataType } from '../../../../src/constants';
import { visitDynamicWidget } from '../../../../src/testing/selectors';
// import { DataStreamInfo } from '../../../../src/utils/dataTypes';
// import { DataType } from '../../../../src/constants';
// import { SearchQueryParams } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { NUMBER_STREAM_1 } from '../../../../src/testing/__mocks__/mockWidgetProperties';
import { DataPoint, DataStream } from '../../../../src/utils/dataTypes';
import { MINUTE_IN_MS } from '../../../../src/utils/time';

// const SMALL_WAIT = 0.1 * SECOND_IN_MS;

// const root = '/tests/sc-webgl-heatmap';

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
  it('renders single bucket with lightest opacity', () => {
    visitDynamicWidget(cy, {
      componentTag: 'sc-heatmap',
      viewportStart: new Date(START.getTime() - 1.5 * MINUTE_IN_MS),
      viewportEnd: END,
      dataStreams: [NUMBER_STREAM_1],
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

  it('renders 5 buckets from 2 datastreams', () => {
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

const getData = (yMax: number, numOfData: number): DataPoint<number>[] | undefined => {
  const data: DataPoint<number>[] = [];
  for (let i = 0; i < numOfData; i += 1) {
    data[i] = {
      x: new Date(2000, 0, 0, 0, 0, (i / numOfData) * 60).getTime(),
      y: Math.random() * yMax,
    };
  }
  return data;
};

const createRandomDataStream = (
  yMax: number,
  numOfDataStreams: number,
  numOfData: number
): DataStream[] | undefined => {
  const dataStreams: DataStream[] = [];
  for (let i = 0; i < numOfDataStreams; i += 1) {
    let data = getData(yMax, numOfData);
    if (data === undefined) {
      data = [];
    }
    dataStreams[i] = {
      id: `number-${i}-id`,
      color: 'black',
      name: `number-${i}-name`,
      dataType: DataType.NUMBER,
      resolution: 0,
      data,
    };
  }
  return dataStreams;
};

it.skip('demo', () => {
  const dataStreams = createRandomDataStream(100, 6, 40);
  visitDynamicWidget(cy, {
    componentTag: 'sc-heatmap',
    viewportStart: START,
    viewportEnd: END,
    dataStreams,
  });

  cy.waitForChart();

  cy.matchImageSnapshotOnCI();
});
