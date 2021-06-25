import { newSpecPage } from '@stencil/core/testing';
import { CustomHTMLElement } from '../../../utils/types';
import { Components } from '../../../components.d';
import { update } from '../common/tests/merge';
import { MonitorTooltipRow } from './monitor-tooltip-row';
import { Threshold } from '../common/types';
import { TrendResult } from '../common/trends/types';
import { DataPoint, DataStream, DataStreamInfo } from '../../../utils/dataTypes';
import { MonitorTooltipRows } from './monitor-tooltip-rows';
import { DEFAULT_CHART_CONFIG } from '../sc-webgl-base-chart/chartDefaults';

import { DEFAULT_TOOLTIP_VALUE_COLOR } from './constants';
import { POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import { MINUTE_IN_MS } from '../../../utils/time';
import {
  ALARM_STREAM,
  ALARM_THRESHOLD,
  BEFORE_VIEWPORT_DATE,
  DATA_WITH_ALARM_ASSOCIATION,
  NUMBER_EMPTY_STREAM,
  WITHIN_VIEWPORT_DATE,
} from '../../../testing/__mocks__/mockWidgetProperties';
import { VIEW_PORT } from '../common/testUtil';
import { DataType, StreamType, TREND_TYPE } from '../../../utils/dataConstants';

import { COMPARISON_OPERATOR, DATA_ALIGNMENT, StatusIcon } from '../common/constants';

const TOOLTIP_LINE_SELECTOR = '.tooltip-line';

const STRING_STREAM_INFO: DataStreamInfo = {
  color: 'brown',
  resolution: 0,
  name: 'string-stream-name',
  id: 'string-data-stream-id',
  dataType: DataType.STRING,
};

const DEFAULT_POINT: DataPoint<number> = {
  x: WITHIN_VIEWPORT_DATE.getTime(),
  y: 100,
};

const DEFAULT_STRING_POINT: DataPoint<string> = {
  x: WITHIN_VIEWPORT_DATE.getTime(),
  y: 'some-string',
};

const DATA_STREAM: DataStream<number> = {
  color: 'black',
  name: 'data-stream-name',
  id: 'data-stream-id',
  dataType: DataType.NUMBER,
  data: [],
  aggregates: { [MINUTE_IN_MS]: [DEFAULT_POINT] },
  resolution: MINUTE_IN_MS,
};

const DATA_STREAM_2: DataStream<number> = {
  color: 'red',
  name: 'data-stream-name-2',
  id: 'data-stream-id-2',
  dataType: DataType.NUMBER,
  data: [],
  aggregates: { [MINUTE_IN_MS]: [DEFAULT_POINT] },
  resolution: MINUTE_IN_MS,
};

const STRING_STREAM: DataStream<string> = {
  color: 'brown',
  name: 'string-stream-name',
  id: 'string-data-stream-id',
  dataType: DataType.STRING,
  aggregates: { [MINUTE_IN_MS]: [DEFAULT_STRING_POINT] },
  data: [],
  resolution: MINUTE_IN_MS,
};

const TREND: TrendResult = {
  dataStreamId: DATA_STREAM.id,
  color: 'green',
  type: TREND_TYPE.LINEAR,
  equation: { gradient: 0, intercept: 0 },
  startDate: VIEW_PORT.start,
};

const newTooltipRowsSpecPage = async (propOverrides: Partial<Components.MonitorTooltipRows> = {}) => {
  const page = await newSpecPage({
    components: [MonitorTooltipRow, MonitorTooltipRows],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const tooltipRows = page.doc.createElement('monitor-tooltip-rows') as CustomHTMLElement<
    Components.MonitorTooltipRows
  >;
  const props: Components.MonitorTooltipRows = {
    dataAlignment: DATA_ALIGNMENT.EITHER,
    dataStreams: [],
    selectedDate: VIEW_PORT.end,
    showDataStreamColor: true,
    size: DEFAULT_CHART_CONFIG.size,
    thresholds: [],
    trendResults: [],
    viewPort: VIEW_PORT,
    supportString: true,
    showBlankTooltipRows: false,
    visualizesAlarms: false,
    ...propOverrides,
  };

  update(tooltipRows, props);
  page.body.appendChild(tooltipRows);
  await page.waitForChanges();

  return { page, tooltipRows };
};

it('renders no tool tip rows when given no data', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({});

  const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
  expect(rows).toBeEmpty();
  expect(tooltipRows.querySelector(TOOLTIP_LINE_SELECTOR)).toBeNull();
});

it('renders one tooltip row with the streams point passed in', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({
    dataStreams: [DATA_STREAM],
  });

  const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
  expect(toolTipRow).toBeDefined();
  expect(toolTipRow.point).toBe(DEFAULT_POINT);
  expect(toolTipRow.pointType).toBe(POINT_TYPE.DATA);
  expect(toolTipRow.label).toBe(DATA_STREAM.name);

  expect(tooltipRows.querySelector(TOOLTIP_LINE_SELECTOR)).not.toBeNull();
});

describe('showsBlankTooltipRows is true', () => {
  it('renders one tooltip row with no point passed in when no data present in the data stream', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, aggregates: {}, data: [] }],
      showBlankTooltipRows: true,
    });

    const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
    expect(toolTipRow).not.toBeNull();
    expect(toolTipRow.point).toBeUndefined();
    expect(toolTipRow.label).toBe(DATA_STREAM.name);
  });

  it('renders one tooltip row with no point passed in when no data present in the data stream', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, aggregates: {}, data: [] }],
      sortPoints: true,
      showBlankTooltipRows: true,
    });

    const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
    expect(toolTipRow).not.toBeNull();
    expect(toolTipRow.point).toBeUndefined();
    expect(toolTipRow.label).toBe(DATA_STREAM.name);
  });
});

