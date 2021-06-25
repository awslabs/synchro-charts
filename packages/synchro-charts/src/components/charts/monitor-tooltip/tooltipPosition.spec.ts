import { tooltipPosition } from './tooltipPosition';
import { TooltipPoint } from './types';
import { POINT_TYPE } from '../monitor-webgl-base-chart/activePoints';
import { MINUTE_IN_MS } from '../../../utils/time';
import { DataPoint } from '../../../utils/dataTypes';

const VIEW_PORT = { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0), yMin: 0, yMax: 100 };
const SIZE = { width: 500, height: 400 };

const WITHIN_VIEW_PORT_DATE = (VIEW_PORT.start.getTime() + VIEW_PORT.end.getTime()) / 2;

const STRING_TOOLTIP_POINT_1: TooltipPoint = {
  streamId: 'some-id',
  point: {
    x: WITHIN_VIEW_PORT_DATE,
    y: 'some-string',
  },
  color: 'red',
  type: POINT_TYPE.DATA,
};

const DATA_TOOLTIP_POINT_1: TooltipPoint = {
  streamId: 'some-id',
  point: {
    x: WITHIN_VIEW_PORT_DATE,
    y: 12,
  },
  color: 'red',
  type: POINT_TYPE.DATA,
};

const TREND_TOOLTIP_POINT_1: TooltipPoint = {
  streamId: 'some-id',
  point: {
    x: Date.now(),
    y: 12,
  },
  color: 'blue',
  type: POINT_TYPE.TREND,
};

describe('sanity test', () => {
  it('is undefined when given no points', () => {
    expect(
      tooltipPosition({
        points: [],
        resolution: 0,
        viewPort: VIEW_PORT,
        size: SIZE,
        selectedTimestamp: Date.now(),
      })
    ).toBeUndefined();
  });

  it('is valid position when passed numerical and string data', () => {
    const { x, y } = tooltipPosition({
      points: [DATA_TOOLTIP_POINT_1, TREND_TOOLTIP_POINT_1, STRING_TOOLTIP_POINT_1],
      resolution: 0,
      viewPort: VIEW_PORT,
      size: SIZE,
      selectedTimestamp: WITHIN_VIEW_PORT_DATE,
    }) as { x: number; y: number };

    expect(x).toBeNumber();
    expect(y).toBeNumber();
  });

  it('is valid position when passed only string data', () => {
    const { x, y } = tooltipPosition({
      points: [STRING_TOOLTIP_POINT_1],
      resolution: 0,
      viewPort: VIEW_PORT,
      size: SIZE,
      selectedTimestamp: WITHIN_VIEW_PORT_DATE,
    }) as { x: number; y: number };

    expect(x).toBeNumber();
    expect(y).toBeNumber();
  });
});

describe('x position', () => {
  describe('with raw data', () => {
    it('is in middle of the viewport when date is in the middle of the viewport when showing raw data', () => {
      const { x } = tooltipPosition({
        points: [DATA_TOOLTIP_POINT_1, TREND_TOOLTIP_POINT_1],
        resolution: 0,
        viewPort: VIEW_PORT,
        size: SIZE,
        selectedTimestamp: WITHIN_VIEW_PORT_DATE,
      }) as { x: number; y: number };

      expect(x).toBe(SIZE.width / 2);
    });

    it('is zero when the selected date is the start of the viewport', () => {
      const { x } = tooltipPosition({
        points: [DATA_TOOLTIP_POINT_1, TREND_TOOLTIP_POINT_1],
        resolution: 0,
        viewPort: VIEW_PORT,
        size: SIZE,
        selectedTimestamp: VIEW_PORT.start.getTime(),
      }) as { x: number; y: number };

      expect(x).toBe(0);
    });

    it('is equal to the width when the selected date is the end of the viewport', () => {
      const { x } = tooltipPosition({
        points: [DATA_TOOLTIP_POINT_1, TREND_TOOLTIP_POINT_1],
        resolution: 0,
        viewPort: VIEW_PORT,
        size: SIZE,
        selectedTimestamp: VIEW_PORT.end.getTime(),
      }) as { x: number; y: number };

      expect(x).toBe(SIZE.width);
    });
  });

  describe('with aggregated data', () => {
    it('is in middle of the viewport when date is in the middle of the viewport when the aggregated point exists at the middle', () => {
      const { x } = tooltipPosition({
        points: [DATA_TOOLTIP_POINT_1, TREND_TOOLTIP_POINT_1],
        resolution: MINUTE_IN_MS,
        viewPort: VIEW_PORT,
        size: SIZE,
        selectedTimestamp: WITHIN_VIEW_PORT_DATE,
      }) as { x: number; y: number };

      expect(x).toBe(SIZE.width / 2);
    });

    it('is zero when the only point is at the start of the viewport', () => {
      const TOOLTIP_POINT: TooltipPoint = {
        ...DATA_TOOLTIP_POINT_1,
        point: {
          ...(DATA_TOOLTIP_POINT_1.point as DataPoint<number>),
          x: VIEW_PORT.start.getTime(),
        },
      };
      const { x } = tooltipPosition({
        points: [TOOLTIP_POINT],
        resolution: MINUTE_IN_MS,
        viewPort: VIEW_PORT,
        size: SIZE,
        selectedTimestamp: WITHIN_VIEW_PORT_DATE,
      }) as { x: number; y: number };

      expect(x).toBe(0);
    });

    it('is the width when the only point is at the end of the viewport', () => {
      const TOOLTIP_POINT: TooltipPoint = {
        ...DATA_TOOLTIP_POINT_1,
        point: {
          ...(DATA_TOOLTIP_POINT_1.point as DataPoint<number>),
          x: VIEW_PORT.end.getTime(),
        },
      };
      const { x } = tooltipPosition({
        points: [TOOLTIP_POINT],
        resolution: MINUTE_IN_MS,
        viewPort: VIEW_PORT,
        size: SIZE,
        selectedTimestamp: WITHIN_VIEW_PORT_DATE,
      }) as { x: number; y: number };

      expect(x).toBe(SIZE.width);
    });
  });
});

describe('y position', () => {
  it('is within within the chart size range', () => {
    const { y } = tooltipPosition({
      points: [DATA_TOOLTIP_POINT_1, TREND_TOOLTIP_POINT_1],
      resolution: 0,
      viewPort: VIEW_PORT,
      size: SIZE,
      selectedTimestamp: WITHIN_VIEW_PORT_DATE,
    }) as { x: number; y: number };

    expect(y).toBeGreaterThan(0);
    expect(y).toBeLessThanOrEqual(SIZE.height);
  });

  it('has a y position of zero when given an active point with a y value much greater than the yMax provided', () => {
    const { y } = tooltipPosition({
      points: [
        {
          ...DATA_TOOLTIP_POINT_1,
          point: {
            ...(DATA_TOOLTIP_POINT_1.point as Required<DataPoint>),
            y: 999999,
          },
        },
      ],
      resolution: 0,
      viewPort: VIEW_PORT,
      size: SIZE,
      selectedTimestamp: WITHIN_VIEW_PORT_DATE,
    }) as { x: number; y: number };

    expect(y).toBe(0);
  });
});
