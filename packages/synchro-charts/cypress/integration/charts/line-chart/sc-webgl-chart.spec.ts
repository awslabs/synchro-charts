/* eslint-disable cypress/no-unnecessary-waiting */

import { SECOND_IN_MS } from '../../../../src/utils/time';
import { Y_VALUE } from '../../../../src/testing/test-routes/charts/constants';

import {
  LINE_SELECTOR as X_LINE_SELECTOR,
  TEXT_SELECTOR as X_TEXT_SELECTOR,
} from '../../../../src/components/charts/common/annotations/XAnnotations/XAnnotations';

import {
  TEXT_SELECTOR as Y_TEXT_SELECTOR,
  TEXT_VALUE_SELECTOR as Y_TEXT_VALUE_SELECTOR,
  LINE_SELECTOR as Y_LINE_SELECTOR,
} from '../../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';
import { clickAndDrag } from '../../../utils';
import { CHART_VIZ_CONTAINER_SELECTOR, visitDynamicWidget } from '../../../../src/testing/selectors';

const root = '/tests/sc-webgl-chart';

const VIEWPORT_HEIGHT = 500;
const VIEWPORT_WIDTH = 500;

// NOTE: skipping since it's failing depending on the machine running. needs to be revisited
it.skip('chart data properly syncs with browser scroll', () => {
  cy.visit(`${root}/standard`);
  cy.viewport(300, 300);

  cy.waitForChart();

  cy.scrollTo('bottomRight');
  // clipping off the margins since there's some variance on whether the scroll bars are rendered or not,
  // which causes flakiness
  cy.matchImageSnapshotOnCI({ capture: 'viewport', clip: { x: 0, y: 0, width: 275, height: 275 } });
});

