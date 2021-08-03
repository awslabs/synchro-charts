import { DataType } from '../../../../src/constants';
import { SCREEN_SIZE } from '../../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import {
  CHART_TOOLTIP_SELECTOR,
  CHART_VIZ_CONTAINER_SELECTOR,
  visitDynamicWidget,
} from '../../../../src/testing/selectors';
import { DataStream } from '../../../../src/utils/dataTypes';
import { MINUTE_IN_MS, SECOND_IN_MS } from '../../../../src/utils/time';

describe('heatmap tooltip', () => {
  const NUMERICAL_STREAM: DataStream<number> = {
    id: 'tooltip stream',
    unit: 'mph',
    dataType: DataType.NUMBER,
    name: 'tooltip-stream-name',
    resolution: 0,
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

    cy.get('[data-testid="tooltip-buckets"]')
      .eq(0)
      .should('be.visible');

    cy.get('[data-testid="tooltip-heat-value"]')
      .eq(0)
      .should('be.be.visible');
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

    cy.get('[data-testid="tooltip-buckets"]')
      .eq(0)
      .should('be.visible');

    cy.get('[data-testid="tooltip-heat-value"]')
      .eq(0)
      .should('be.be.visible');
  });
});
