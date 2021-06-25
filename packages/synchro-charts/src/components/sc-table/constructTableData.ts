import { DataStream, Primitive, TableColumn } from '../../utils/dataTypes';
import { breachedThreshold } from '../charts/common/annotations/breachedThreshold';
import { Threshold } from '../charts/common/types';
import { StatusIcon } from '../charts/common/constants';

export interface Cell {
  dataStream?: DataStream<Primitive>;
  color?: string;
  icon?: StatusIcon;
}

// A collection of cells across each column header
export interface Row {
  [columnHeader: string]: Cell | undefined;
}

export const cell = (
  thresholds: Threshold[],
  date: Date,
  dataStreams: DataStream[],
  dataStreamId: string | undefined
): Cell => {
  const stream = dataStreams.find(({ id }) => id === dataStreamId);
  const value = stream && stream.data[stream.data.length - 1] && stream.data[stream.data.length - 1].y;

  const threshold =
    stream &&
    breachedThreshold({
      value,
      date,
      dataStreams,
      dataStream: stream,
      thresholds,
    });

  const { color, icon } = threshold || {};
  return { dataStream: stream, color, icon };
};

/**
 * Given the business models, output the view model representation of a table row.
 */
export const constructTableData = ({
  tableColumns,
  dataStreams,
  thresholds,
  date,
}: {
  tableColumns: TableColumn[];
  dataStreams: DataStream[];
  thresholds: Threshold[];
  date: Date;
}): Row[] => {
  const numRows = Math.max(...tableColumns.map(({ rows }) => rows.length));
  const table: Row[] = [];

  // eslint-disable-next-line no-plusplus
  for (let r = 0; r < numRows; r++) {
    const row: Row = {};
    tableColumns.forEach(column => {
      const dataStreamId = column.rows[r] || undefined;
      row[column.header] = cell(thresholds, date, dataStreams, dataStreamId);
    });
    table.push(row);
  }

  return table;
};

/**
 * Format liveModeOnlyMessage for Table disable State display
 */

export const formatLiveModeOnlyMessage = (liveModeOnlyMessage: string): { msgHeader: string; msgSubHeader: string } => {
  const splitIndex = liveModeOnlyMessage.indexOf('. ');
  if (splitIndex < 0) {
    return { msgHeader: liveModeOnlyMessage, msgSubHeader: '' };
  }
  const msgHeader = liveModeOnlyMessage.slice(0, splitIndex);
  const msgSubHeader = liveModeOnlyMessage.slice(splitIndex + 2);
  return { msgHeader, msgSubHeader };
};
