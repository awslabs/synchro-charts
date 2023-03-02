/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import { DataStream, DataStreamInfo, TableColumn } from '../../../utils/dataTypes';
import { Annotations, Threshold } from '../../../components/charts/common/types';
import { DataType, StreamType } from '../../../utils/dataConstants';
import { COMPARISON_OPERATOR, StatusIcon } from '../../../components/charts/common/constants';

const ERROR_MSG = 'STOPPED';

const alarmActiveThreshold: Threshold<string> = {
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  dataStreamIds: ['alarm-cell-id-2'],
  value: 'ACTIVE',
  color: 'red',
  icon: StatusIcon.ACTIVE,
};

const alarmNormalThreshold: Threshold<string> = {
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  dataStreamIds: ['alarm-cell-id-1', 'alarm-cell-id-3'],
  value: 'NORMAL',
  color: 'green',
  icon: StatusIcon.NORMAL,
};

const mapAlarmValue = [alarmNormalThreshold.value, alarmActiveThreshold.value, alarmNormalThreshold.value];
const thresholds: Threshold[] = [alarmActiveThreshold, alarmNormalThreshold];
const annotations: Annotations = { y: thresholds };

const constructDataStreams = (length: number): DataStream[] => {
  const dataStreams: DataStream[] = [];

  for (let i = 1; i <= length; i++) {
    dataStreams.push(
      {
        id: `rule-cell-id-${i}`,
        data: [{ x: new Date(2000, 0, 0).getTime(), y: 'y < 30' }],
        resolution: 0,
        color: 'black',
        name: 'rule row 1',
        dataType: DataType.NUMBER,
      },
      {
        id: `severity-cell-id-${i}`,
        data: [{ x: new Date(2000, 0, 0).getTime(), y: 3 }],
        resolution: 0,
        color: 'black',
        name: 'sev row 1',
        dataType: DataType.NUMBER,
      },
      {
        id: `alarm-cell-id-${i}`,
        data: [{ x: new Date(2000, 0, 0).getTime(), y: mapAlarmValue[i - 1] }],
        resolution: 0,
        dataType: DataType.STRING,
        color: 'red',
        name: 'D alarm',
      }
    );
  }
  return dataStreams;
};

const constructDataStreamInfo = (length: number): DataStreamInfo[] => {
  const dataStreamInfo: DataStreamInfo[] = [];

  for (let i = 1; i <= length; i++) {
    dataStreamInfo.push(
      {
        id: `rule-cell-id-${i}`,
        resolution: 0,
        dataType: DataType.STRING,
        color: 'black',
        name: 'rule row 1',
      },
      {
        id: `severity-cell-id-${i}`,
        resolution: 0,
        dataType: DataType.STRING,
        color: 'black',
        name: 'sev row 1',
      },
      {
        id: `alarm-cell-id-${i}`,
        resolution: 0,
        dataType: DataType.STRING,
        color: 'red',
        name: 'D alarm',
        streamType: StreamType.ALARM,
      }
    );
  }
  return dataStreamInfo;
};

const constructTableRows = (length: number, header: string) => {
  const rows: string[] = [];
  for (let i = 1; i <= length; i++) {
    rows.push(`${header}-cell-id-${i}`);
  }
  return rows;
};

export const tableMockData = ({
  tableDataLength = 1,
  showLoading,
  showError,
}: {
  tableDataLength?: number;
  showLoading?: boolean;
  showError?: boolean;
}) => {
  /** Construct  */
  const tableColumns: TableColumn[] = [
    { header: 'Rule', rows: constructTableRows(tableDataLength, 'rule') },
    { header: 'Severity', rows: constructTableRows(tableDataLength, 'severity') },
    { header: 'Alarm', rows: constructTableRows(tableDataLength, 'alarm') },
  ];

  const dataStreamInfo = constructDataStreamInfo(tableDataLength);
  const dataStreams = constructDataStreams(tableDataLength);

  if (showLoading) {
    dataStreams[0].isLoading = true;
  }

  if (showError) {
    dataStreams[0].error = ERROR_MSG;
  }

  return {
    tableColumns,
    dataStreamInfo,
    dataStreams,
    annotations,
    errorMsg: ERROR_MSG,
  };
};
