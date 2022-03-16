import { Component, h, Prop } from '@stencil/core';
import { Value } from '../../value/Value';
import { DisplayCell } from '../constructTableData';
import { StatusIcon } from '../../charts/common/constants';

@Component({
  tag: 'sc-table-cell',
  shadow: false,
})
export class ScTableCell {
  @Prop() cell!: DisplayCell | undefined;

  render() {
    const { content = undefined, color = undefined, icon = undefined, isLoading = false, error = undefined } =
      this.cell || {};

    if (error != null) {
      /** Error */
      // If there is an error associated with the data stream, we cannot necessarily trust what
      // the data stream is telling us - i.e. it may be stale. So even if we could display some
      // existing data, error UX takes precedence.
      return (
        <div class="error">
          <sc-chart-icon name={StatusIcon.ERROR} />
          {error}
        </div>
      );
    }

    if (isLoading) {
      /** Loading */
      // Loading is render blocking, so even if we have a value we could display, we display the spinner
      return (
        <div class="loading-wrapper">
          <sc-loading-spinner />
        </div>
      );
    }

    /** Display cell value */
    return (
      <span style={{ color: color || 'unset', display: 'flex' }}>
        {icon && <sc-chart-icon name={icon} />}
        <Value value={content} />
      </span>
    );
  }
}
