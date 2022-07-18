import { Component, h, Prop } from '@stencil/core';
import { DataPoint, DataStream, Primitive, ViewPortConfig } from '../../../utils/dataTypes';
import { round } from '../../../utils/number';
import { isNumberDataStream } from '../../../utils/predicates';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { Threshold } from '../../charts/common/types';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { sizeContent, StatusProgress } from './util';

const MINI_FONT_SIZE = 32;

@Component({
  tag: 'sc-dial-base',
  styleUrl: 'sc-dial-base.css',
  shadow: true,
})
export class ScDialBase {
  @Prop() viewport: ViewPortConfig;
  @Prop() breachedThreshold?: Threshold;
  @Prop() valueColor?: string; // css color string

  @Prop() alarmStream?: DataStream;

  @Prop() propertyStream?: DataStream;
  @Prop() propertyPoint?: DataPoint<Primitive>;

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

    return (
      <div class="sc-dialbase-container">
        <div class={{ main: true, large: false }}>
          {this.isLoading ? (
            <div
              class={{ main: true, large: false }}
              style={{ height: `${MINI_FONT_SIZE}px`, width: `${MINI_FONT_SIZE}px` }}
            >
              <svg width="276" height="276" viewBox="0 0 276 276">
                <symbol id="sym-octagon" stroke="black" viewBox="0 0 200 200">
                  <defs>
                    <clipPath id="a">
                      <path d="M200 100a100 100 0 11-2.19-20.79l-9.78 2.08A90 90 0 10190 100z" />
                    </clipPath>
                    <filter id="b" x="0" y="0">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                    </filter>
                    <path id="c" d="M250 100a150 150 0 01-3.28 31.19L100 100z" />
                  </defs>
                  <g clip-path="url(#a)">
                    <g filter="url(#b)" transform="rotate(-6 100 100)">
                      <use xlinkHref="#c" fill-opacity="0" />
                      <use xlinkHref="#c" fill-opacity=".03" transform="rotate(12 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".07" transform="rotate(24 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".1" transform="rotate(36 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".14" transform="rotate(48 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".17" transform="rotate(60 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".2" transform="rotate(72 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".24" transform="rotate(84 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".28" transform="rotate(96 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".31" transform="rotate(108 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".34" transform="rotate(120 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".38" transform="rotate(132 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".41" transform="rotate(144 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".45" transform="rotate(156 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".48" transform="rotate(168 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".52" transform="rotate(180 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".55" transform="rotate(192 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".59" transform="rotate(204 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".62" transform="rotate(216 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".66" transform="rotate(228 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".69" transform="rotate(240 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".7" transform="rotate(252 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".72" transform="rotate(264 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".76" transform="rotate(276 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".79" transform="rotate(288 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".83" transform="rotate(300 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".86" transform="rotate(312 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".93" transform="rotate(324 100 100)" />
                      <use xlinkHref="#c" fill-opacity=".97" transform="rotate(336 100 100)" />
                      <use xlinkHref="#c" transform="rotate(348 100 100)" />
                    </g>
                  </g>
                </symbol>
                <circle cx="138" cy="138" r="121" stroke-width="34" stroke="#d9d9d9" fill="none" />
                <use xlinkHref="#sym-octagon" width="24" height="24" x="80" y="122">
                  <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="rotate"
                    from="0 92 134"
                    to="360 92 134"
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                </use>

                <text x="160" y="140" font-size="20" text-anchor="middle">
                  Loading
                </text>
              </svg>
            </div>
          ) : (
            <div class="sc-dial-container">
              <svg width="276" height="276" viewBox="0 0 276 276">
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
      </div>
    );
  }
}
