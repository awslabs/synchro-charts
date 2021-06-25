import { newSpecPage } from '@stencil/core/testing';

import { MonitorLegend } from './monitor-legend';
import { Components } from '../../../components.d';
import { CustomHTMLElement } from '../../../utils/types';
import { update } from '../common/tests/merge';
import { TrendResult } from '../common/trends/types';
import { Threshold } from '../common/types';
import { DataStream } from '../../../utils/dataTypes';
import { COMPARISON_OPERATOR, LEGEND_POSITION, StatusIcon, TREND_TYPE } from '../../..';
import { MonitorLegendRow } from './monitor-legend-row/monitor-legend-row';
import { DEFAULT_LEGEND_TEXT_COLOR } from './constants';
import { POINT_TYPE } from '../monitor-webgl-base-chart/activePoints';
import { VIEW_PORT } from '../common/testUtil';
import { DAY_IN_MS } from '../../../utils/time';
import { NON_BREACHED_ALARM_INFO } from '../../../testing/__mocks__/mockWidgetProperties';
import { DataType, StreamType } from '../../../utils/dataConstants';

const noop = () => {};

const DATA_STREAM: DataStream<number> = {
  id: 'some-id',
  name: 'data stream',
  resolution: 0,
  dataType: DataType.NUMBER,
  data: [],
};

const THRESHOLD_VALUE = 20;
const THRESHOLD: Threshold = {
  color: 'purple',
  value: THRESHOLD_VALUE,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
};

// since we have a 'less than' operation, it breaches if it is below the threshold value.
const BREACHING_VALUE = THRESHOLD_VALUE - 1;
const NON_BREACHING_VALUE = THRESHOLD_VALUE;
/**
 * Construct mock alarms streams and related resources
 */

const ALARM = 'alarm';
const OK = 'ok';

const ALARM_THRESHOLD: Threshold<string> = {
  value: ALARM,
  color: 'orange',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  icon: StatusIcon.ACTIVE,
};

const WITHIN_VIEWPORT_DATE = new Date(2000, 0, 1).getTime();
const BEFORE_VIEWPORT_DATE = new Date(VIEW_PORT.start.getTime() - DAY_IN_MS).getTime();

const ALARM_STREAM: DataStream<string> = {
  id: 'alarm-stream',
  streamType: StreamType.ALARM,
  name: 'alarm stream',
  resolution: 0,
  dataType: DataType.STRING,
  data: [
    {
      x: WITHIN_VIEWPORT_DATE,
      y: ALARM,
    },
  ],
};

const STREAM_W_ASSOCIATED_ALARM: DataStream<number> = {
  id: 'property-stream',
  name: 'some property stream',
  resolution: 0,
  dataType: DataType.NUMBER,
  data: [],
  associatedStreams: [{ type: StreamType.ALARM, id: ALARM_STREAM.id }],
};

const NON_BREACHED_ALARM_STREAM: DataStream<string> = {
  id: NON_BREACHED_ALARM_INFO.id,
  name: 'non breached alarm name',
  dataType: NON_BREACHED_ALARM_INFO.dataType,
  resolution: 0,
  data: [
    {
      x: WITHIN_VIEWPORT_DATE,
      y: OK,
    },
  ],
};

const NUMBER_STREAM: DataStream<number> = {
  id: 'number-1',
  name: 'number-name',
  resolution: 0,
  data: [],
  color: 'red',
  dataType: DataType.NUMBER,
};

const STRING_STREAM_1: DataStream<string> = {
  id: 'string-1',
  name: 'name-1',
  data: [],
  resolution: 0,
  color: 'black',
  dataType: DataType.STRING,
};
const STRING_STREAM_2: DataStream<string> = {
  id: 'string-2',
  data: [],
  resolution: 0,
  name: 'name-2',
  color: 'black',
  dataType: DataType.STRING,
};

