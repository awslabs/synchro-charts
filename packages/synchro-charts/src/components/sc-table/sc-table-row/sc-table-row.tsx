import { h } from '@stencil/core';
import { Row } from '../constructTableData';
import { EmptyStatus } from '../../charts/sc-webgl-base-chart/EmptyStatus';
import { MessageOverrides, TableColumn } from '../../../utils/dataTypes';

export const ScTableRows = ({
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
      {rows.map((row, j) => (
        <tr>
          {columns.map((column, i) => {
            const key = `${i}-${j}`;
            return (
              <td key={key} id={`cell-${column.header}-${i}-${j}`}>
                <sc-table-cell cell={row[column.header]} />
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
