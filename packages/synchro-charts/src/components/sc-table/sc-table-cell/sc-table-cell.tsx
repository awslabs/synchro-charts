import { Component, h, Prop } from '@stencil/core';
import { Value } from '../../value/Value';
import { Cell } from '../constructTableData';
import { StatusIcon } from '../../charts/common/constants';
import { Primitive } from '../../../utils/dataTypes';
import { getDataPoints } from '../../../utils/getDataPoints';

@Component({
  tag: 'sc-table-cell',
  shadow: false,
})
export class ScTableCell {
  @Prop() cell!: Cell | undefined;

  /**
   * Return the most recent value from the data stream present.
   *
   * If no such value exists, returns `undefined`.
   */
  value = (): Primitive | undefined => {
    const { dataStream = undefined } = this.cell || {};

    const points = dataStream ? getDataPoints(dataStream, dataStream.resolution) : [];

    if (points.length === 0) {
      return undefined;
    }

    // data is sorted chronological, from old to more recent - making this the latest value.
    return points[points.length - 1].y;
  };

  render() {
    const { dataStream = undefined, color = undefined, icon = undefined } = this.cell || {};
    const error = dataStream && dataStream.error;
    const isLoading = dataStream && dataStream.isLoading;

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
      this.cell &&
      this.cell.dataStream && (
        <span style={{ color: color || 'unset', display: 'flex' }}>
          {icon && <sc-chart-icon name={icon} />}
          <Value value={this.value()} />
        </span>
      )
    );
  }
}
