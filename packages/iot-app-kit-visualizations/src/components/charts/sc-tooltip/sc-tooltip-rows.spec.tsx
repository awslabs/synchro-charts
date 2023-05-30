import { newSpecPage } from '@stencil/core/testing';
import { CustomHTMLElement } from '../../../utils/types';
import { Components } from '../../../components';
import { update } from '../common/tests/merge';
import { ScTooltipRow } from './sc-tooltip-row';
import { Threshold } from '../common/types';
import { TrendResult } from '../common/trends/types';
import { AggregateType, DataPoint, DataStream } from '../../../utils/dataTypes';
import { ScTooltipRows } from './sc-tooltip-rows';
import { DEFAULT_CHART_CONFIG } from '../sc-webgl-base-chart/chartDefaults';

import { DEFAULT_TOOLTIP_VALUE_COLOR } from './constants';
import { POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import { MINUTE_IN_MS } from '../../../utils/time';
import { BEFORE_VIEWPORT_DATE, WITHIN_VIEWPORT_DATE } from '../../../testing/__mocks__/mockWidgetProperties';
import { VIEWPORT } from '../common/testUtil';
import { DataType, TREND_TYPE } from '../../../utils/dataConstants';

import { COMPARISON_OPERATOR, StatusIcon } from '../common/constants';
import { TooltipPoint } from './types';

const TOOLTIP_LINE_SELECTOR = '.tooltip-line';

const TOOLTIP_POSITION = { top: '5px', left: '5px', right: '5px', transform: 'initial', x: 5, y: 5 };

const DEFAULT_POINT: DataPoint<number> = {
  x: WITHIN_VIEWPORT_DATE.getTime(),
  y: 100,
};

const DATA_STREAM: DataStream<number> = {
  color: 'black',
  name: 'data-stream-name',
  id: 'data-stream-id',
  dataType: DataType.NUMBER,
  data: [DEFAULT_POINT],
  aggregationType: AggregateType.AVERAGE,
  resolution: MINUTE_IN_MS,
};

const TOOLTIP_POINT: TooltipPoint = {
  streamId: DATA_STREAM.id,
  type: POINT_TYPE.DATA,
  point: DEFAULT_POINT,
  color: DEFAULT_TOOLTIP_VALUE_COLOR,
};

const TREND: TrendResult = {
  dataStreamId: DATA_STREAM.id,
  color: 'green',
  type: TREND_TYPE.LINEAR,
  equation: { gradient: 0, intercept: 0 },
  startDate: VIEWPORT.start,
};

const TREND_TOOLTIP_POINT: TooltipPoint = {
  streamId: TREND.dataStreamId,
  type: POINT_TYPE.TREND,
  color: TREND.color,
  label: `${DATA_STREAM.name} (linear)`,
};

const newTooltipRowsSpecPage = async (propOverrides: Partial<Components.IotAppKitVisTooltipRows> = {}) => {
  const page = await newSpecPage({
    components: [ScTooltipRow, ScTooltipRows],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const tooltipRows = page.doc.createElement('iot-app-kit-vis-tooltip-rows') as CustomHTMLElement<
    Components.IotAppKitVisTooltipRows
  >;
  const props: Components.IotAppKitVisTooltipRows = {
    dataStreams: [],
    selectedDate: VIEWPORT.end,
    showDataStreamColor: true,
    size: DEFAULT_CHART_CONFIG.size,
    thresholds: [],
    trendResults: [],
    viewport: VIEWPORT,
    toolTipPositioning: TOOLTIP_POSITION,
    tooltipPoints: [],
    ...propOverrides,
  };

  update(tooltipRows, props);
  page.body.appendChild(tooltipRows);
  await page.waitForChanges();

  return { page, tooltipRows };
};

it('renders no tool tip rows when given no data', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({});

  const rows = tooltipRows.querySelectorAll('iot-app-kit-vis-tooltip-row');
  expect(rows).toBeEmpty();
  expect(tooltipRows.querySelector(TOOLTIP_LINE_SELECTOR)).toBeNull();
});

it('renders one tooltip row with the streams point passed in', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({
    dataStreams: [DATA_STREAM],
    tooltipPoints: [TOOLTIP_POINT],
  });

  const toolTipRow = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;
  expect(toolTipRow).toBeDefined();
  expect(toolTipRow.point).toBe(DEFAULT_POINT);
  expect(toolTipRow.pointType).toBe(POINT_TYPE.DATA);
  expect(toolTipRow.label).toBe(DATA_STREAM.name);

  expect(tooltipRows.querySelector(TOOLTIP_LINE_SELECTOR)).not.toBeNull();
});

it('renders no tooltip rows when no data stream provided', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({
    dataStreams: [],
  });

  expect(tooltipRows.querySelectorAll('iot-app-kit-vis-tooltip-row')).toBeEmpty();
});

