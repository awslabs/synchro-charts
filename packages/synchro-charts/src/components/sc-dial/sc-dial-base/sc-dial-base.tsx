import { Component, h, Prop, State, Watch } from '@stencil/core';
import { DataPoint, DataStream, MinimalSizeConfig, Primitive, ViewPortConfig } from '../../../utils/dataTypes';
import { round } from '../../../utils/number';
import { isNumberDataStream } from '../../../utils/predicates';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { Threshold } from '../../charts/common/types';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { DialLoading } from './sc-dial-loading';
import { TextSizeConfig, sizeContent, StatusProgress, LengthToSize, SizeFont } from './util';

const title = (dataStream: { detailedName?: any; name?: any } | null | false) => {
  if (dataStream) {
    return dataStream.detailedName || dataStream.name;
  }
  return null;
};

const UNITMINLENGTH = 1;
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
  @Prop() size?: MinimalSizeConfig = { width: 0, height: 0 };

  @Prop() isLoading?: boolean = false;

  @State() fontSize: TextSizeConfig = sizeContent.XL;

  getColorByPercent = (percent: number): string => {
    const LEVEL1 = 0.3333;
    const LEVEL2 = 0.6667;
    let color = '';
    if (percent < LEVEL1) {
      color = StatusProgress.CRITICAL;
    } else if (percent < LEVEL2) {
      color = StatusProgress.WARNING;
    } else {
      color = StatusProgress.NORMAL;
    }
    return color;
  };

  getFontSize = (length: number): string => {
    return LengthToSize[length] || SizeFont.XS;
  };

  @Watch('propertyStream')
  getSize(newVal: DataStream) {
    const dataLength = newVal.data.length;
    const unitLength = newVal.unit?.length || UNITMINLENGTH;
    const valueLength = dataLength && newVal.data[dataLength - 1].y.toString().length;
    const textLength = valueLength + unitLength;

    this.fontSize = sizeContent[this.getFontSize(textLength)];
  }

  render() {
    const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;
    const { yMin = 0, yMax = 0 } = this.viewport;
    const propertyStream = this.propertyStream ? isNumberDataStream(this.propertyStream) && this.propertyStream : null;
    const point = propertyStream ? this.propertyPoint : null;
    const error = propertyStream ? propertyStream.error : 'Only numbers are supported';

    const percent = point ? (point.y as number) / (yMax - yMin) : 0;
    const labelColor =
      this.valueColor || (this.breachedThreshold ? this.getColorByPercent(percent) : StatusProgress.BLUE);
    const left = 760 * (1 - percent);
    const right = 760 - left;
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
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 276 276"
              data-testid="current-value"
              preserveAspectRatio="xMidYMin meet"
            >
              <circle
                cx="138"
                cy="138"
                r="121"
                stroke-width="34"
                stroke="#d9d9d9"
                fill="none"
                transform="matrix(1,0,0,-1,0,276)"
                stroke-dasharray={percent === 0 ? `${left} ${right}` : `${left - 2} ${right + 2}`}
                stroke-dashoffset="-192"
              />
              {point && right - 2 > 0 && (
                <circle
                  cx="138"
                  cy="138"
                  r="121"
                  stroke-width="34"
                  stroke={labelColor}
                  fill="none"
                  stroke-dasharray={percent === 1 ? `${right} ${left}` : `${right - 2} ${left + 2}`}
                  transform="matrix(1,0,0,1,0,0)"
                  stroke-dashoffset="190"
                />
              )}

              {point ? (
                <text x="138" y="142" font-size={this.fontSize.value} text-anchor="middle">
                  <tspan dy={stream && !stream.unit ? 0 : 10}>
                    {stream && stream.unit ? round(point?.y as number) : round(percent * 100)}
                    <tspan font-size={this.fontSize.unit}>{(stream && stream.unit) || '%'}</tspan>
                  </tspan>
                </text>
              ) : (
                <text
                  x="138"
                  y="140"
                  font-size={this.fontSize.value}
                  text-anchor="middle"
                  fill={StatusProgress.SECONDARYTEXT}
                >
                  <tspan dy={stream && point && !stream.unit ? 0 : 10}>{NO_VALUE_PRESENT}</tspan>
                </text>
              )}

              {stream && point && !stream.unit ? (
                <text
                  x={icon ? '152' : '140'}
                  y="184"
                  font-size={this.fontSize.label}
                  text-anchor="middle"
                  fill={icon ? labelColor : StatusProgress.PRIMARYTEXT}
                >
                  {!icon ? 'Medium' : this.breachedThreshold?.value}
                </text>
              ) : null}
              {stream && !stream.unit && icon && (
                <g transform="matrix(1,0,0,1,58,158)">{getIcons(icon, labelColor, this.fontSize.alarm)}</g>
              )}
            </svg>
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
