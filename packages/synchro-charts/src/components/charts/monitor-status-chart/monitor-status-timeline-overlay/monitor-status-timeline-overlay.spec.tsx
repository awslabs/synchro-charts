import { newSpecPage } from '@stencil/core/testing';
import { Components } from '../../../../components.d';
import { CustomHTMLElement } from '../../../../utils/types';
import { update } from '../../common/tests/merge';
import { MonitorStatusTimelineOverlay } from './monitor-status-timeline-overlay';
import { DataStream } from '../../../../utils/dataTypes';
import { Threshold } from '../../common/types';
import { VIEW_PORT } from '../../common/testUtil';
import { DAY_IN_MS } from '../../../../utils/time';
import { MonitorStatusTimelineOverlayRow } from './monitor-status-timeline-overlay-row';
import { DATA_STREAM_2 } from '../../../../testing/__mocks__/mockWidgetProperties';
import { DataType, StreamType } from '../../../../utils/dataConstants';
import { COMPARISON_OPERATOR, StatusIcon } from '../../common/constants';

const DATA_STREAM: DataStream<number> = {
  id: 'some-id',
  name: 'data-stream-name',
  color: 'black',
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
const BEFORE_VIEWPORT_DATE = VIEW_PORT.start.getTime() - DAY_IN_MS;

const ALARM_STREAM: DataStream<string> = {
  id: 'alarm-stream',
  dataType: DataType.STRING,
  name: 'alarm stream',
  color: 'red',
  resolution: 0,
  streamType: StreamType.ALARM,
  data: [
    {
      x: WITHIN_VIEWPORT_DATE,
      y: ALARM,
    },
  ],
};

const NON_BREACHED_ALARM_STREAM: DataStream<string> = {
  id: 'alarm-stream-2',
  name: 'some-alarm-stream',
  dataType: DataType.STRING,
  resolution: 0,
  streamType: StreamType.ALARM,
  data: [
    {
      x: WITHIN_VIEWPORT_DATE,
      y: OK,
    },
  ],
};

const DATA_STREAMS_WITH_ALARMS_ASSOCIATED: DataStream = {
  ...DATA_STREAM,
  associatedStreams: [
    { id: ALARM_STREAM.id, type: StreamType.ALARM },
    { id: NON_BREACHED_ALARM_STREAM.id, type: StreamType.ALARM },
  ],
};

const timelineOverlaySpecPage = async (propOverrides: Partial<Components.MonitorStatusTimelineOverlay> = {}) => {
  const page = await newSpecPage({
    components: [MonitorStatusTimelineOverlay, MonitorStatusTimelineOverlayRow],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const timelineOverlay = page.doc.createElement('monitor-status-timeline-overlay') as CustomHTMLElement<
    Components.MonitorStatusTimelineOverlay
  >;
  const props: Components.MonitorStatusTimelineOverlay = {
    thresholds: [],
    dataStreams: [],
    date: VIEW_PORT.end,
    isEditing: false,
    widgetId: 'some-fake-widget-id',
    size: {
      width: 100,
      height: 200,
      marginLeft: 20,
      marginRight: 25,
      marginTop: 15,
      marginBottom: 11,
    },
    ...propOverrides,
  };

  update(timelineOverlay, props);
  page.body.appendChild(timelineOverlay);

  await page.waitForChanges();

  return { page, timelineOverlay };
};

it('renders no rows when give no data streams', async () => {
  const { timelineOverlay } = await timelineOverlaySpecPage({ dataStreams: [] });

  expect(timelineOverlay.querySelectorAll('monitor-status-timeline-overlay-row')).toBeEmpty();
});

it('renders multiple rows when given multiple infos', async () => {
  const { timelineOverlay } = await timelineOverlaySpecPage({ dataStreams: [DATA_STREAM, DATA_STREAM_2] });

  expect(timelineOverlay.querySelectorAll('monitor-status-timeline-overlay-row')).toHaveLength(2);
});

it('displays data point on the timeline-overlay when it falls before the viewport', async () => {
  const POINT = {
    x: BEFORE_VIEWPORT_DATE,
    y: 123,
  };
  const { timelineOverlay } = await timelineOverlaySpecPage({
    dataStreams: [
      {
        id: 'some-id',
        name: 'some-name',
        dataType: DataType.NUMBER,
        resolution: 0,
        data: [POINT],
      },
    ],
  });

  const row = timelineOverlay.querySelector(
    'monitor-status-timeline-overlay-row'
  ) as HTMLMonitorStatusTimelineOverlayRowElement;
  expect(row).not.toBeNull();
  expect(row.value).toEqual(POINT.y);
});

describe('indicates breaching of thresholds', () => {
  describe('utilizing alarms', () => {
    it('with an alarm data stream that is breached, display the color of the breached threshold', async () => {
      const { timelineOverlay } = await timelineOverlaySpecPage({
        dataStreams: [DATA_STREAMS_WITH_ALARMS_ASSOCIATED, ALARM_STREAM],
        thresholds: [ALARM_THRESHOLD],
      });

      const rows = timelineOverlay.querySelectorAll('monitor-status-timeline-overlay-row');
      expect(rows).toHaveLength(2);

      expect(rows[0].label).toBe(DATA_STREAM.name);
      expect(rows[0].valueColor).toBe(ALARM_THRESHOLD.color);
      expect(rows[0].icon).toBe(ALARM_THRESHOLD.icon);

      expect(rows[1].label).toBe(ALARM_STREAM.name);
      expect(rows[1].valueColor).toBe(ALARM_THRESHOLD.color);
      expect(rows[0].icon).toBe(ALARM_THRESHOLD.icon);
    });

    it('do not show the value as the threshold color when no alarm is breached', async () => {
      const { timelineOverlay } = await timelineOverlaySpecPage({
        dataStreams: [DATA_STREAMS_WITH_ALARMS_ASSOCIATED, NON_BREACHED_ALARM_STREAM],
        thresholds: [ALARM_THRESHOLD],
      });

      const rows = timelineOverlay.querySelectorAll('monitor-status-timeline-overlay-row');
      expect(rows).toHaveLength(2);

      expect(rows[0].valueColor).not.toBe(ALARM_THRESHOLD.color);
      expect(rows[0].icon).not.toBe(ALARM_THRESHOLD.icon);
      expect(rows[0].label).toBe(DATA_STREAMS_WITH_ALARMS_ASSOCIATED.name);

      expect(rows[1].valueColor).not.toBe(ALARM_THRESHOLD.color);
      expect(rows[1].icon).not.toBe(ALARM_THRESHOLD.icon);
      expect(rows[1].label).toBe(NON_BREACHED_ALARM_STREAM.name);
    });

    it('show the row as in alarm, when one alarm is breached and one is not breached', async () => {
      const { timelineOverlay } = await timelineOverlaySpecPage({
        dataStreams: [DATA_STREAMS_WITH_ALARMS_ASSOCIATED, ALARM_STREAM, NON_BREACHED_ALARM_STREAM],
        thresholds: [ALARM_THRESHOLD],
      });

      const rows = timelineOverlay.querySelectorAll('monitor-status-timeline-overlay-row');
      expect(rows).toHaveLength(3);

      expect(rows[0].label).toBe(DATA_STREAMS_WITH_ALARMS_ASSOCIATED.name);
      expect(rows[0].valueColor).toBe(ALARM_THRESHOLD.color);
      expect(rows[0].icon).toBe(ALARM_THRESHOLD.icon);
    });

    it('does not color the row to match a breached threshold, when the threshold does not apply to the data stream', async () => {
      const { timelineOverlay } = await timelineOverlaySpecPage({
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

      const row = timelineOverlay.querySelector(
        'monitor-status-timeline-overlay-row'
      ) as HTMLMonitorStatusTimelineOverlayRowElement;
      expect(row.valueColor).not.toBe(THRESHOLD.color);
    });
    it('does color the row to match a breached threshold', async () => {
      const { timelineOverlay } = await timelineOverlaySpecPage({
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
      const row = timelineOverlay.querySelector(
        'monitor-status-timeline-overlay-row'
      ) as HTMLMonitorStatusTimelineOverlayRowElement;

      expect(row.valueColor).not.toBe(THRESHOLD.color);
    });

    it('does not color the row to match a breached threshold when only point is after the viewport', async () => {
      const DATE_AFTER_VIEWPORT = new Date(2020, 0, 0);
      const { timelineOverlay } = await timelineOverlaySpecPage({
        dataStreams: [
          {
            ...DATA_STREAM,
            data: [
              {
                x: DATE_AFTER_VIEWPORT.getTime(),
                y: BREACHING_VALUE,
              },
            ],
          },
        ],
        thresholds: [THRESHOLD],
      });
      const row = timelineOverlay.querySelector(
        'monitor-status-timeline-overlay-row'
      ) as HTMLMonitorStatusTimelineOverlayRowElement;

      expect(row.valueColor).not.toBe(THRESHOLD.color);
    });

    it('does color the row to match a breached threshold when only point is before the viewport', async () => {
      const DATE_BEFORE_VIEWPORT = new Date(1900, 0, 0);
      const { timelineOverlay } = await timelineOverlaySpecPage({
        dataStreams: [
          {
            ...DATA_STREAM,
            data: [
              {
                x: DATE_BEFORE_VIEWPORT.getTime(),
                y: BREACHING_VALUE,
              },
            ],
          },
        ],
        thresholds: [THRESHOLD],
      });

      const row = timelineOverlay.querySelector(
        'monitor-status-timeline-overlay-row'
      ) as HTMLMonitorStatusTimelineOverlayRowElement;
      expect(row.valueColor).toBe(THRESHOLD.color);
    });

    it('renders default color when no thresholds are present', async () => {
      const { timelineOverlay } = await timelineOverlaySpecPage({
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
      const row = timelineOverlay.querySelector(
        'monitor-status-timeline-overlay-row'
      ) as HTMLMonitorStatusTimelineOverlayRowElement;

      expect(row.valueColor).toBeUndefined();
    });
    it('renders default color when no thresholds are breached by the value', async () => {
      const { timelineOverlay } = await timelineOverlaySpecPage({
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
      const row = timelineOverlay.querySelector(
        'monitor-status-timeline-overlay-row'
      ) as HTMLMonitorStatusTimelineOverlayRowElement;

      expect(row.valueColor).toBeUndefined();
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

      const { timelineOverlay } = await timelineOverlaySpecPage({
        dataStreams: [
          {
            ...DATA_STREAM,
            data: [ACTIVE_POINT],
          },
        ],
        thresholds: upperLowerThresholds,
      });
      const row = timelineOverlay.querySelector(
        'monitor-status-timeline-overlay-row'
      ) as HTMLMonitorStatusTimelineOverlayRowElement;

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

      const { timelineOverlay } = await timelineOverlaySpecPage({
        dataStreams: [
          {
            ...DATA_STREAM,
            data: [ACTIVE_POINT],
          },
        ],
        thresholds: upperLowerThresholds,
      });

      const row = timelineOverlay.querySelector(
        'monitor-status-timeline-overlay-row'
      ) as HTMLMonitorStatusTimelineOverlayRowElement;
      expect(row.valueColor).toBe(UPPER_THRESHOLD.color);
    });
  });
});

describe('is editing', () => {
  it('passes down isEditing as true to the rows', async () => {
    const { timelineOverlay } = await timelineOverlaySpecPage({
      dataStreams: [
        {
          id: 'data-stream-id',
          name: 'data-stream-name',
          dataType: DataType.NUMBER,
          color: 'black',
          resolution: 0,
          data: [],
        },
      ],
      isEditing: true,
    });

    const streamName = timelineOverlay.querySelector('monitor-data-stream-name') as HTMLMonitorDataStreamNameElement;
    expect(streamName).toHaveAttribute('isEditing');
  });

  it('passes down isEditing as false to the rows', async () => {
    const { timelineOverlay } = await timelineOverlaySpecPage({
      dataStreams: [
        {
          id: 'data-stream-id',
          name: 'data-stream-name',
          color: 'black',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [],
        },
      ],
      isEditing: false,
    });

    const streamName = timelineOverlay.querySelector('monitor-data-stream-name') as HTMLMonitorDataStreamNameElement;
    expect(streamName).not.toHaveAttribute('isEditing');
  });

  it('defaults is editing as false', async () => {
    const { timelineOverlay } = await timelineOverlaySpecPage({
      dataStreams: [
        {
          id: 'data-stream-id',
          name: 'data-stream-name',
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [],
        },
      ],
      isEditing: undefined,
    });

    const streamName = timelineOverlay.querySelector('monitor-data-stream-name') as HTMLMonitorDataStreamNameElement;
    expect(streamName).not.toHaveAttribute('isEditing');
  });
});

describe('active point passed into rows', () => {
  it('displays the most recent data point within the viewport', async () => {
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

    const { timelineOverlay } = await timelineOverlaySpecPage({
      date: new Date(2001, 0, 0),
      dataStreams: [
        {
          id: streamId,
          name: streamName,
          resolution: 0,
          dataType: DataType.NUMBER,
          data: [POINT_1, POINT_2, OUT_OF_VIEWPORT_POINT_3],
        },
      ],
    });

    const row = timelineOverlay.querySelector(
      'monitor-status-timeline-overlay-row'
    ) as HTMLMonitorStatusTimelineOverlayRowElement;
    expect(row.value).toEqual(POINT_2.y);
  });
});
