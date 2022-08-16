import { Component, h, Prop } from '@stencil/core';
import { DataPoint, DataStream, DialSizeConfig, Primitive, ViewPortConfig } from '../../../utils/dataTypes';
import { isNumberDataStream } from '../../../utils/predicates';
import { Threshold } from '../../charts/common/types';
import { DialLoading } from './sc-dial-loading';
import { sizeConfigurations } from './util';

const title = (dataStream: { detailedName?: any; name?: any } | null | false) => {
  if (dataStream) {
    return dataStream.detailedName || dataStream.name;
  }
  return null;
};

@Component({
  tag: 'sc-dial-base',
  styleUrl: 'sc-dial-base.css',
  shadow: false,
})
export class ScDialBase {
  @Prop() viewport: ViewPortConfig;
  @Prop() breachedThreshold?: Threshold;
  @Prop() valueColor?: string; // css color string

  @Prop() alarmStream?: DataStream;

  @Prop() propertyStream?: DataStream;
  @Prop() propertyPoint?: DataPoint<Primitive>;
  @Prop() size?: DialSizeConfig;

  @Prop() isLoading?: boolean = false;

  render() {
    const { yMin = 0, yMax = 0 } = this.viewport;
    const propertyStream = this.propertyStream && isNumberDataStream(this.propertyStream) ? this.propertyStream : null;
    const point = propertyStream ? this.propertyPoint : undefined;
    const error = propertyStream ? propertyStream.error : 'Only numbers are supported';

    const percent = point ? (point.y as number) / (yMax - yMin) : 0;
    const labelColor = this.breachedThreshold?.color || sizeConfigurations.BLUE;
    const unit = propertyStream && propertyStream.unit;

    return (
      <sc-grid-tooltip
        title={title(propertyStream)}
        propertyPoint={this.propertyPoint}
        alarmPoint={this.alarmStream && this.propertyPoint}
        breachedThreshold={this.breachedThreshold}
        unit={unit || '%'}
        value={unit ? (point?.y as number) : percent * 100}
        color={labelColor}
        isEnabled
      >
        <div class="sc-dialbase-container" style={{ height: `${this.size?.viewport}px` }}>
          {this.isLoading ? (
            <DialLoading />
          ) : (
            <sc-dial-svg
              percent={percent}
              point={point}
              breachedThreshold={this.breachedThreshold}
              stream={propertyStream}
              size={this.size}
            />
          )}
          {error != null && (
            <div class="error">
              <sc-error-badge data-testid="warning">{error}</sc-error-badge>
              {point && (
                <div class="error-message">
                  Last value at
                  {new Date(point.x).toLocaleString('en-US', {
                    hour12: true,
                    second: 'numeric',
                    minute: 'numeric',
                    hour: 'numeric',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </sc-grid-tooltip>
    );
  }
}
