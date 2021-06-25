import { constructTableData, cell, formatLiveModeOnlyMessage } from './constructTableData';
import { DataPoint, DataStream, Primitive, TableColumn } from '../../utils/dataTypes';
import { Threshold } from '../charts/common/types';
import { DataType } from '../../utils/dataConstants';
import { COMPARISON_OPERATOR } from '../charts/common/constants';

const tableColumn: TableColumn[] = [
  { header: 'Rule', rows: ['rule-cell-id-1'] },
  { header: 'Severity', rows: ['severity-cell-id-1'] },
  { header: 'Alarm', rows: ['alarm-cell-id-1'] },
];
const DATA_STREAMS: DataStream<Primitive>[] = [
  {
    id: 'rule-cell-id-1',
    name: 'rule',
    data: [{ x: new Date(2000, 0, 0).getTime(), y: 'y < 30' }],
    resolution: 0,
    dataType: DataType.NUMBER,
  },
  {
    id: 'severity-cell-id-1',
    name: 'severity',
    data: [{ x: new Date(2000, 0, 0).getTime(), y: '3' }],
    resolution: 0,
    dataType: DataType.NUMBER,
  },
  {
    id: 'alarm-cell-id-1',
    name: 'alarm',
    data: [{ x: new Date(2000, 0, 0).getTime(), y: 'normal' }],
    resolution: 0,
    dataType: DataType.NUMBER,
  },
];

const EARLIER_POINT: DataPoint<string> = {
  x: new Date(2000, 0, 1).getTime(),
  y: 'Active',
};

const LATER_POINT: DataPoint<string> = {
  x: new Date(2000, 0, 10).getTime(),
  y: 'Disabled',
};

const STREAM: DataStream<string> = {
  id: 'my-id',
  name: 'my-name',
  color: 'blue',
  dataType: DataType.STRING,
  resolution: 0,
  // NOTE: data streams must be chronologically ordered, oldest to most recent (first item is the furthest back in time).
  data: [EARLIER_POINT, LATER_POINT],
};

const ACTIVE_THRESHOLD: Threshold = {
  color: 'red',
  value: 'Active',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  dataStreamIds: [STREAM.id],
};
const DISABLED_THRESHOLD: Threshold = {
  color: 'grey',
  value: 'Disabled',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
};

const tableData = constructTableData({
  tableColumns: tableColumn,
  dataStreams: DATA_STREAMS,
  thresholds: [],
  date: new Date(),
});

const columnHeader = Object.values(tableColumn).map(el => el.header);

it('construct Table data', () => {
  expect(tableData).toHaveLength(1);
  expect(Object.keys(tableData[0])).toHaveLength(3);
  expect(tableData[0]).toHaveProperty(columnHeader[0]);
  expect(tableData[0]).toHaveProperty(columnHeader[1]);
  expect(tableData[0]).toHaveProperty(columnHeader[2]);
  expect(Object.values(tableData[0])).toHaveLength(3);
  expect(tableData[0].Rule).toHaveProperty('dataStream', DATA_STREAMS[0]);
  expect(tableData[0].Rule).toHaveProperty('color', undefined);
  expect(tableData[0].Rule).toHaveProperty('icon', undefined);
});

it('construct Table data with mismatching rows', () => {
  const rows = constructTableData({
    tableColumns: [{ header: 'Rule', rows: [] }, { header: 'Severity', rows: [undefined, undefined] }],
    dataStreams: [],
    thresholds: [],
    date: new Date(),
  });

  expect(rows).toHaveLength(2); // second column has two rows
  expect(rows).toEqual([
    { Rule: { dataStream: undefined }, Severity: { dataStream: undefined } },
    { Rule: { dataStream: undefined }, Severity: { dataStream: undefined } },
  ]);
});

it('construct Table data with no rows', () => {
  const rows = constructTableData({
    tableColumns: [{ header: 'Rule', rows: [] }, { header: 'Severity', rows: [] }, { header: 'Alarm', rows: [] }],
    dataStreams: [],
    thresholds: [],
    date: new Date(),
  });

  expect(rows).toBeEmpty();
});

