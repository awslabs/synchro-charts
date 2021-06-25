import { MINUTE_IN_MS, SECOND_IN_MS } from '../../../../src/utils/time';
import {
  CHART_VIZ_CONTAINER_SELECTOR,
  STATUS_TIMELINE_OVERLAY_ROW_SELECTOR,
  STATUS_TIMELINE_OVERLAY_SELECTOR,
  visitDynamicWidget,
} from '../../../../src/testing/selectors';
import { DataPoint, DataStreamInfo, DataStream } from '../../../../src/utils/dataTypes';
import { CHART_SIZE } from '../../../../src/testing/test-routes/charts/shaders/chartSize';
import { SearchQueryParams } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { DATA_STREAM } from '../../../../src/testing/__mocks__/mockWidgetProperties';
import { DataType } from '../../../../src/utils/dataConstants';

const createInfos = (num: number): DataStreamInfo[] =>
  new Array(num).fill(0).map((_: unknown, i) => ({
    id: `id-${i}`,
    resolution: 0,
    name: `asset ${i}`,
    dataType: DataType.NUMBER,
    color: 'red',
  }));

describe('status timeline', () => {
  const root = 'localhost:3333/tests/status-chart';

  const VIEWPORT_HEIGHT = 600;
  const VIEWPORT_WIDTH = 500;

  describe('alarm configuration', () => {
    const viewPortStart = new Date(2000, 0, 0);
    const viewPortEnd = new Date(2000, 0, 1);
    const timelineParams: Partial<SearchQueryParams> = {
      componentTag: 'sc-status-chart',
      viewPortStart,
      viewPortEnd,
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [{ x: viewPortStart.getTime(), y: 100 }],
        },
      ],
    };

    it('extends timeline point when no expiration provided', () => {
      visitDynamicWidget(cy, {
        ...timelineParams,
        alarms: { expires: undefined },
      });

      cy.waitForStatusTimeline();

      // Rectangle consume full area
      cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
    });
  });

  it('renders single status', () => {
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    cy.visit(`${root}/standard`);

    cy.waitForStatusTimeline();

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('displays unit on overlay row', () => {
    const INFO = {
      ...createInfos(1)[0],
      unit: 'mph',
    };
    visitDynamicWidget(cy, {
      componentTag: 'sc-status-chart',
      alarms: { expires: MINUTE_IN_MS },
      dataStreams: [
        {
          ...INFO,
          data: [{ x: new Date(1700, 0, 0).getTime(), y: 100 }],
        },
      ],
    });

    cy.contains(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR, INFO.unit)
      .should('be.visible')
      .get('.stream-info')
      .matchImageSnapshotOnCI();
  });

  describe('isEditing', () => {
    it('edits a info name while `isEditing` is true', () => {
      visitDynamicWidget(cy, {
        componentTag: 'sc-status-chart',
        alarms: { expires: MINUTE_IN_MS },
        isEditing: true,
        dataStreams: [DATA_STREAM],
        displayInfoNames: true,
      });

      const NEW_TEXT = ' some additional new text';

      cy.get(STATUS_TIMELINE_OVERLAY_SELECTOR)
        .contains(DATA_STREAM.name)
        .should('be.visible')
        .clear()
        .type(NEW_TEXT)
        .blur();

      cy.get(STATUS_TIMELINE_OVERLAY_SELECTOR)
        .contains(NEW_TEXT)
        .should('be.visible');

      cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
    });
  });

  it('renders every data stream info when full names cannot all fit', () => {
    const NUM_INFOS = 7; // Maximum that can fit within a chart the given size

    const POINT: DataPoint<number> = { x: new Date(1700, 0, 0).getTime(), y: 50 };
    const dataStreams: DataStream[] = createInfos(NUM_INFOS).map((info, i) => ({
      ...info,
      data: i === 0 ? [POINT] : [],
      name: `name-${i}-with-a really-really really-long-name-which-likes-to-overflow-containers really-long-name-which-likes-to-overflow-containers really-long-name-which-likes-to-overflow-containers`,
    }));

    visitDynamicWidget(cy, {
      componentTag: 'sc-status-chart',
      alarms: { expires: MINUTE_IN_MS },
      dataStreams,
    });

    // Should be displaying the latest value on the first row.
    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR).should('have.length', NUM_INFOS);
    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
      .eq(0)
      .contains(POINT.y)
      .should('be.visible');

    // Every info needs to be visible, with names clipped to allow for it.
    dataStreams.forEach((stream, i) => {
      cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
        .eq(i)
        .contains(stream.name)
        .should('be.visible');
    });

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders legend rows evenly spaced', () => {
    const dataStreamInfos = createInfos(3); // Maximum that can fit within a chart the given size

    visitDynamicWidget(cy, {
      componentTag: 'sc-status-chart',
      alarms: { expires: MINUTE_IN_MS },
      dataStreams: dataStreamInfos.map(info => ({ ...info, data: [] })),
    });

    dataStreamInfos.forEach((info, i) => {
      cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
        .eq(i)
        .contains(info.name)
        .should('be.visible');
    });

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders long names by clipping them with ellipses', () => {
    const dataStreamInfos = createInfos(3).map(({ name, ...res }, i) => ({
      ...res,
      name: `asset ${i} with a really really long name that does not fit, even if you have a really really large area to display the information. there's no way this could fit`,
    })); // Maximum that can fit within a chart the given size

    visitDynamicWidget(cy, {
      componentTag: 'sc-status-chart',
      alarms: { expires: MINUTE_IN_MS },
      dataStreams: dataStreamInfos.map(info => ({ ...info, data: [] })),
    });

    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR).should('have.length', dataStreamInfos.length);

    dataStreamInfos.forEach((info, i) => {
      cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
        .eq(i)
        .contains(info.name)
        .should('be.visible');
    });

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders raw data with correct spacing in-between data points', () => {
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    cy.visit(`${root}/raw-data`);

    cy.waitForStatusTimeline();

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders status margin when the time difference between the first data point and the second data point is the same as the resolution', () => {
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    cy.visit(`${root}/margin`);

    cy.waitForStatusTimeline();

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders multiple statuses from a single data stream with multiple points', () => {
    cy.viewport(VIEWPORT_WIDTH, 700);
    cy.visit(`${root}/status-chart-dynamic-data-streams`);

    cy.waitForStatusTimeline();

    cy.get('#add-stream').click();

    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR).should('have.length', 1);

    cy.get(STATUS_TIMELINE_OVERLAY_SELECTOR)
      .contains('stream-1-name')
      .should('be.visible');

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders correctly for multiple data streams', () => {
    cy.viewport(VIEWPORT_WIDTH, 700);
    cy.visit(`${root}/status-chart-dynamic-data-streams`);

    cy.waitForStatusTimeline();

    cy.get('#add-stream').click();
    cy.get('#add-stream').click();

    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR).should('have.length', 2);

    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
      .eq(0)
      .contains('stream-1-name')
      .should('be.visible');

    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
      .eq(1)
      .contains('stream-2-name')
      .should('be.visible');

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders two statuses when data is added twice', () => {
    cy.visit(`${root}/status-chart-dynamic-data`);

    cy.waitForStatusTimeline();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();

    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR).should('have.length', 1);

    cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
      .contains('test stream')
      .should('be.visible');

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders no points or status when data is added and then removed', () => {
    cy.visit(`${root}/status-chart-dynamic-data`);

    cy.waitForStatusTimeline();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#remove-data-point').click();

    cy.get('#remove-data-point').click();
    cy.wait(0.1 * SECOND_IN_MS);

    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });
});