const newChartLegendSpecPage = async (props: Partial<Components.MonitorLegend>) => {
  const page = await newSpecPage({
    components: [MonitorLegend, MonitorLegendRow],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const legend = page.doc.createElement('monitor-legend') as CustomHTMLElement<Components.MonitorLegend>;

  const defaultProps: Components.MonitorLegend = {
    updateDataStreamName: noop,
    isLoading: false,
    isEditing: false,
    dataStreams: [],
    viewPort: {
      yMin: 0,
      yMax: 100,
      start: new Date(2000, 0),
      end: new Date(2001, 0),
    },
    thresholds: [],
    trendResults: [],
    supportString: false,
    showDataStreamColor: true,
    visualizesAlarms: false,
    config: {
      position: LEGEND_POSITION.BOTTOM,
      width: 105,
    },
  };
  update(legend, { ...defaultProps, ...props });

  page.body.appendChild(legend);

  await page.waitForChanges();

  return { page, legend };
};

it('creates empty legend if no data streams are passed in', async () => {
  const { legend } = await newChartLegendSpecPage({
    dataStreams: [],
  });
  expect(legend.querySelectorAll('monitor-legend-row')).toBeEmpty();
});

it('displays data point on legend when it falls before the viewport', async () => {
  const POINT = {
    x: BEFORE_VIEWPORT_DATE,
    y: 123,
  };
  const { legend } = await newChartLegendSpecPage({
    dataStreams: [
      {
        ...NUMBER_STREAM,
        data: [POINT],
      },
    ],
  });

  const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;
  expect(row).not.toBeNull();
  expect(row.point).toEqual(POINT);
});

describe('loading status', () => {
  const streams: DataStream<number>[] = [
    {
      id: 'data-stream-id',
      name: 'data-stream-name',
      color: 'black',
      dataType: DataType.NUMBER,
      resolution: 0,
      data: [],
    },
  ];

  it('legend row is loading when legend is loading', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: streams,
      isLoading: true,
    });

    expect(legend.querySelector('sc-loading-spinner')).not.toBeNull();
  });

  it('legend row is not loading when legend is not loading', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: streams,
      isLoading: false,
    });

    expect(legend.querySelector('sc-loading-spinner')).toBeNull();
  });
});

