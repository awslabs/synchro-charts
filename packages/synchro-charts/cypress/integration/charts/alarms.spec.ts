import { NO_VALUE_PRESENT } from '../../../src/components/common/terms';
import { DataStream, DataStreamInfo } from '../../../src/utils/dataTypes';
import { Threshold } from '../../../src/components/charts/common/types';
import { MINUTE_IN_MS, SECOND_IN_MS } from '../../../src/utils/time';
import {
  CHART_TOOLTIP_SELECTOR,
  CHART_VIZ_CONTAINER_SELECTOR,
  STATUS_TIMELINE_OVERLAY_ROW_SELECTOR,
  visitDynamicWidget,
} from '../../../src/testing/selectors';
import { ANNOTATIONS, DATA } from '../../../src/testing/dynamicWidgetUtils/constants';
import { SCREEN_SIZE } from '../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { DataType, StreamType } from '../../../src/utils/dataConstants';
import { COMPARISON_OPERATOR, StatusIcon } from '../../../src/constants';

const SMALL_WAIT = 0.05 * SECOND_IN_MS;

const LEGEND_VALUE_SELECTOR = '[data-testid=current-value]';
const STATUS_ICON_SELECTOR = 'sc-chart-icon';

const ALARM_COLOR = 'rgb(255, 0, 0)'; // also known as 'red'
const LATEST_VALUE = 120;

const LEGEND_NAME_SELECTOR = '[data-test-tag="expandable-input"]';