describe('line chart', () => {
  beforeEach(() => {
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  });

  it('renders chart with a large viewport', () => {
    cy.visit(`${root}/sc-webgl-chart-large-viewport`);

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders line segments connecting two appended points', () => {
    cy.visit(`${root}/line-chart-dynamic-data`);

    cy.waitForChart();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.wait(0.5 * SECOND_IN_MS);
    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders no points or lines when data is added and then removed', () => {
    cy.visit(`${root}/line-chart-dynamic-data`);

    cy.waitForChart();

    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#remove-data-point').click();
    cy.get('#remove-data-point').click();
    cy.wait(0.5 * SECOND_IN_MS);

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders no data streams when streams are added and removed', () => {
    cy.visit(`${root}/line-chart-dynamic-data-streams`);

    cy.waitForChart();

    cy.get('#add-stream').click();
    cy.get('#add-stream').click();

    cy.get('#remove-stream').click();
    cy.get('#remove-stream').click();

    cy.wait(0.5 * SECOND_IN_MS);
    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('display annotation at bottom of viewport and left of viewport', () => {
    cy.visit(`${root}/annotations`);

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('always displays horizontal annotation within viewport', () => {
    cy.visit(`${root}/annotations/always-in-viewport`);

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('display no annotation when annotations.show is false', () => {
    cy.visit(`${root}/annotations/no-annotations`);

    cy.waitForChart();

    cy.get(Y_LINE_SELECTOR).should('not.exist');
    cy.get(Y_TEXT_SELECTOR).should('not.exist');
    cy.get(Y_TEXT_VALUE_SELECTOR).should('not.exist');
    cy.get(X_LINE_SELECTOR).should('not.exist');
    cy.get(X_TEXT_SELECTOR).should('not.exist');
  });

  it('renders data stream added dynamically', () => {
    cy.visit(`${root}/line-chart-dynamic-data-streams`);

    cy.waitForChart();

    cy.get('#add-stream').click();
    cy.wait(0.5 * SECOND_IN_MS);
    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders tooltip for the last point of the three points because it is the right biased point from the mouse position', () => {
    cy.visit(`${root}/line-chart-dynamic-data-streams`);

    cy.waitForChart();

    cy.get('#add-stream').click();
    cy.wait(0.5 * SECOND_IN_MS);

    // Trigger tooltip by moving the mouse to the correct location
    cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
      offsetX: VIEWPORT_WIDTH / 3 + 10,
      offsetY: VIEWPORT_HEIGHT / 2,
    });

    cy.get('.bar').should('be.visible');
    cy.get('.tooltip-container').contains(Y_VALUE);

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders one data stream after two is added and one removed', () => {
    cy.visit(`${root}/line-chart-dynamic-data-streams`);

    cy.waitForChart();

    cy.get('#add-stream').click();
    cy.get('#add-stream').click();
    cy.get('#remove-stream').click();

    cy.wait(0.5 * SECOND_IN_MS);
    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('renders single point', () => {
    cy.visit(`${root}/standard`);

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it.only('renders single point with a legend present', () => {
    cy.visit(`${root}/standard-with-legend`);
    const DATA_STREAM_NAME = 'test stream';
    const DATA_POINT_Y = '2500';

    cy.waitForChart();

    // Display latest value
    cy.contains(DATA_POINT_Y).should('exist');

    // Display name of data stream
    cy.get('[data-test-tag="expandable-input"]')
      .invoke('text')
      .should('equal', DATA_STREAM_NAME);

    cy.matchImageSnapshotOnCI();
  });

  it('renders single point with a legend present on the right hand side', () => {
    cy.visit(`${root}/standard-with-legend-on-right`);
    const DATA_STREAM_NAME = 'test stream';
    const DATA_POINT_Y = '2500';

    cy.waitForChart();

    // Display latest value
    cy.contains(DATA_POINT_Y).should('exist');

    // Display name of data stream
    cy.get('[data-test-tag="expandable-input"]')
      .invoke('text')
      .should('equal', DATA_STREAM_NAME);

    cy.matchImageSnapshotOnCI();
  });

  it('should hide the x and y axis if axis options passed in disabling both axis', () => {
    cy.visit(`${root}/axis`);

    cy.waitForChart();

    cy.matchImageSnapshotOnCI();
  });

  it('renders the y-axis label if passed in', () => {
    visitDynamicWidget(cy, {
      componentTag: 'sc-line-chart',
      axis: {
        labels: {
          yAxis: {
            content: 'my cool label',
          },
        },
      },
    });

    cy.waitForChart();

    cy.get('.y-axis-label').should('exist');
    cy.get('.y-axis-label').should('contain', 'my cool label');

    cy.matchImageSnapshotOnCI();
  });

  describe('handles buffer increasing in size after initialization', () => {
    beforeEach(() => {
      cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    });

    it('renders lines and points that are added and do not fit beyond the initial buffer size', () => {
      cy.visit(`${root}/line-chart-dynamic-buffer`);

      cy.waitForChart();

      cy.get('#add-data-point').click();
      cy.get('#add-data-point').click();
      cy.get('#add-data-point').click();
      cy.get('#add-data-point').click();

      cy.wait(0.5 * SECOND_IN_MS);

      // Should see 4 points, with 3 connecting line segments.
      cy.get('#chart-container').matchImageSnapshotOnCI();
    });

    it.skip('correctly registers gestures of the chart scene after the buffer has been dynamically resized', () => {
      // NOTE: since dynamically creating a buffer requires a re-creation of the chart scene,
      // we must re-register the gestures for the chart scene, which is why this test scenario is vital.
      cy.visit(`${root}/line-chart-dynamic-buffer`);

      cy.waitForChart();

      cy.get('#add-data-point').click();
      cy.get('#add-data-point').click();
      cy.get('#add-data-point').click();
      cy.get('#add-data-point').click();
      cy.wait(0.5 * SECOND_IN_MS);

      // Not working :-(
      clickAndDrag({
        xStart: 150,
        yStart: 150,
        xEnd: 300,
        yEnd: 150,
      });
      // Should see 4 points, with 3 connecting line segments, shifted to the right
      cy.get('#chart-container').matchImageSnapshotOnCI();
    });
  });
});

describe('view port updating', () => {
  const VIEWPORT_CHANGE_URL = '/tests/line-chart/viewport-change';
  const NARROW_VIEWPORT_X_AXIS_LABEL = '12 PM'; // A label which renders when viewing the 'narrow' view port
  const WIDE_VIEWPORT_X_AXIS_LABEL = 'July'; // A label which renders when viewing the 'wide' view port

  const TOGGLE_VIEWPORT_SELECTOR = '#toggle-view-port';

  /**
   * This ensures that when a new 'chart scene' is generated, it will still take the new viewport passed in the update.
   *
   * This is a consequence of the fact that when a view port significantly changes, we re-create some chart resources to
   * properly scale our mapping of the data visualizations, i.e. we generate a new clip space conversion.
   */

  describe('while part of a view port group', () => {
    it('takes new viewport on first view port update', () => {
      cy.visit(VIEWPORT_CHANGE_URL);

      /** Has initially loaded */
      cy.contains(NARROW_VIEWPORT_X_AXIS_LABEL).should('exist');
      cy.contains(WIDE_VIEWPORT_X_AXIS_LABEL).should('not.exist');

      /** Update viewport to wide viewport */
      cy.get(TOGGLE_VIEWPORT_SELECTOR).click();

      /** First view port update is registered */
      cy.contains(NARROW_VIEWPORT_X_AXIS_LABEL).should('not.exist');
      cy.contains(WIDE_VIEWPORT_X_AXIS_LABEL).should('exist');
    });

    it('takes new viewport on second view port update', () => {
      cy.visit(VIEWPORT_CHANGE_URL);

      /** Has initially loaded */
      cy.contains(NARROW_VIEWPORT_X_AXIS_LABEL).should('exist');

      /** Update viewport to wide viewport */
      cy.get(TOGGLE_VIEWPORT_SELECTOR).click();

      /** First view port update is registered */
      cy.contains(NARROW_VIEWPORT_X_AXIS_LABEL).should('not.exist');

      /** Revert to original, narrow view port. This also triggers the creation of a new chart scene. */
      cy.get(TOGGLE_VIEWPORT_SELECTOR).click();

      /** Second view port update is registered */
      cy.contains(NARROW_VIEWPORT_X_AXIS_LABEL).should('exist');
    });
  });
});
