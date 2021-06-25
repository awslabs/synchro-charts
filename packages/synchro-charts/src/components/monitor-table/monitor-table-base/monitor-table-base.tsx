import { Component, h, Prop } from '@stencil/core';
import { formatLiveModeOnlyMessage, Row } from '../constructTableData';
import { MonitorTableRows } from '../monitor-table-row/monitor-table-row';
import { MessageOverrides, TableColumn } from '../../../utils/dataTypes';

@Component({
  tag: 'monitor-table-base',
  styleUrl: 'monitor-table-base.css',
  shadow: false,
})
export class MonitorTableBase {
  @Prop() columns!: TableColumn[];
  @Prop() rows!: Row[];
  @Prop() isEnabled!: boolean;
  @Prop() liveModeOnlyMessage: string;
  @Prop() messageOverrides!: MessageOverrides;

  render() {
    const { msgHeader, msgSubHeader } = formatLiveModeOnlyMessage(this.liveModeOnlyMessage);
    return (
      <div class="awsui container">
        <table role="table">
          <thead>
            <tr>
              {this.columns.map(({ header }) => (
                <th key={header}>
                  <span class="column-header-content">{header}</span>
                </th>
              ))}
            </tr>
          </thead>

          {this.isEnabled ? (
            <MonitorTableRows rows={this.rows} columns={this.columns} messageOverrides={this.messageOverrides} />
          ) : (
            <div class="disable-status-container">
              <div class="disable-status">
                <h3>{msgHeader}</h3>
                {msgSubHeader}
              </div>
            </div>
          )}
        </table>
      </div>
    );
  }
}