describe('indicates breaching of thresholds', () => {
  describe('utilizing alarms', () => {
    it('with an alarm data stream that is breached, display the color of the breached threshold', async () => {
      const { legend } = await newChartLegendSpecPage({
        dataStreams: [ALARM_STREAM, STREAM_W_ASSOCIATED_ALARM],
        thresholds: [ALARM_THRESHOLD],
      });

      expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(1);
      const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

      expect(row.valueColor).toBe(ALARM_THRESHOLD.color);
      expect(row.icon).toBe(ALARM_THRESHOLD.icon);
    });

    it('renders trend data stream the breached threshold color when associated stream is in alarm', async () => {
      const trendResult: TrendResult = {
        dataStreamId: STREAM_W_ASSOCIATED_ALARM.id,
        type: TREND_TYPE.LINEAR,
        equation: {
          gradient: 1e-9,
          intercept: 10,
        },
        startDate: new Date(2000, 0),
      };

      const { legend } = await newChartLegendSpecPage({
        dataStreams: [ALARM_STREAM, STREAM_W_ASSOCIATED_ALARM],
        thresholds: [ALARM_THRESHOLD],
        trendResults: [trendResult],
      });

      expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(2);
      const rows = legend.querySelectorAll('monitor-legend-row');
      const trendRow = rows[1];

      // has a trend row which is shown as breaching
      expect(trendRow.pointType).toBe(POINT_TYPE.TREND);
      expect(trendRow.valueColor).toBe(ALARM_THRESHOLD.color);
    });

    it('do not show the value as the threshold color when no alarm is breached', async () => {
      const { legend } = await newChartLegendSpecPage({
        dataStreams: [NON_BREACHED_ALARM_STREAM, STREAM_W_ASSOCIATED_ALARM],
        thresholds: [ALARM_THRESHOLD],
      });

      expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(1);
      const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

      expect(row.valueColor).not.toBe(ALARM_THRESHOLD.color);
      expect(row.icon).not.toBe(ALARM_THRESHOLD.icon);
    });

    it('show the legend row as in alarm, when one alarm is breached and one is not breached', async () => {
      const { legend } = await newChartLegendSpecPage({
        dataStreams: [
          ALARM_STREAM,
          NON_BREACHED_ALARM_STREAM,
          {
            ...STREAM_W_ASSOCIATED_ALARM,
            associatedStreams: [
              { id: ALARM_STREAM.id, type: StreamType.ALARM },
              { id: NON_BREACHED_ALARM_STREAM.id, type: StreamType.ALARM },
            ],
          },
        ],
        thresholds: [ALARM_THRESHOLD],
      });

      expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(1);
      const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

      expect(row.valueColor).toBe(ALARM_THRESHOLD.color);
      expect(row.icon).toBe(ALARM_THRESHOLD.icon);
    });
  });

  it('does not color the legend to match a breached threshold, when the threshold does not apply to the data stream', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [
            {
              x: WITHIN_VIEWPORT_DATE,
              y: BREACHING_VALUE,
            },
          ],
        },
      ],
      thresholds: [{ ...THRESHOLD, dataStreamIds: ['some-fake-id-that-is-not-our-data-stream-id'] }],
    });
    const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

    expect(row.valueColor).not.toBe(THRESHOLD.color);
  });

  it('does not color the legend to match a breached threshold that is not associated with the stream', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [
            {
              x: WITHIN_VIEWPORT_DATE,
              y: BREACHING_VALUE,
            },
          ],
        },
      ],
      thresholds: [{ ...THRESHOLD, dataStreamIds: ['some-fake-id-that-is-not-our-data-stream-id'] }],
    });
    const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

    expect(row.valueColor).not.toBe(THRESHOLD.color);
  });

  it('does not color the legend to match a breached threshold when only point is after the viewport', async () => {
    const DATE_AFTER_VIEWPORT = new Date(2020, 0, 0).getTime();
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [
            {
              x: DATE_AFTER_VIEWPORT,
              y: BREACHING_VALUE,
            },
          ],
        },
      ],
      thresholds: [THRESHOLD],
    });
    const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

    expect(row.valueColor).not.toBe(THRESHOLD.color);
  });

  it('does color the legend to match a breached threshold when only point is before the viewport', async () => {
    const DATE_BEFORE_VIEWPORT = new Date(1900, 0, 0).getTime();
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [
            {
              x: DATE_BEFORE_VIEWPORT,
              y: BREACHING_VALUE,
            },
          ],
        },
      ],
      thresholds: [THRESHOLD],
    });
    const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

    expect(row.valueColor).toBe(THRESHOLD.color);
  });

  it('renders default color when no thresholds are present', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [
            {
              x: WITHIN_VIEWPORT_DATE,
              y: BREACHING_VALUE,
            },
          ],
        },
      ],
      thresholds: [],
    });
    const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

    expect(row.valueColor).toBe(DEFAULT_LEGEND_TEXT_COLOR);
  });

  it('renders default color when no thresholds are breached by the value', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [
            {
              x: WITHIN_VIEWPORT_DATE,
              y: NON_BREACHING_VALUE,
            },
          ],
        },
      ],
      thresholds: [THRESHOLD],
    });
    const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

    expect(row.valueColor).toBe(DEFAULT_LEGEND_TEXT_COLOR);
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
      x: WITHIN_VIEWPORT_DATE,
      y: -15,
    };

    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [ACTIVE_POINT],
        },
      ],
      thresholds: upperLowerThresholds,
    });
    const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

    expect(row.valueColor).toBe(LOWER_THRESHOLD.color);
  });

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
      x: WITHIN_VIEWPORT_DATE,
      y: 15,
    };

    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          ...DATA_STREAM,
          data: [ACTIVE_POINT],
        },
      ],
      thresholds: upperLowerThresholds,
    });
    const row = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;

    expect(row.valueColor).toBe(UPPER_THRESHOLD.color);
  });
});

