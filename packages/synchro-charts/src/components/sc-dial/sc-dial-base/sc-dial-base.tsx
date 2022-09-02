import { Component, h, Prop } from '@stencil/core';
import merge from 'lodash.merge';
import { DataPoint, DataStream, Primitive, ViewPortConfig } from '../../../utils/dataTypes';
import { isNumberDataStream } from '../../../utils/predicates';
import { Threshold } from '../../charts/common/types';
import { DialMessages, DialSizeConfig, OffsetForIcon, RecursivePartial } from '../type';
import { DefaultDialMessages, ColorConfigurations } from '../util';
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
  @Prop() offsetForIcon?: OffsetForIcon;

  @Prop() alarmStream?: DataStream;

  @Prop() propertyStream?: DataStream;
  @Prop() propertyPoint?: DataPoint<Primitive>;
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
    const { yMin = 0, yMax = 0 } = this.viewport;
    const propertyStream = this.propertyStream && isNumberDataStream(this.propertyStream) ? this.propertyStream : null;
    const point = propertyStream ? this.propertyPoint : undefined;
    const ifShowDefaultError = !propertyStream;
    const error = this.propertyStream
      ? this.propertyStream.error || (ifShowDefaultError && this.messages.error.dataNotNumberError)
      : null;

    const percent = point ? (point.y as number) / (yMax - yMin) : 0;
    const labelColor = this.breachedThreshold?.color || ColorConfigurations.BLUE;
    const unit = propertyStream && propertyStream.unit;
    const value = unit ? (point?.y as number) : percent * 100;
    this.unit = propertyStream ? unit || defaultUnit : '';

    const showError = !this.isLoading && error;

    return (
      <sc-grid-tooltip
        title={title(this.propertyStream)}
        propertyPoint={this.propertyPoint}
        alarmPoint={this.alarmStream && this.propertyPoint}
        breachedThreshold={this.breachedThreshold}
        unit={this.unit}
        value={value}
        color={labelColor}
        messageOverrides={this.messages.tooltip}
        isEnabled
      >
        <div class="sc-dialbase-container" style={{ height: error ? '90%' : '100%' }}>
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
              offsetForIcon={this.offsetForIcon}
              unit={this.unit}
            />
          )}
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
