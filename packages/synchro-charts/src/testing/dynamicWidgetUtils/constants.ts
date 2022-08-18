import { DataPoint, DataStream, DataStreamInfo } from '../../utils/dataTypes';
import { COMPARISON_OPERATOR, LEGEND_POSITION, StatusIcon } from '../../components/charts/common/constants';
import { Annotations, LegendConfig, Threshold } from '../../components/charts/common/types';
import { MINUTE_IN_MS } from '../../utils/time';
import { DataType, StreamType } from '../../utils/dataConstants';

/**
 * Data Construction
 *
 * We want to construct a widget which displays a numerical data stream, with two alarm string data streams with
 * corresponding thresholds.
 *
 * We do this by monitoring the "oil change status" and "could get speeding ticket" alarm.
 */

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const DIFF = X_MAX.getTime() - X_MIN.getTime();

const SOME_NUM = 60;

const OK = 'OK';
const ALARM = 'ALARM';

/**
 * MPH Data
 */

const getMPHData = (): DataPoint<number>[] => [
  {
    x: X_MIN.getTime() + DIFF / 5,
    y: SOME_NUM / 5,
  },
  {
    x: X_MIN.getTime() + (DIFF * 2) / 5,
    y: SOME_NUM / 4,
  },
  {
    x: X_MIN.getTime() + (DIFF * 3) / 5,
    y: SOME_NUM,
  },
  {
    x: X_MIN.getTime() + (DIFF * 4) / 5,
    y: SOME_NUM * 2,
  },
];

const speedingAlarmData = (): DataPoint<string>[] => [
  {
    x: X_MIN.getTime() + DIFF / 5,
    y: OK,
  },
  {
    x: X_MIN.getTime() + (DIFF * 2) / 5,
    y: OK,
  },
  {
    x: X_MIN.getTime() + (DIFF * 3) / 5,
    y: OK,
  },
  {
    x: X_MIN.getTime() + (DIFF * 4) / 5,
    y: ALARM,
  },
];

const oilAlarmData = (): DataPoint<string>[] => [
  {
    x: X_MIN.getTime() + DIFF / 5,
    y: OK,
  },
  {
    x: X_MIN.getTime() + (DIFF * 2) / 5,
    y: OK,
  },
  {
    x: X_MIN.getTime() + (DIFF * 3) / 5,
    y: ALARM,
  },
  {
    x: X_MIN.getTime() + (DIFF * 4) / 5,
    y: ALARM,
  },
];

const speedingAlarmInfo: DataStreamInfo = {
  dataType: DataType.STRING,
  resolution: 0,
  id: 'speeding-alarm',
  color: 'red',
  name: 'speeding alarm',
  streamType: StreamType.ALARM,
};

const oilChangeAlarmInfo: DataStreamInfo = {
  dataType: DataType.STRING,
  resolution: 0,
  id: 'oil-change-alarm',
  color: 'orange',
  name: 'oil change alarm',
  streamType: StreamType.ALARM,
};

const dataStreamInfoWithAlarms: DataStreamInfo = {
  dataType: DataType.NUMBER,
  resolution: 0,
  id: 'stream-with-alarms',
  color: 'black',
  name: 'mph',
  associatedStreams: [
    { id: speedingAlarmInfo.id, type: StreamType.ALARM },
    { id: oilChangeAlarmInfo.id, type: StreamType.ALARM },
  ],
};

export const INFOS: DataStreamInfo[] = [dataStreamInfoWithAlarms, speedingAlarmInfo, oilChangeAlarmInfo];

const mphStream: DataStream<number> = {
  id: dataStreamInfoWithAlarms.id,
  dataType: dataStreamInfoWithAlarms.dataType,
  color: 'black',
  name: 'mph',
  aggregates: {
    [MINUTE_IN_MS]: getMPHData(),
  },
  data: [],
  resolution: MINUTE_IN_MS,
  associatedStreams: [
    {
      id: speedingAlarmInfo.id,
      type: StreamType.ALARM,
    },
    {
      id: speedingAlarmInfo.id,
      type: StreamType.ALARM,
    },
  ],
};

const speedingAlarmStream: DataStream<string> = {
  id: speedingAlarmInfo.id,
  color: 'red',
  name: 'speeding alarm',
  streamType: StreamType.ALARM,
  dataType: speedingAlarmInfo.dataType,
  data: speedingAlarmData(),
  resolution: 0,
};

const oilAlarmStream: DataStream<string> = {
  id: oilChangeAlarmInfo.id,
  dataType: oilChangeAlarmInfo.dataType,
  data: oilAlarmData(),
  color: 'orange',
  name: 'oil change alarm',
  streamType: StreamType.ALARM,
  resolution: 0,
};

export const DATA = [mphStream, speedingAlarmStream, oilAlarmStream];

export const VIEWPORT = {
  start: X_MIN,
  end: X_MAX,
};

export const SIZE = {
  height: 500,
  width: 500,
};

const speedingThreshold: Threshold<string> = {
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  dataStreamIds: [speedingAlarmStream.id],
  value: ALARM,
  color: 'red',
  severity: 1,
  icon: StatusIcon.ACTIVE,
};

const speedingOkThreshold: Threshold<string> = {
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  dataStreamIds: [speedingAlarmStream.id],
  value: OK,
  color: 'green',
  icon: StatusIcon.NORMAL,
};

const oilChangeThreshold: Threshold<string> = {
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  dataStreamIds: [oilAlarmStream.id],
  value: ALARM,
  color: 'orange',
  severity: 2,
  icon: StatusIcon.ACTIVE,
};

const thresholds: Threshold[] = [speedingThreshold, oilChangeThreshold, speedingOkThreshold];
export const ANNOTATIONS: Annotations = { y: thresholds };

export const LEGEND: LegendConfig = {
  position: LEGEND_POSITION.RIGHT,
  width: 200,
  legendLabels: {
    title: 'Number of data points',
  },
};
