import { Component, h, Prop, State } from '@stencil/core';
import { DataPoint, DataStream, Primitive, SizeConfig, ViewPortConfig } from '../../../utils/dataTypes';
import { isNumberDataStream } from '../../../utils/predicates';
import { Threshold } from '../../charts/common/types';
import { DialLoading } from './sc-dial-loading';
import { DialSVG } from './sc-dial-svg';
import { TextSizeConfig, sizeContent, sizeConfigurations } from './util';

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
  @Prop() size?: SizeConfig & { fontSize?: string };

  @Prop() isLoading?: boolean = false;

  @State() fontSize: TextSizeConfig;

  componentWillRender() {
    this.fontSize = sizeContent[this.size?.fontSize || 'M'];
  }

  render() {
    const { yMin = 0, yMax = 0 } = this.viewport;
    const propertyStream = this.propertyStream ? isNumberDataStream(this.propertyStream) && this.propertyStream : null;
    const point = propertyStream ? this.propertyPoint : null;
    const error = propertyStream ? propertyStream.error : 'Only numbers are supported';

    const percent = point ? (point.y as number) / (yMax - yMin) : 0;
    const labelColor = this.breachedThreshold?.color || sizeConfigurations.BLUE;
    const stream = propertyStream;
    const unit = propertyStream && propertyStream.unit;

    return (
      <sc-dial-tooltip
        title={title(propertyStream)}
        propertyPoint={this.propertyPoint}
        alarmPoint={this.alarmStream && this.propertyPoint}
        breachedThreshold={this.breachedThreshold}
        unit={unit || '%'}
        value={unit ? (point?.y as number) : percent * 100}
        color={labelColor}
      >
        <div class="sc-dialbase-container">
          {this.isLoading ? (
            <DialLoading />
          ) : (
            <DialSVG
              percent={percent}
              point={point}
              breachedThreshold={this.breachedThreshold}
              stream={stream}
              fontSize={this.fontSize}
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
      </sc-dial-tooltip>
    );
  }
}