describe('is editing', () => {
  it('passes down isEditing as true to the legend rows', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [DATA_STREAM],
      isEditing: true,
    });

    const streamName = legend.querySelector('monitor-data-stream-name') as HTMLMonitorDataStreamNameElement;
    expect(streamName).toHaveAttribute('isEditing');
  });

  it('passes down isEditing as false to the legend rows', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [NUMBER_STREAM],
      isEditing: false,
    });

    const streamName = legend.querySelector('monitor-data-stream-name') as HTMLMonitorDataStreamNameElement;
    expect(streamName).not.toHaveAttribute('isEditing');
  });

  it('defaults is editing as false', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [NUMBER_STREAM],
      isEditing: undefined,
    });

    const streamName = legend.querySelector('monitor-data-stream-name') as HTMLMonitorDataStreamNameElement;
    expect(streamName).not.toHaveAttribute('isEditing');
  });
});

describe('number of legend rows', () => {
  it('creates a single legend row when passed one data stream', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [DATA_STREAM],
    });

    expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(1);
  });

  it('does not create a legend row when passed one trend result without a corresponding data stream', async () => {
    const { legend } = await newChartLegendSpecPage({
      trendResults: [
        {
          dataStreamId: 'data-stream-id',
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 1e-9,
            intercept: 10,
          },
          startDate: new Date(2000, 0),
        },
      ],
    });

    expect(legend.querySelectorAll('monitor-legend-row')).toBeEmpty();
  });

  it('creates two legend rows when passed one trend result with a corresponding data stream', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [NUMBER_STREAM],
      trendResults: [
        {
          dataStreamId: NUMBER_STREAM.id,
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 1e-9,
            intercept: 10,
          },
          startDate: new Date(2000, 0),
        },
      ],
    });

    expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(2);
  });

  it('creates multiple legend rows when passed multiple data streams with corresponding legend rows', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [NUMBER_STREAM, { ...NUMBER_STREAM, id: 'some other id' }],
    });

    expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(2);
  });

  it('creates multiple legend rows when passed multiple data streams with corresponding legend rows and trend results', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [
        {
          id: 'data-stream-id-1',
          name: 'some name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [],
        },
        {
          id: 'data-stream-id-2',
          name: 'some name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [],
        },
      ],
      trendResults: [
        {
          dataStreamId: 'data-stream-id-1',
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 1e-9,
            intercept: 10,
          },
          startDate: new Date(2000, 0, 2),
        },
        {
          dataStreamId: 'data-stream-id-2',
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 2e-9,
            intercept: 3,
          },
          startDate: new Date(2000, 0, 4),
        },
      ],
    });

    expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(4);
  });
});

