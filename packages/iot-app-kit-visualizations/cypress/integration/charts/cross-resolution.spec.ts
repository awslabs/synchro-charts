import { SCREEN_SIZE } from '../../../src/testing/dynamicWidgetUtils/testCaseParameters';
import { DAY_IN_MS, SECOND_IN_MS } from '../../../src/utils/time';
import {
  CHART_TOOLTIP_ROW_SELECTOR,
  CHART_TOOLTIP_SELECTOR,
  CHART_VIZ_CONTAINER_SELECTOR,
  visitDynamicWidget,
} from '../../../src/testing/selectors';
import { DATA_STREAM, DATA_STREAM_2 } from '../../../src/testing/__mocks__/mockWidgetProperties';
import { AggregateType } from '../../../src/utils/dataTypes';

beforeEach(() => {
  cy.viewport(SCREEN_SIZE.width, SCREEN_SIZE.height);
});

const START = new Date(2000, 0, 0);
const END = new Date(2000, 1, 0);

const RAW_DATA_STREAM = {
  ...DATA_STREAM,
  resolution: 0,
  data: [
    {
      x: (START.getTime() + END.getTime()) / 2,
      y: 200,
    },
  ],
};

const AGGREGATED_DATA_STREAM = {
  ...DATA_STREAM_2,
  resolution: DAY_IN_MS,
  aggregationType: AggregateType.AVERAGE,
  aggregates: {
    [DAY_IN_MS]: [
      {
        x: (START.getTime() + END.getTime()) / 2,
        y: 100,
      },
    ],
  },
};

it('displays each aggregation description within tooltip', () => {
  visitDynamicWidget(cy, {
    componentTag: 'iot-app-kit-vis-line-chart',
    viewportStart: START,
    viewportEnd: END,
    dataStreams: [RAW_DATA_STREAM, AGGREGATED_DATA_STREAM],
  });
  cy.waitForChart();

  cy.get(CHART_VIZ_CONTAINER_SELECTOR).trigger('mousemove', {
    offsetX: 0,
    offsetY: SCREEN_SIZE.height / 2,
  });

  cy.wait(0.5 * SECOND_IN_MS);

  cy.get(CHART_TOOLTIP_SELECTOR).should('be.visible');
  cy.get(CHART_TOOLTIP_ROW_SELECTOR).should('have.length', 2);

  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(0)
    .contains(RAW_DATA_STREAM.name)
    .should('be.visible');

  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(0)
    .contains('raw data')
    .should('be.visible');

  // Tooltip row 2 - display the row that smaller y value
  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(1)
    .contains(AGGREGATED_DATA_STREAM.name)
    .should('be.visible');

  cy.get(CHART_TOOLTIP_ROW_SELECTOR)
    .eq(1)
    .contains('1 day average')
    .should('be.visible');
});
