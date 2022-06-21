import { Component, h, Prop } from '@stencil/core';
import { formatLiveModeOnlyMessage, Row } from '../constructTableData';
import { ScTableRows } from '../sc-table-row/sc-table-row';
import { DEFAULT_MESSAGE_OVERRIDES, MessageOverrides, TableColumn } from '../../../utils/dataTypes';

@Component({
  tag: 'sc-table-base',
  styleUrl: 'sc-table-base.css',
  shadow: false,
})
export class ScTableBase {
  @Prop() columns!: TableColumn[];
  @Prop() rows!: Row[];
  @Prop() isEnabled!: boolean;
  @Prop() messageOverrides!: MessageOverrides;

  render() {
    const { msgHeader, msgSubHeader } = formatLiveModeOnlyMessage(
      this.messageOverrides?.liveModeOnlyMessage ?? DEFAULT_MESSAGE_OVERRIDES.liveModeOnlyMessage
    );
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
            <ScTableRows rows={this.rows} columns={this.columns} messageOverrides={this.messageOverrides} />
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
