import { h } from '@stencil/core';
import { Row } from '../constructTableData';
import { EmptyStatus } from '../../charts/sc-webgl-base-chart/EmptyStatus';
import { MessageOverrides, TableColumn } from '../../../utils/dataTypes';

export const MonitorTableRows = ({
  columns,
  rows,
  messageOverrides,
}: {
  columns: TableColumn[];
  rows: Row[];
  messageOverrides: MessageOverrides;
}) => {
  return rows.length ? (
    <tbody>
      {rows.map(row => (
        <tr>
          {columns.map((column, i) => {
            const cell = row[column.header];
            const key = cell && cell.dataStream ? `${cell.dataStream.id}-${i}` : `empty-${i}`;
            return (
              <td key={key} id={`cell-${column.header}`}>
                <monitor-table-cell cell={cell} />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  ) : (
    <div class="empty-status-container">
      <EmptyStatus
        displaysNoDataPresentMsg
        messageOverrides={messageOverrides}
        isLoading={false}
        hasNoDataPresent
        hasNoDataStreamsPresent
      />
    </div>
  );
};