describe('when provided alarm data through a `dynamic-widget`', () => {
  const NUMERICAL_ALARM_INFO: DataStreamInfo = {
    id: 'alarm-id',
    color: 'red',
    unit: 'mph',
    dataType: DataType.NUMBER,
    name: 'alarm-name',
    streamType: StreamType.ALARM,
    resolution: 0,
  };

  const NUMERICAL_ALARM_STREAM: DataStream<number> = {
    ...NUMERICAL_ALARM_INFO,
    data: [
      {
        x: new Date(2000, 0, 0).getTime(),
        y: 100,
      },
    ],
  };

  const ALARM_THRESHOLD: Threshold = {
    color: 'red',
    icon: StatusIcon.ERROR,
    description: 'mph > 90',
    comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    value: 90,
    dataStreamIds: [NUMERICAL_ALARM_INFO.id],
  };

  const PROPERTY_INFO: DataStreamInfo = {
    id: 'property-id',
    color: 'blue',
    dataType: DataType.NUMBER,
    unit: 'mph',
    name: 'property-name',
    resolution: 0,
    associatedStreams: [{ id: NUMERICAL_ALARM_INFO.id, type: StreamType.ALARM }],
  };

  const PROPERTY_STREAM: DataStream<number> = {
    ...PROPERTY_INFO,
    data: [
      {
        x: new Date(2000, 0, 0).getTime(),
        y: 15,
      },
    ],
  };
  const DATE_OF_POINT = NUMERICAL_ALARM_STREAM.data[0].x;

  // View port which contains the point
  const viewportStart = new Date(DATE_OF_POINT - MINUTE_IN_MS);
  const viewportEnd = new Date(DATE_OF_POINT + 5 * MINUTE_IN_MS);

  describe('widgets determine whether to visualize alarm data or not', () => {
    describe('kpi', () => {
      it('visualizes that an associated alarm stream is in alarm', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-kpi',
          dataStreams: [NUMERICAL_ALARM_STREAM, PROPERTY_STREAM],
          annotations: { y: [ALARM_THRESHOLD] },
          duration: MINUTE_IN_MS,
          viewportStart,
          viewportEnd,
        });

        cy.get('sc-chart-icon').should('be.visible');
        cy.get('sc-chart-icon').should('have.length', 1);

        // Expect to see both cells to convey an alarmed status
        cy.matchImageSnapshotOnCI();
      });
    });

    describe('status-grid', () => {
      it('visualizes that an associated alarm stream is in alarm', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-status-grid',
          dataStreams: [NUMERICAL_ALARM_STREAM, PROPERTY_STREAM],
          annotations: { y: [ALARM_THRESHOLD] },
          duration: MINUTE_IN_MS,
          viewportStart,
          viewportEnd,
        });

        cy.get('sc-chart-icon').should('be.visible');
        cy.get('sc-chart-icon').should('have.length', 1);

        cy.get('sc-status-grid')
          .contains(ALARM_THRESHOLD.description as string)
          .should('be.visible');

        // Expect to see both cells to convey an alarmed status
        cy.matchImageSnapshotOnCI();
      });
    });

    describe('line-chart', () => {
      it('does not visualize numerical alarm data', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-line-chart',
          dataStreams: [NUMERICAL_ALARM_STREAM],
          viewportStart,
          viewportEnd,
        });

        cy.waitForChart();

        // Should have image with no data
        cy.matchImageSnapshotOnCI();
      });

      it('does not render alarms on tooltip', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-line-chart',
          dataStreams: [NUMERICAL_ALARM_STREAM],
          viewportStart,
          viewportEnd,
        });

        cy.waitForChart();

        cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
          offsetX: SCREEN_SIZE.width / 5,
          offsetY: SCREEN_SIZE.height / 2,
        });

        cy.wait(SMALL_WAIT)
          .get('[data-testid="tooltip-row-label"]')
          .should('not.exist');
      });
    });

    describe('scatter-chart', () => {
      it('does not visualize numerical alarm data', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-scatter-chart',
          dataStreams: [NUMERICAL_ALARM_STREAM],
          viewportStart,
          viewportEnd,
        });

        cy.waitForChart();

        // Should have image with no data
        cy.matchImageSnapshotOnCI();
      });

      it('does not render alarms on tooltip', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-scatter-chart',
          dataStreams: [NUMERICAL_ALARM_STREAM],
          viewportStart,
          viewportEnd,
        });

        cy.waitForChart();

        cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
          offsetX: SCREEN_SIZE.width / 5,
          offsetY: SCREEN_SIZE.height / 2,
        });

        cy.wait(SMALL_WAIT)
          .get('[data-testid="tooltip-row-label"]')
          .should('not.exist');
      });
    });

    describe('bar-chart', () => {
      it('does not visualize numerical alarm data', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-bar-chart',
          dataStreams: [NUMERICAL_ALARM_STREAM],
          viewportStart,
          viewportEnd,
        });

        cy.waitForChart();

        // Should have image with no data
        cy.matchImageSnapshotOnCI();
      });

      it('does not render alarms on tooltip', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-bar-chart',
          dataStreams: [NUMERICAL_ALARM_STREAM],
          viewportStart,
          viewportEnd,
        });

        cy.waitForChart();

        cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
          offsetX: SCREEN_SIZE.width / 5,
          offsetY: SCREEN_SIZE.height / 2,
        });

        cy.wait(SMALL_WAIT)
          .get('[data-testid="tooltip-row-label"]')
          .should('not.exist');
      });
    });

    describe('status-timeline', () => {
      it('does visualize numerical alarm data', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-status-timeline',
          alarms: { expires: MINUTE_IN_MS },
          dataStreams: [NUMERICAL_ALARM_STREAM],
          viewportStart,
          viewportEnd,
        });

        cy.contains(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR, NUMERICAL_ALARM_STREAM.data[0].y).should('be.visible');

        // Should have image with one data point visible
        cy.matchImageSnapshotOnCI();
      });

      it('does render alarms on tooltip', () => {
        visitDynamicWidget(cy, {
          componentTag: 'sc-status-timeline',
          dataStreams: [NUMERICAL_ALARM_STREAM],
          annotations: { y: [ALARM_THRESHOLD] },
          viewportStart,
          viewportEnd,
        });

        cy.waitForChart();

        cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
          offsetX: SCREEN_SIZE.width / 5,
          offsetY: SCREEN_SIZE.height / 2,
        });

        cy.get(CHART_TOOLTIP_SELECTOR).should('be.visible');
        cy.get('[data-testid="tooltip-row-label"]')
          .should('be.visible')
          .invoke('text')
          .should('equal', NUMERICAL_ALARM_INFO.name);
      });
    });
  });

  describe('widgets determine whether to display alarms within the legend or not', () => {
    it('does not display a legend entry for numerical alarm data when rendering a line-chart', () => {
      visitDynamicWidget(cy, {
        componentTag: 'sc-line-chart',
        dataStreams: [NUMERICAL_ALARM_STREAM, PROPERTY_STREAM],
        annotations: { y: [ALARM_THRESHOLD] },
      });

      cy.get(LEGEND_NAME_SELECTOR)
        .should('have.length', 1) // only the numerical property data renders, not the alarm.
        .invoke('text')
        .should('equal', PROPERTY_INFO.name);
    });

    it('does not display a legend entry for numerical alarm data when rendering a scatter-chart', () => {
      visitDynamicWidget(cy, {
        componentTag: 'sc-scatter-chart',
        dataStreams: [NUMERICAL_ALARM_STREAM, PROPERTY_STREAM],
        annotations: { y: [ALARM_THRESHOLD] },
      });

      cy.get(LEGEND_NAME_SELECTOR)
        .should('have.length', 1) // only the numerical property data renders, not the alarm.
        .invoke('text')
        .should('equal', PROPERTY_INFO.name);
    });

    it('does not display a legend entry for numerical alarm data when rendering a bar-chart', () => {
      visitDynamicWidget(cy, {
        componentTag: 'sc-bar-chart',
        dataStreams: [NUMERICAL_ALARM_STREAM, PROPERTY_STREAM],
        annotations: { y: [ALARM_THRESHOLD] },
      });

      cy.get(LEGEND_NAME_SELECTOR)
        .should('have.length', 1) // only the numerical property data renders, not the alarm.
        .invoke('text')
        .should('equal', PROPERTY_INFO.name);
    });

    it('does display a legend entry for numerical alarm data when rendering a status-timeline', () => {
      visitDynamicWidget(cy, {
        componentTag: 'sc-status-timeline',
        dataStreams: [NUMERICAL_ALARM_STREAM, PROPERTY_STREAM],
        annotations: { y: [ALARM_THRESHOLD] },
      });

      cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR).should('have.length', 2); // all infos are displayed

      // order reflects order of infos
      cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
        .eq(0)
        .contains(NUMERICAL_ALARM_INFO.name);

      cy.get(STATUS_TIMELINE_OVERLAY_ROW_SELECTOR)
        .eq(1)
        .contains(PROPERTY_INFO.name);
    });
  });

  it('shows the data property on the legend as in alarm, from the associated alarm data which is being breached', () => {
    visitDynamicWidget(cy, {
      componentTag: 'sc-line-chart',
      dataStreams: DATA,
      annotations: ANNOTATIONS,
    });

    cy.get(LEGEND_VALUE_SELECTOR)
      .should('be.visible')
      .contains(LATEST_VALUE)
      .then($el => {
        expect($el).to.have.css('color', ALARM_COLOR);
      });

    cy.get(STATUS_ICON_SELECTOR).should('be.visible');
  });

  it('shows the data property on the legend in alarm, when the most recent point is breaching a threshold', () => {
    // This viewport is offset such that a new data becomes the latest.
    visitDynamicWidget(cy, {
      componentTag: 'sc-line-chart',
      dataStreams: DATA,
      annotations: ANNOTATIONS,
      viewportStart: new Date(2000, 0, 0, 6),
      viewportEnd: new Date(2000, 0, 0, 12),
    });

    cy.get(LEGEND_VALUE_SELECTOR)
      .should('be.visible')
      .contains(15)
      .then($el => {
        expect($el).to.have.css('color', 'rgb(0, 128, 0)');
      });

    cy.get(STATUS_ICON_SELECTOR).should('be.visible');
  });

  it('shows the data property on the legend in alarm, when the most recent point is breaching a threshold, but is before the viewport', () => {
    // This viewport is offset such that none of the data presented is in view.
    visitDynamicWidget(cy, {
      componentTag: 'sc-line-chart',
      dataStreams: DATA,
      annotations: ANNOTATIONS,
      viewportStart: new Date(2000, 0, 3),
      viewportEnd: new Date(2000, 0, 4),
    });

    cy.get(LEGEND_VALUE_SELECTOR)
      .should('be.visible')
      .contains(LATEST_VALUE)
      .then($el => {
        expect($el).to.have.css('color', ALARM_COLOR);
      });

    cy.get(STATUS_ICON_SELECTOR).should('be.visible');
  });

  it('does not show any value or alarmed status when there is no values before the viewport', () => {
    // This viewport is offset such that all of the data is after the viewport
    visitDynamicWidget(cy, {
      componentTag: 'sc-line-chart',
      annotations: ANNOTATIONS,
      dataStreams: DATA,
      viewportStart: new Date(1990, 0, 0),
      viewportEnd: new Date(1991, 0, 0),
    });

    cy.get(LEGEND_VALUE_SELECTOR)
      .should('be.visible')
      .contains(NO_VALUE_PRESENT)
      .then($el => {
        expect($el).not.to.have.css('color', ALARM_COLOR);
      });

    cy.get(STATUS_ICON_SELECTOR).should('not.exist');
  });
});