describe('handles buffer increasing in size after initialization', () => {
  const root = 'localhost:3333/tests/status-chart';
  const VIEWPORT_HEIGHT = 600;
  const VIEWPORT_WIDTH = 500;

  beforeEach(() => {
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  });

  it('renders status that are added and do not fit beyond the initial buffer size', () => {
    cy.visit(`${root}/status-chart-dynamic-buffer`);

    cy.waitForStatusTimeline();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();

    cy.wait(0.1 * SECOND_IN_MS);

    // Should see 4 statuses.
    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });

  it('renders status when switch to a viewport way outside the points and back to the original viewport', () => {
    cy.visit(`${root}/status-chart-fast-viewport`);

    cy.waitForStatusTimeline();

    cy.get('#change-viewport').click();
    cy.get('#change-viewport').click();
    cy.get('#change-viewport').click();
    cy.get('#change-viewport').click();
    cy.wait(0.1 * SECOND_IN_MS);

    // Should see the status.
    cy.get(CHART_VIZ_CONTAINER_SELECTOR).matchImageSnapshotOnCI();
  });
});

describe('mesh', () => {
  const WAIT_MS = SECOND_IN_MS * 2;
  const root = 'localhost:3333';

  it('renders a single status', () => {
    cy.visit(`${root}/tests/sc-webgl-chart/single-status`);
    cy.viewport(CHART_SIZE.width, CHART_SIZE.height);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });

  it('renders multiple data streams as parallel status timelines', () => {
    cy.visit(`${root}/tests/sc-webgl-chart/multiple-statuses`);
    cy.viewport(200, 200);
    cy.wait(WAIT_MS);
    cy.get('#test-container').matchImageSnapshotOnCI();
  });
});