it('construct Table data with no data but has data streams', () => {
  const tableMock = constructTableData({
    tableColumns: [
      { header: 'Rule', rows: ['rule-cell-id-1'] },
      { header: 'Severity', rows: ['invalid-stream-id'] }, // invalid stream id
      { header: 'Alarm', rows: ['alarm-cell-id-1'] },
    ],
    dataStreams: DATA_STREAMS.map(s => ({ ...s, data: [] })),
    thresholds: [],
    date: new Date(),
  });

  expect(tableMock).toHaveLength(1);

  expect(tableMock[0]).toEqual(
    expect.objectContaining({
      Rule: expect.objectContaining({
        dataStream: expect.objectContaining({
          data: [],
        }),
      }),
      Severity: expect.objectContaining({
        dataStream: undefined,
      }),
      Alarm: expect.objectContaining({
        dataStream: expect.objectContaining({
          data: [],
        }),
      }),
    })
  );
});

it('construct Table data with missing row dataStream', () => {
  const tableMock = constructTableData({
    tableColumns: [
      { header: 'Rule', rows: ['rule-cell-id-1'] },
      { header: 'Severity', rows: [''] },
      { header: 'Alarm', rows: ['alarm-cell-id-1'] },
    ],
    dataStreams: DATA_STREAMS,
    thresholds: [],
    date: new Date(),
  });
  expect(tableMock).toHaveLength(1);
  expect(Object.keys(tableMock[0])).toHaveLength(3);
  expect(tableMock[0]).toHaveProperty(columnHeader[0]);
  expect(tableMock[0]).toHaveProperty(columnHeader[1]);
  expect(tableMock[0]).toHaveProperty(columnHeader[2]);
  expect(Object.values(tableMock[0])).toHaveLength(3);
  expect(tableMock[0].Rule).toHaveProperty('dataStream', DATA_STREAMS[0]);
  expect(tableMock[0].Rule).toHaveProperty('color', undefined);
  expect(tableMock[0].Rule).toHaveProperty('icon', undefined);
  expect(tableMock[0].Severity).toBeEmpty();
});

it('construct table with no datastream', () => {
  const tableMock = constructTableData({
    tableColumns: tableColumn,
    dataStreams: [],
    thresholds: [],
    date: new Date(),
  });

  expect(tableMock).toHaveLength(1);
  expect(Object.keys(tableMock[0])).toHaveLength(3);
  expect(tableMock[0]).toHaveProperty(columnHeader[0]);
  expect(tableMock[0]).toHaveProperty(columnHeader[1]);
  expect(tableMock[0]).toHaveProperty(columnHeader[2]);
  expect(Object.values(tableMock[0])).toHaveLength(3);
  expect(tableMock[0].Rule).toBeEmpty();
  expect(tableMock[0].Severity).toBeEmpty();
  expect(tableMock[0].Alarm).toBeEmpty();
});

it('construct table cell use latest value for threshold breach', () => {
  const tableCell = cell([ACTIVE_THRESHOLD, DISABLED_THRESHOLD], new Date(), [STREAM], STREAM.id);

  expect(tableCell.color).toEqual(DISABLED_THRESHOLD.color);

  const LATEST_POINT: DataPoint<string> = {
    x: new Date(2000, 0, 1).getTime(),
    y: 'Active',
  };
  const moreRecentDataPoint = cell(
    [ACTIVE_THRESHOLD, DISABLED_THRESHOLD],
    new Date(),
    [{ ...STREAM, data: [...STREAM.data, LATEST_POINT] }],
    STREAM.id
  );

  expect(moreRecentDataPoint.color).toEqual(ACTIVE_THRESHOLD.color);
});

it('formatLiveModeOnlyMessage with multiple sentence makes first sentence header', () => {
  const HEADER = 'Header';
  const SUB_HEADER = 'Subheader.';
  const { msgHeader, msgSubHeader } = formatLiveModeOnlyMessage(`${HEADER}. ${SUB_HEADER}`);

  expect(msgHeader).toEqual(HEADER);
  expect(msgSubHeader).toEqual(SUB_HEADER);
});

it('formatLiveModeOnlyMessage with one sentence makes it header', () => {
  const HEADER = 'Header';
  const { msgHeader, msgSubHeader } = formatLiveModeOnlyMessage(`${HEADER}`);

  expect(msgHeader).toEqual(HEADER);
  expect(msgSubHeader).toBeEmpty();
});