it('passes down showStreamColor to tooltip-row', async () => {
  const SHOW_STREAM_COLOR = true;
  const { tooltipRows } = await newTooltipRowsSpecPage({
    dataStreams: [DATA_STREAM],
    tooltipPoints: [TOOLTIP_POINT],
    showDataStreamColor: SHOW_STREAM_COLOR,
  });

  const toolTipRow = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;
  expect(toolTipRow.showDataStreamColor).toBe(SHOW_STREAM_COLOR);
});

it.only('renders one trend result', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({
    dataStreams: [DATA_STREAM],
    tooltipPoints: [TOOLTIP_POINT, TREND_TOOLTIP_POINT],
    trendResults: [TREND],
  });

  const rows = tooltipRows.querySelectorAll('iot-app-kit-vis-tooltip-row');

  expect(rows.length).toBe(2);

  const row = rows[1];

  expect(row.pointType).toBe(POINT_TYPE.TREND);
  expect(row.valueColor).toBe(DEFAULT_TOOLTIP_VALUE_COLOR);
  expect(row.color).toBe(TREND.color);
  expect(row.label).toBe(`${DATA_STREAM.name} (linear)`);
});

it('renders no trend line row when trend does not associate with any streams', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({
    trendResults: [{ ...TREND, dataStreamId: 'some-random-id' }],
  });

  const rows = tooltipRows.querySelectorAll('iot-app-kit-vis-tooltip-row');
  expect(rows).toBeEmpty();
});