describe('showsBlankTooltipRows is false', () => {
  it('renders no tooltip rows when no data present', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, resolution: 0, data: [] }],
      showBlankTooltipRows: false,
    });

    expect(tooltipRows.querySelectorAll('monitor-tooltip-row').length).toBe(0);
  });

  it('renders no tooltip rows when no data present in data stream and is sorting with non raw data', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, resolution: MINUTE_IN_MS, aggregates: {} }],
      sortPoints: true,
      showBlankTooltipRows: false,
    });

    expect(tooltipRows.querySelectorAll('monitor-tooltip-row').length).toBe(0);
  });
});

it('renders no tooltip rows when no data stream provided', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({
    dataStreams: [],
  });

  expect(tooltipRows.querySelectorAll('monitor-tooltip-row')).toBeEmpty();
});

describe('visualizesAlarms', () => {
  const NUMERICAL_ALARM_STREAM: DataStream<number> = {
    id: 'alarm-id',
    color: 'red',
    dataType: DataType.NUMBER,
    name: 'alarm-name',
    streamType: StreamType.ALARM,
    data: [
      {
        x: new Date(2000, 0, 0).getTime(),
        y: 100,
      },
    ],
    resolution: 0,
  };

  it('does not render tooltip rows for alarms if `visualizesAlarms` is false', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [NUMERICAL_ALARM_STREAM],
      visualizesAlarms: false,
    });
    expect(tooltipRows.querySelectorAll('monitor-tooltip-row')).toBeEmpty();
  });

  it('does render tooltip rows for alarms if `visualizesAlarms` is true', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [NUMERICAL_ALARM_STREAM],
      visualizesAlarms: true,
    });

    expect(tooltipRows.querySelectorAll('monitor-tooltip-row')).not.toBeEmpty();

    const row = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
    expect(row.point).toEqual(NUMERICAL_ALARM_STREAM.data[0]);
    expect(row.label).toEqual(NUMERICAL_ALARM_STREAM.name);
    expect(row.valueColor).toEqual(DEFAULT_TOOLTIP_VALUE_COLOR);
  });
});

