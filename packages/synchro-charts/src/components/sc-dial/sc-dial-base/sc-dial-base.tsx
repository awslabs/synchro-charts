import { Component, h, Prop, State, Watch } from '@stencil/core';
import { DataPoint, DataStream, MinimalSizeConfig, Primitive, ViewPortConfig } from '../../../utils/dataTypes';
import { round } from '../../../utils/number';
import { isNumberDataStream } from '../../../utils/predicates';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { Threshold } from '../../charts/common/types';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { DialLoading } from './sc-dial-loading';
import { sizeContent, StatusProgress, TextSizeConfig } from './util';

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
  @Prop() size?: MinimalSizeConfig = { width: 0, height: 0 };

  @Prop() isLoading?: boolean = false;

  @State() fontSize: TextSizeConfig = sizeContent.XL;

  getColorByPercent = (percent: number) => {
    // eslint-disable-next-line no-nested-ternary
    return percent < 0.3333
      ? StatusProgress.CRITICAL
      : percent < 0.6667
      ? StatusProgress.WARNING
      : StatusProgress.NORMAL;
  };

  @Watch('propertyStream')
  getSize(newVal: DataStream) {
    const dataLength = newVal.data.length || 0;
    const textLength =
      dataLength && (newVal.data[dataLength - 1].y.toString().length || 0) + (newVal.unit?.length || 1);

    if (textLength >= 0 && textLength < 2) {
      this.fontSize = sizeContent.Huge;
    }
    if (textLength >= 2 && textLength < 7) {
      this.fontSize = sizeContent.XL;
    }

    if (textLength >= 7 && textLength < 9) {
      this.fontSize = sizeContent.L;
    }

    if (textLength >= 9 && textLength < 12) {
      this.fontSize = sizeContent.M;
    }

    if (textLength >= 12 && textLength < 14) {
      this.fontSize = sizeContent.S;
    }

    if (textLength >= 14) {
      this.fontSize = sizeContent.XS;
    }
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
    const width = `${(this.size?.width || 0) - (this.size?.marginLeft || 0) - (this.size?.marginRight || 0)}px`;
    const height = `${(this.size?.height || 0) - (this.size?.marginTop || 0) - (this.size?.marginBottom || 0) + 80}px`;

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
        <div
          class="sc-dialbase-container"
          style={{
            minHeight: `${this.size?.height}px`,
            width: `${this.size?.width}px`,
            marginLeft: `${this.size?.marginLeft}px`,
            marginRight: `${this.size?.marginRight}px`,
            marginTop: `${this.size?.marginTop}px`,
            marginBottom: `${this.size?.marginBottom}px`,
          }}
        >
          {this.isLoading ? (
            <div style={{ height, width }}>
              <DialLoading />
            </div>
          ) : (
            <div style={{ height, width }}>
              <svg viewBox="0 0 276 276" data-testid="current-value">
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
                    <tspan dy={stream && !stream.unit ? 0 : 10}>{NO_VALUE_PRESENT}</tspan>
                  </text>
                )}

                {stream && !stream.unit ? (
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
            </div>
          )}
          {error != null && (
            <div class="error">
              <sc-error-badge data-testid="warning">{error}</sc-error-badge>
              {point && (
                <div>
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
