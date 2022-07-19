import { Component, h, Prop } from '@stencil/core';
import { DataPoint, DataStream, MinimalSizeConfig, Primitive, ViewPortConfig } from '../../../utils/dataTypes';
import { round } from '../../../utils/number';
import { isNumberDataStream } from '../../../utils/predicates';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { Threshold } from '../../charts/common/types';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { DialLoading } from './sc-dial-loading';
import { sizeContent, StatusProgress } from './util';

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

  getColorByPercent = (percent: number) => {
    // eslint-disable-next-line no-nested-ternary
    return percent < 0.3333
      ? StatusProgress.CRITICAL
      : percent < 0.6667
      ? StatusProgress.WARNING
      : StatusProgress.NORMAL;
  };

  render() {
    const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;
    const { yMin = 0, yMax = 0 } = this.viewport;
    const propertyStream = this.propertyStream ? isNumberDataStream(this.propertyStream) && this.propertyStream : null;
    const point = propertyStream ? this.propertyPoint : null;
    const error = propertyStream ? propertyStream.error : 'Only numbers are supported';

    const percent = point ? (point.y as number) / (yMax - yMin) : 0;
    const labelColor = this.valueColor || this.getColorByPercent(percent);
    const left = 760 * (1 - percent);
    const right = 760 - left;
    const stream = propertyStream;
    const size = sizeContent.XL;
    const width = `${(this.size?.width || 0) - (this.size?.marginLeft || 0) - (this.size?.marginRight || 0)}px`;
    const height = `${(this.size?.height || 0) - (this.size?.marginTop || 0) - (this.size?.marginBottom || 0)}px`;

    return (
      <div class="sc-dialbase-container" style={{ height: `${this.size?.height}px`, width: `${this.size?.width}px` }}>
        {this.isLoading ? (
          <div style={{ height, width }}>
            <DialLoading />
          </div>
        ) : (
          <div style={{ height, width }}>
            <svg viewBox="0 0 276 276">
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
              {point && (
                <circle
                  cx="138"
                  cy="138"
                  r="121"
                  stroke-width="34"
                  stroke={labelColor || StatusProgress.BLUE}
                  fill="none"
                  stroke-dasharray={percent === 1 ? `${right} ${left}` : `${right - 2} ${left + 2}`}
                  transform="matrix(1,0,0,1,0,0)"
                  stroke-dashoffset="190"
                />
              )}

              {point ? (
                <text x="142" y="140" font-size={size.value} text-anchor="middle">
                  <tspan dy={stream && !stream.unit ? 0 : 10}>
                    {stream && stream.unit ? round(point?.y as number) : round(percent * 100)}
                    <tspan font-size={size.unit}>{(stream && stream.unit) || '%'}</tspan>
                  </tspan>
                </text>
              ) : (
                <text x="138" y="140" font-size={size.value} text-anchor="middle" fill={StatusProgress.SECONDARYTEXT}>
                  <tspan dy={stream && !stream.unit ? 0 : 10}>{NO_VALUE_PRESENT}</tspan>
                </text>
              )}

              {stream && !stream.unit ? (
                <text
                  x={icon ? '152' : '140'}
                  y="184"
                  font-size={size.label}
                  text-anchor="middle"
                  fill={icon ? labelColor : StatusProgress.PRIMARYTEXT}
                >
                  {!icon ? 'Medium' : this.breachedThreshold?.value}
                </text>
              ) : null}
              {stream && !stream.unit && icon && (
                <g transform="matrix(1,0,0,1,58,158)">{getIcons(icon, labelColor, size.alarm)}</g>
              )}
            </svg>
          </div>
        )}
        {error != null && <sc-error-badge data-testid="warning">{error}</sc-error-badge>}
      </div>
    );
  }
}