describe('supportsString', () => {
  describe('does support strings', () => {
    it('renders string row', async () => {
      const { tooltipRows } = await newTooltipRowsSpecPage({
        dataStreams: [STRING_STREAM],
        supportString: true,
      });

      const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
      expect(rows).toHaveLength(1);

      const row = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
      expect(row.label).toBe(STRING_STREAM_INFO.name);
      expect(row.point).toBe(DEFAULT_STRING_POINT);
    });

    it('renders all data types', async () => {
      const { tooltipRows } = await newTooltipRowsSpecPage({
        dataStreams: [STRING_STREAM, DATA_STREAM],
        supportString: true,
      });

      const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
      expect(rows).toHaveLength(2);
    });
  });

  describe('does not support strings', () => {
    it('does not render string', async () => {
      const { tooltipRows } = await newTooltipRowsSpecPage({
        dataStreams: [STRING_STREAM],
        supportString: false,
      });

      const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
      expect(rows).toBeEmpty();
    });

    it('renders number based row when provided number and string data', async () => {
      const { tooltipRows } = await newTooltipRowsSpecPage({
        dataStreams: [STRING_STREAM, DATA_STREAM],
        supportString: false,
      });

      const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
      expect(rows).toHaveLength(1);

      const row = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
      expect(row.label).toBe(DATA_STREAM.name);
      expect(row.point).toBe(DEFAULT_POINT);
    });
  });
});

it('passes down showStreamColor to tooltip-row', async () => {
  const SHOW_STREAM_COLOR = true;
  const { tooltipRows } = await newTooltipRowsSpecPage({
    dataStreams: [DATA_STREAM],
    showDataStreamColor: SHOW_STREAM_COLOR,
  });

  const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
  expect(toolTipRow.showDataStreamColor).toBe(SHOW_STREAM_COLOR);
});

it('renders one trend result', async () => {
  const { tooltipRows } = await newTooltipRowsSpecPage({
    dataStreams: [DATA_STREAM],
    trendResults: [TREND],
  });

  const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');

  expect(rows).toHaveLength(2);

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

  const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
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
      thresholds: [],
    });

    const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
    expect(toolTipRow.valueColor).toBe(DEFAULT_TOOLTIP_VALUE_COLOR);
  });

  it('renders tooltip with valueColor, icon set to the thresholds color and icon when the threshold is breached', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [
        { ...DATA_STREAM, resolution: 0, data: [{ x: WITHIN_VIEWPORT_DATE.getTime(), y: BREACHING_VALUE }] },
      ],
      thresholds: [THRESHOLD],
    });

    const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
    expect(toolTipRow.valueColor).toBe(THRESHOLD.color);
    expect(toolTipRow.icon).toBe(THRESHOLD.icon);
  });

  it('does not render tooltip row with value color, icon when threshold would breach value, but does not apply to the strea', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, data: [{ x: WITHIN_VIEWPORT_DATE.getTime(), y: BREACHING_VALUE }] }],
      thresholds: [{ ...THRESHOLD, dataStreamIds: ['some-fake-data-stream-id'] }],
    });

    const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
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
      thresholds: [THRESHOLD],
    });

    const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
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
      thresholds: [THRESHOLD],
    });

    const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
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
      thresholds: [THRESHOLD],
    });

    const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
    expect(rows).toHaveLength(1);

    const row = rows[0];
    expect(row.point).toEqual(POINT);
    expect(row.valueColor).toBe(THRESHOLD.color);
    expect(row.icon).toBe(THRESHOLD.icon);
  });

  it('does not render tooltip with valueColor set to the thresholds color when the threshold is not breached', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_STREAM, data: [{ x: WITHIN_VIEWPORT_DATE.getTime(), y: NON_BREACHING_VALUE }] }],
      thresholds: [THRESHOLD],
    });

    const toolTipRow = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;
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
        thresholds: upperLowerThresholds,
      });
      const row = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;

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
        thresholds: upperLowerThresholds,
      });
      const row = tooltipRows.querySelector('monitor-tooltip-row') as HTMLMonitorTooltipRowElement;

      expect(row.valueColor).toBe(LOWER_THRESHOLD.color);
    });
  });
});