describe('threshold breaching logic', () => {
  const THRESHOLD_VALUE = 20;
  const THRESHOLD: Threshold = {
    color: 'purple',
    value: THRESHOLD_VALUE,
    comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
    icon: StatusIcon.NORMAL,
  };

  // since we have a 'less than' operation, it breaches if it is below the threshold value.
  const BREACHING_VALUE = THRESHOLD_VALUE - 1;
  const NON_BREACHING_VALUE = THRESHOLD_VALUE;

  it('renders tooltip row with no value color override when no thresholds are present', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [DATA_STREAM],
      tooltipPoints: [TOOLTIP_POINT],
      thresholds: [],
    });

    const toolTipRow = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;
    expect(toolTipRow.valueColor).toBe(DEFAULT_TOOLTIP_VALUE_COLOR);
  });

  it('renders tooltip with valueColor, icon set to the thresholds color and icon when the threshold is breached', async () => {
    const POINT = { x: WITHIN_VIEWPORT_DATE.getTime(), y: BREACHING_VALUE };
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, resolution: 0, data: [POINT] }],
      tooltipPoints: [{ ...TOOLTIP_POINT, point: POINT }],
      thresholds: [THRESHOLD],
    });

    const toolTipRow = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;
    expect(toolTipRow.valueColor).toBe(THRESHOLD.color);
    expect(toolTipRow.icon).toBe(THRESHOLD.icon);
  });

  it('does not render tooltip row with value color, icon when threshold would breach value, but does not apply to the strea', async () => {
    const POINT = { x: WITHIN_VIEWPORT_DATE.getTime(), y: BREACHING_VALUE };
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, data: [POINT] }],
      tooltipPoints: [{ ...TOOLTIP_POINT, point: POINT }],
      thresholds: [{ ...THRESHOLD, dataStreamIds: ['some-fake-data-stream-id'] }],
    });

    const toolTipRow = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;
    expect(toolTipRow.valueColor).not.toBe(THRESHOLD.color);
    expect(toolTipRow.icon).not.toBe(THRESHOLD.icon);
  });

  it('does not render threshold as valueColor when the threshold would be breached, but the breached point is after the viewport', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [
            { x: WITHIN_VIEWPORT_DATE.getTime(), y: NON_BREACHING_VALUE },
            { x: new Date(3000, 0, 0).getTime(), y: BREACHING_VALUE },
          ],
        },
      ],
      tooltipPoints: [TOOLTIP_POINT],
      thresholds: [THRESHOLD],
    });

    const toolTipRow = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;
    expect(toolTipRow.valueColor).not.toBe(THRESHOLD.color);
    expect(toolTipRow.icon).not.toBe(THRESHOLD.icon);
  });

  it('does render tooltip row breaching a threshold for a point before the viewport when showing aggregated data', async () => {
    const POINT = { x: BEFORE_VIEWPORT_DATE.getTime(), y: BREACHING_VALUE };
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          resolution: 0,
          data: [POINT],
        },
      ],
      tooltipPoints: [{ ...TOOLTIP_POINT, point: POINT }],
      thresholds: [THRESHOLD],
    });

    const rows = tooltipRows.querySelectorAll('iot-app-kit-vis-tooltip-row');
    expect(rows).toHaveLength(1);

    const row = rows[0];
    expect(row.point).toEqual(POINT);
    expect(row.valueColor).toBe(THRESHOLD.color);
    expect(row.icon).toBe(THRESHOLD.icon);
  });

  it('does render tooltip row breaching a threshold, for a point before the viewport when showing raw data', async () => {
    const POINT = { x: BEFORE_VIEWPORT_DATE.getTime(), y: BREACHING_VALUE };
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          resolution: 0,
          data: [POINT],
        },
      ],
      tooltipPoints: [{ ...TOOLTIP_POINT, point: POINT }],
      thresholds: [THRESHOLD],
    });

    const rows = tooltipRows.querySelectorAll('iot-app-kit-vis-tooltip-row');
    expect(rows).toHaveLength(1);

    const row = rows[0];
    expect(row.point).toEqual(POINT);
    expect(row.valueColor).toBe(THRESHOLD.color);
    expect(row.icon).toBe(THRESHOLD.icon);
  });

  it('does not render tooltip with valueColor set to the thresholds color when the threshold is not breached', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, data: [{ x: WITHIN_VIEWPORT_DATE.getTime(), y: NON_BREACHING_VALUE }] }],
      tooltipPoints: [TOOLTIP_POINT],
      thresholds: [THRESHOLD],
    });

    const toolTipRow = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;
    expect(toolTipRow.valueColor).not.toBe(THRESHOLD.color);
    expect(toolTipRow.icon).not.toBe(THRESHOLD.icon);
  });

  describe('threshold priority when multiple apply', () => {
    it('renders the upper threshold color when a positive point breaches two thresholds', async () => {
      const UPPER_THRESHOLD = {
        color: 'purple',
        value: 20,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      };

      const LOWER_THRESHOLD = {
        color: 'pink',
        value: 2,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      };

      const upperLowerThresholds: Threshold[] = [UPPER_THRESHOLD, LOWER_THRESHOLD];
      const ACTIVE_POINT = {
        x: WITHIN_VIEWPORT_DATE.getTime(),
        y: 15,
      };

      const { tooltipRows } = await newTooltipRowsSpecPage({
        dataStreams: [
          {
            ...DATA_STREAM,
            resolution: 0,
            data: [ACTIVE_POINT],
          },
        ],
        tooltipPoints: [{ ...TOOLTIP_POINT, point: ACTIVE_POINT, color: UPPER_THRESHOLD.color }],
        thresholds: upperLowerThresholds,
      });
      const row = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;

      expect(row.valueColor).toBe(UPPER_THRESHOLD.color);
    });

    it('renders the lower threshold color when a negative point breaches two thresholds', async () => {
      const LOWER_THRESHOLD = {
        color: 'purple',
        value: -20,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      };
      const UPPER_THRESHOLD = {
        color: 'pink',
        value: -2,
        comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
      };

      const upperLowerThresholds: Threshold[] = [LOWER_THRESHOLD, UPPER_THRESHOLD];
      const ACTIVE_POINT = {
        x: WITHIN_VIEWPORT_DATE.getTime(),
        y: -15,
      };

      const { tooltipRows } = await newTooltipRowsSpecPage({
        dataStreams: [
          {
            ...DATA_STREAM,
            resolution: 0,
            data: [ACTIVE_POINT],
          },
        ],
        tooltipPoints: [{ ...TOOLTIP_POINT, point: ACTIVE_POINT, color: LOWER_THRESHOLD.color }],
        thresholds: upperLowerThresholds,
      });
      const row = tooltipRows.querySelector('iot-app-kit-vis-tooltip-row') as HTMLIotAppKitVisTooltipRowElement;

      expect(row.valueColor).toBe(LOWER_THRESHOLD.color);
    });
  });
});
