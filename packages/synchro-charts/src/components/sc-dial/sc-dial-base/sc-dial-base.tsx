import { Component, h, Prop } from '@stencil/core';
import merge from 'lodash.merge';
import { DataPoint, DataStream, Primitive, ViewPortConfig } from '../../../utils/dataTypes';
import { isNumberDataStream } from '../../../utils/predicates';
import { Threshold } from '../../charts/common/types';
import { DialSizeConfig, RecursivePartial, DialMessages } from '../utils/type';
import { DefaultDialMessages } from '../utils/util';
import { DialLoading } from './sc-dial-loading';

const title = (dataStream: { detailedName?: any; name?: any } | null | false | undefined) => {
  if (dataStream) {
    return dataStream.detailedName || dataStream.name;
  }
  return null;
};

const defaultUnit = '%';

@Component({
  tag: 'sc-dial-base',
  styleUrl: 'sc-dial-base.css',
  shadow: false,
})
export class ScDialBase {
  @Prop() viewport: ViewPortConfig;
  @Prop() breachedThreshold?: Threshold;

  @Prop() alarmStream?: DataStream;

  @Prop() propertyStream?: DataStream;
  @Prop() propertyPoint?: DataPoint<Primitive>;
  @Prop() size?: DialSizeConfig;

  @Prop() messageOverrides?: RecursivePartial<DialMessages>;

  @Prop() significantDigits?: number;

  @Prop() isLoading?: boolean = false;

  private messages: DialMessages;

  componentWillLoad() {
    this.messages = merge(DefaultDialMessages, this.messageOverrides);
  }

  render() {
    const { yMin = 0, yMax = 0 } = this.viewport;
    const propertyStream = this.propertyStream && isNumberDataStream(this.propertyStream) ? this.propertyStream : null;
    const point = propertyStream ? this.propertyPoint : undefined;
    const ifShowDefaultError = !propertyStream || (point && (point.y < yMin || point.y > yMax));
    const error = this.propertyStream
      ? this.propertyStream.error || (ifShowDefaultError && this.messages.error.dataNotNumberError)
      : null;

    const percent = point ? (point.y as number) / (yMax - yMin) : 0;
    const propertyStreamUnit = propertyStream && propertyStream.unit;
    const unit = propertyStream ? propertyStreamUnit || defaultUnit : '';

    const showError = !this.isLoading && error;

    const svgContainerCssName = showError ? 'svg-height-error' : 'svg-height-no-error';

    return (
      <sc-grid-tooltip
        title={title(this.propertyStream)}
        propertyPoint={this.propertyPoint}
        alarmPoint={this.alarmStream && this.propertyPoint}
        breachedThreshold={this.breachedThreshold}
        isEnabled
      >
        <div class="sc-dialbase-container">
          <div class={svgContainerCssName}>
            {this.isLoading ? (
              <DialLoading />
            ) : (
              <sc-dial-svg
                percent={percent}
                point={point}
                breachedThreshold={this.breachedThreshold}
                stream={propertyStream}
                size={this.size}
                significantDigits={this.significantDigits}
                unit={unit}
              />
            )}
          </div>
          {showError && (
            <div class="error">
              <sc-error-badge data-testid="warning">{error}</sc-error-badge>
              {point && (
                <div class="error-message">
                  {this.messages.error.errorTimeLabel}{' '}
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