describe('order of rows', () => {
  it('renders tooltips with no associated points first when sorted', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [NUMBER_EMPTY_STREAM, DATA_STREAM_2, DATA_STREAM],
      showBlankTooltipRows: true,
      sortPoints: true,
    });
    const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
    expect(rows.length).toBe(3);

    // undefined point re-positioned to the start of the tooltip
    expect(rows[0].point).toBeUndefined();
    expect(rows[0].label).toBe(NUMBER_EMPTY_STREAM.name);

    // defined points after
    expect(rows[1].point).toBeDefined();
    expect(rows[2].point).toBeDefined();
  });

  it('maintains order of rows that have no point when sorted', async () => {
    const NUMBER_EMPTY_STREAM_2: DataStream<number> = {
      id: 'empty-stream-2',
      name: 'empty-2-name',
      dataType: DataType.NUMBER,
      resolution: 0,
      data: [],
    };

    const dataStreams = [NUMBER_EMPTY_STREAM, DATA_STREAM, NUMBER_EMPTY_STREAM_2, DATA_STREAM_2];

    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams,
      showBlankTooltipRows: true,
      sortPoints: true,
    });

    const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
    expect(rows.length).toBe(dataStreams.length);

    expect(rows[0].label).toBe(NUMBER_EMPTY_STREAM.name);
    expect(rows[0].point).toBeUndefined();

    expect(rows[1].label).toBe(NUMBER_EMPTY_STREAM_2.name);
    expect(rows[1].point).toBeUndefined();

    expect(rows[2].label).toBe(DATA_STREAM.name);
    expect(rows[2].point).toBeDefined();

    expect(rows[3].label).toBe(DATA_STREAM_2.name);
    expect(rows[3].point).toBeDefined();
  });

  it('when not sorted, displays rows in order of the infos', async () => {
    const dataStreams = [DATA_STREAM, DATA_STREAM_2];
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams,
      sortPoints: false,
    });
    const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
    expect(rows).toHaveLength(dataStreams.length);

    // First row is the first data
    const r1 = rows[0];
    expect(r1.label).toBe(DATA_STREAM.name);

    const r2 = rows[1];
    expect(r2.label).toBe(DATA_STREAM_2.name);
  });

  it('renders tooltips in order when `sortedPoints` is false, when there are empty data streams present', async () => {
    const dataStreams = [NUMBER_EMPTY_STREAM, DATA_STREAM, DATA_STREAM_2];

    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams,
      showBlankTooltipRows: true,
      sortPoints: false,
    });
    const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
    expect(rows.length).toBe(dataStreams.length);

    expect(rows[0].label).toBe(dataStreams[0].name);
    expect(rows[0].point).toBeUndefined();

    expect(rows[1].label).toBe(dataStreams[1].name);
    expect(rows[1].point).toBe(DEFAULT_POINT);

    expect(rows[2].label).toBe(dataStreams[2].name);
    expect(rows[2].point).toBe(DEFAULT_POINT);
  });

  it('when sorted, displays rows in order of the magnitude of their points value', async () => {
    const SMALLER_POINT = { ...DEFAULT_POINT, y: 0 };
    const LARGER_POINT = { ...DEFAULT_POINT, y: 100 };
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [
        { ...DATA_STREAM, resolution: 0, data: [SMALLER_POINT] },
        { ...DATA_STREAM_2, resolution: 0, data: [LARGER_POINT] },
      ],
      sortPoints: true,
    });

    const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');
    expect(rows).toHaveLength(2);

    const r1 = rows[0];
    // First row is the second data stream, since it has the largest point associated with it
    expect(r1.label).toBe(DATA_STREAM_2.name);

    const r2 = rows[1];
    expect(r2.label).toBe(DATA_STREAM.name);
  });
});

describe('does not utilize alarms', () => {
  /**
   * Construct mock alarms streams and related resources
   */
  it('with an alarm data stream that is breached, does not display the color of the breached threshold', async () => {
    const { tooltipRows } = await newTooltipRowsSpecPage({
      dataStreams: [{ ...DATA_WITH_ALARM_ASSOCIATION, data: [DEFAULT_POINT] }, ALARM_STREAM],
      visualizesAlarms: true,
      thresholds: [ALARM_THRESHOLD],
    });
    const rows = tooltipRows.querySelectorAll('monitor-tooltip-row');

    /** Alarm Row */
    const alarmRow = rows[0];
    // Ensure this is the alarm row
    expect(alarmRow.label).toBe(ALARM_STREAM.name);
    // The associated alarm is breached
    expect(alarmRow.valueColor).toBe(ALARM_THRESHOLD.color);

    /** Data Row */
    const dataRow = rows[1];
    // Ensure this is the data row
    expect(dataRow.label).toBe(DATA_WITH_ALARM_ASSOCIATION.name);
    // The associated data stream to the alarm does not reflect the alarms breached status
    expect(dataRow.valueColor).not.toBe(ALARM_THRESHOLD.color);
  });
});
