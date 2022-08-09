import { Component, h, Prop } from '@stencil/core';
import { NO_VALUE_PRESENT } from '../../../constants';
import { DataPoint, DataStream } from '../../../utils/dataTypes';
import { round } from '../../../utils/number';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { Threshold } from '../../charts/common/types';
import { sizeConfigurations, TextSizeConfig } from './util';

@Component({
  tag: 'sc-dial-svg',
  shadow: false,
})
export class scDialSVG {
  @Prop() percent: number;
  @Prop() point?: DataPoint;
  @Prop() breachedThreshold: Threshold;
  @Prop() stream?: DataStream | null;
  @Prop() fontSize: TextSizeConfig;

  render() {
    const R = 138;
    const r = 104;
    const perimeter = 2 * Math.PI * r;
    const left = perimeter * (1 - this.percent);
    const right = perimeter - left;
    const labelColor = this.breachedThreshold?.color || sizeConfigurations.BLUE;
    const label = this.breachedThreshold?.label?.show ? this.breachedThreshold?.label?.text : '';
    const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 276 276"
        data-testid="current-value"
        preserveAspectRatio="xMidYMin meet"
      >
        <circle
          cx={R}
          cy={R}
          r={r}
          stroke-width="34"
          stroke="#d9d9d9"
          fill="none"
          transform="matrix(1,0,0,-1,0,276)"
          stroke-dasharray={this.percent === 0 ? `${left} ${right}` : `${left - 2} ${right + 2}`}
          stroke-dashoffset="-167"
        />
        {this.point && right - 2 > 0 && (
          <circle
            cx={R}
            cy={R}
            r={r}
            stroke-width="34"
            stroke={labelColor}
            fill="none"
            stroke-dasharray={this.percent === 1 ? `${right} ${left}` : `${right - 2} ${left + 2}`}
            transform="matrix(1,0,0,1,0,0)"
            stroke-dashoffset="165"
          />
        )}

        {this.point ? (
          <text x="138" y="142" font-size={this.fontSize.value} font-weight="bold" text-anchor="middle">
            <tspan dy={this.stream && !this.stream.unit ? 0 : 10}>
              {this.stream && this.stream.unit ? round(this.point?.y as number) : round(this.percent * 100)}
              <tspan font-size={this.fontSize.unit}>{(this.stream && this.stream.unit) || '%'}</tspan>
            </tspan>
          </text>
        ) : (
          <text
            x="138"
            y="140"
            font-size={this.fontSize.value}
            font-weight="bold"
            text-anchor="middle"
            fill={sizeConfigurations.SECONDARYTEXT}
          >
            <tspan dy={this.stream && !this.stream.unit ? 0 : 10}>{NO_VALUE_PRESENT}</tspan>
          </text>
        )}

        {this.stream && !this.stream.unit && !this.breachedThreshold ? (
          <text
            x="138"
            y="173"
            font-weight="bold"
            font-size={this.fontSize.label}
            text-anchor="middle"
            fill={sizeConfigurations.PRIMARYTEXT}
          >
            Medium
          </text>
        ) : null}

        {this.stream && !this.stream.unit && this.breachedThreshold && label && (
          <g transform="matrix(1,0,0,1,78,162)">
            <text
              x="25"
              y="17"
              font-size={this.fontSize.label}
              font-weight="bold"
              textLength="80"
              lengthAdjust="spacing"
              fill={labelColor || sizeConfigurations.PRIMARYTEXT}
            >
              {label}
            </text>
            {icon && getIcons(icon, labelColor, this.fontSize.alarm)}
          </g>
        )}
      </svg>
    );
  }
}