describe('active point passed into legend rows', () => {
  it('displays the most recent data point within the viewport', async () => {
    const streamId = 'data-stream-id';

    const POINT_1 = {
      x: new Date(2000, 1).getTime(),
      y: 20.018,
    };
    const POINT_2 = {
      x: new Date(2000, 2).getTime(),
      y: 60.12,
    };
    const OUT_OF_VIEWPORT_POINT_3 = {
      x: new Date(2001, 2).getTime(),
      y: 70.98,
    };

    const { legend } = await newChartLegendSpecPage({
      viewPort: {
        yMin: 0,
        yMax: 100,
        start: new Date(2000, 0),
        end: new Date(2001, 0),
      },
      dataStreams: [
        {
          id: streamId,
          name: 'some name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [POINT_1, POINT_2, OUT_OF_VIEWPORT_POINT_3],
        },
      ],
    });

    const legendInfo = legend.querySelector('monitor-legend-row') as HTMLMonitorLegendRowElement;
    expect(legendInfo.point).toEqual(POINT_2);
  });

  it('displays trend line values at the same timestamp as the most recent data stream point within the viewport', async () => {
    const streamId = 'data-stream-id';
    const streamName = 'data-stream-name';

    const POINT_1 = {
      x: new Date(2000, 1).getTime(),
      y: 20.018,
    };
    const POINT_2 = {
      x: new Date(2000, 2).getTime(),
      y: 60.12,
    };
    const OUT_OF_VIEWPORT_POINT_3 = {
      x: new Date(2001, 2).getTime(),
      y: 70.98,
    };

    const { legend } = await newChartLegendSpecPage({
      viewPort: {
        yMin: 0,
        yMax: 100,
        start: new Date(2000, 0),
        end: new Date(2001, 0),
      },
      dataStreams: [
        {
          id: streamId,
          name: streamName,
          color: 'black',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [POINT_1, POINT_2, OUT_OF_VIEWPORT_POINT_3],
        },
      ],
      trendResults: [
        {
          dataStreamId: streamId,
          type: TREND_TYPE.LINEAR,
          equation: {
            gradient: 3e-9,
            intercept: 20,
          },
          startDate: new Date(2000, 0),
        },
      ],
    });

    const legendInfo = legend.querySelectorAll('monitor-legend-row')[1] as HTMLMonitorLegendRowElement;
    expect(legendInfo.point).toEqual({
      x: POINT_2.x,
      y: 35.552,
    });
  });
});

describe('string data type behavior', () => {
  it('renders a stream info per string data stream when supports strings', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [STRING_STREAM_1, STRING_STREAM_2],
      supportString: true,
    });

    expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(2);
  });

  it('does not render a stream info per string data stream when it does not supports strings', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [STRING_STREAM_1, STRING_STREAM_2],
      supportString: false,
    });

    expect(legend.querySelectorAll('monitor-legend-row')).toBeEmpty();
  });

  it('filters out string data type when support string is false', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [NUMBER_STREAM, STRING_STREAM_1],
      supportString: false,
    });

    expect(legend.querySelectorAll('monitor-legend-row')).toHaveLength(1);
  });
});

describe('showDataStreamColor option', () => {
  const BAR_SELECTOR = '.bar';

  it('renders color bars when showDataStreamColor is true', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [NUMBER_STREAM],
      showDataStreamColor: true,
    });

    expect(legend.querySelectorAll(BAR_SELECTOR)).not.toBeEmpty();
  });

  it('does not render color bars when showDataStreamColor is false', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [NUMBER_STREAM],
      showDataStreamColor: false,
    });

    expect(legend.querySelectorAll(BAR_SELECTOR)).toBeEmpty();
  });
});

describe('visualizesAlarms', () => {
  it('does not render alarm based legend rows with `visualizesAlarms` is false', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [ALARM_STREAM],
      visualizesAlarms: false,
      supportString: true,
    });

    const rows = legend.querySelectorAll('monitor-legend-row');
    expect(rows).toBeEmpty();
  });

  it('does render alarm based legend rows with `visualizesAlarms` is true', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [ALARM_STREAM],
      visualizesAlarms: true,
      supportString: true, // our mock infos are strings, so this is also required
    });

    const rows = legend.querySelectorAll('monitor-legend-row');
    expect(rows).toHaveLength(1);

    const row = rows[0];

    const mostRecentAlarmPoint = ALARM_STREAM.data[0]; // Our only point

    expect(row.valueColor).toBe(DEFAULT_LEGEND_TEXT_COLOR);
    expect(row.label).toBe(ALARM_STREAM.name);
    expect(row.point).toBe(mostRecentAlarmPoint);
  });

  it('does not render a string based alarm when `visualizesAlarms` is true, but `supportString` is false', async () => {
    const { legend } = await newChartLegendSpecPage({
      dataStreams: [ALARM_STREAM],
      visualizesAlarms: true,
      supportString: false, // our mock infos are strings
    });

    const rows = legend.querySelectorAll('monitor-legend-row');
    expect(rows).toBeEmpty();
  });
});
