import { Component, h, Prop } from '@stencil/core';
import merge from 'lodash.merge';
import { DataPoint, DataStream, Primitive, ViewPortConfig } from '../../../utils/dataTypes';
import { Threshold } from '../../charts/common/types';
import { RecursivePartial } from '../../common/types';
import { getData, getErrorMessage, getPoint, getPropertyStream } from '../../sc-dial/sc-dial-base/formatStream';
import { DialMessages, DialSizeConfig } from '../../sc-dial/utils/type';
import { DefaultDialMessages } from '../../sc-dial/utils/util';
import { GuageOuterRing } from '../utils/type';

const title = (dataStream: { detailedName?: any; name?: any } | null | false | undefined) => {
  if (dataStream) {
    return dataStream.detailedName || dataStream.name;
  }
  return null;
};

@Component({
  tag: 'sc-gauge-base',
  styleUrl: 'sc-gauge-base.css',
  shadow: false,
})
export class ScGaugeBase {
  @Prop() viewport: ViewPortConfig;
  @Prop() breachedThreshold?: Threshold;

  @Prop() alarmStream?: DataStream;

  @Prop() propertyStream?: DataStream;
  @Prop() propertyPoint?: DataPoint<Primitive>;
  @Prop() outerRingRange?: GuageOuterRing[];
  @Prop() size?: DialSizeConfig;

  @Prop() messageOverrides?: RecursivePartial<DialMessages>;

  @Prop() significantDigits?: number;

  @Prop() isLoading?: boolean = false;

  private messages: DialMessages;
  private unit: string;

  componentWillLoad() {
    this.messages = merge(DefaultDialMessages, this.messageOverrides);
  }

  render() {
    const point = getPoint(this.propertyPoint, this.propertyStream);
    const propertyStream = getPropertyStream(this.propertyStream);

    const error = getErrorMessage(this.viewport, this.messages.error, this.propertyStream);

    const { unit, percent, value } = getData(
      this.viewport,
      this.propertyPoint,
      this.propertyStream,
      this.significantDigits
    );

    const showError = !this.isLoading && error;

    const svgContainerCssName = showError ? 'svg-height-error' : 'svg-height-no-error';

    return (
      <sc-grid-tooltip
        title={title(this.propertyStream)}
        propertyPoint={this.propertyPoint}
        alarmPoint={this.alarmStream && this.propertyPoint}
        breachedThreshold={this.breachedThreshold}
        unit={unit}
        value={value}
        messageOverrides={this.messages.tooltip}
        isEnabled
      >
        <div class="sc-gaugebase-container">
          <div class={svgContainerCssName}>
            <sc-gauge-svg
              percent={percent}
              value={value}
              point={point}
              breachedThreshold={this.breachedThreshold}
              stream={propertyStream}
              size={this.size}
              significantDigits={this.significantDigits}
              unit={unit}
              outerRingRange={this.outerRingRange}
              isLoading={this.isLoading}
              loadingText={this.messages.loading}
            />
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
