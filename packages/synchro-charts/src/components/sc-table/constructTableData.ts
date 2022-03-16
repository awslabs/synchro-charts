import { Cell, DataStream, TableColumn } from '../../utils/dataTypes';
import { breachedThreshold } from '../charts/common/annotations/breachedThreshold';
import { Threshold } from '../charts/common/types';
import { StatusIcon } from '../charts/common/constants';
import { getDataPoints } from '../../utils/getDataPoints';

export interface DisplayCell {
  error?: string;
  isLoading?: boolean;
  content?: string;
  color?: string;
  icon?: StatusIcon;
}

// A collection of cells across each column header
export interface Row {
  [columnHeader: string]: DisplayCell | undefined;
}

const getDataStreamIdFromCell = (cell: Cell): string | undefined => {
  if (typeof cell === 'string') {
    return cell;
  }
  return cell != null && 'dataStreamId' in cell ? cell.dataStreamId : undefined;
};

const getValueFromCell = (cell: Cell, dataStreams: DataStream[]): number | string | undefined => {
  const dataStreamId = getDataStreamIdFromCell(cell);
  if (dataStreamId != null) {
    const stream = dataStreams.find(({ id }) => id === dataStreamId);
    const points = stream ? getDataPoints(stream, stream.resolution) : [];
    return points[points.length - 1] && points[points.length - 1].y;
  }
  return typeof cell === 'object' && 'content' in cell ? cell.content : undefined;
};

export const getDisplayCell = (
  thresholds: Threshold[],
  date: Date,
  dataStreams: DataStream[],
  cell: Cell
): DisplayCell => {
  const value = getValueFromCell(cell, dataStreams);
  const dataStreamId = getDataStreamIdFromCell(cell);
  const dataStream = dataStreams.find(({ id }) => dataStreamId === id);

  const threshold =
    dataStream &&
    breachedThreshold({
      value,
      date,
      dataStreams,
      dataStream,
      thresholds,
    });

  const { color, icon } = threshold || {};
  return {
    content: value != null ? value.toString() : undefined,
    color,
    icon,
    error: dataStream != null ? dataStream.error : undefined,
    isLoading: dataStream != null ? dataStream.isLoading : undefined,
  };
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
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const row: Row = {};
    tableColumns.forEach(column => {
      row[column.header] = getDisplayCell(thresholds, date, dataStreams, column.rows[rowIndex]);
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
