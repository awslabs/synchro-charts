import { Component, h, Prop, State, Watch } from '@stencil/core';
import { NO_VALUE_PRESENT } from '../../../constants';
import { DataPoint, DataStream } from '../../../utils/dataTypes';
import { round } from '../../../utils/number';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { Threshold } from '../../charts/common/types';
import { DialSizeConfig, OffsetForIcon } from '../type';
import { sizeConfigurations } from './util';

const FONT_SIZE = 48;
const ICON_SIZE = 24;
const LABEL_SIZE = 24;
const UNIT_SIZE = 24;
const DIAL_THICKNESS = 34;
const R = 138;
const STROKE_WIDTH = 2;
@Component({
  tag: 'sc-dial-svg',
  shadow: false,
})
export class ScDialSvg {
  @Prop() percent: number;
  @Prop() point?: DataPoint;
  @Prop() breachedThreshold: Threshold;
  @Prop() stream?: DataStream | null;
  @Prop() size?: DialSizeConfig;
  @Prop() significantDigits?: number;
  @Prop() offsetForIcon?: OffsetForIcon;

  @State() path1: string;
  @State() path2: string;
  @State() path3: string;

  @State() sizeConfig: DialSizeConfig;

  componentWillLoad() {
    this.onSizeChanged(this.size);
  }

  @Watch('size')
  onSizeChanged(newSize?: DialSizeConfig) {
    this.sizeConfig = {
      fontSize: newSize?.fontSize || FONT_SIZE,
      iconSize: newSize?.iconSize || ICON_SIZE,
      dialThickness: newSize?.dialThickness || DIAL_THICKNESS,
      labelSize: newSize?.labelSize || LABEL_SIZE,
      unitSize: newSize?.unitSize || UNIT_SIZE,
    };
  }

  render() {
    const r = R - this.sizeConfig?.dialThickness / 2;

    const labelColor = this.breachedThreshold?.color || sizeConfigurations.BLUE;
    const label = this.breachedThreshold?.label?.show ? this.breachedThreshold?.label?.text : '';
    const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;
    const value = this.significantDigits
      ? (this.percent * 100).toPrecision(this.significantDigits)
      : round(this.percent * 100);

    // Center coordinates
    const circleX = R;
    const circleY = R;

    // Offset Center Y to center of value.
    const valueOffsetY = this.sizeConfig?.fontSize / 4;

    const iconHalfSize = this.sizeConfig?.iconSize / 2;
    const labelHalfSize = this.sizeConfig?.labelSize / 2;

    const valueBottomMiddleX = circleX;
    const valueBottomMiddleY = circleY + ((this.stream && this.stream.detailedName) || label ? 0 : valueOffsetY);

    // Label bottom Y coordinate (The y-coordinate of the text tag is at the bottom of the font).
    const labelBottomMiddleY = R + r / 2;
    const labelBottomMiddleX = circleX + iconHalfSize;

    const defaultIconOffsetX = this.sizeConfig?.iconSize;
    const iconOffsetX = this.offsetForIcon?.offsetX || defaultIconOffsetX;

    // Icon coordinates
    const iconCenterY = circleY - iconHalfSize;
    const iconLeftTopX = iconCenterY - iconOffsetX;
    const iconLeftTopY = labelBottomMiddleY - labelHalfSize - iconHalfSize;

    const showLabel = this.stream && !this.stream.unit && this.breachedThreshold && label;
    const showDetailedName = this.stream && !this.stream.unit && this.point && !this.breachedThreshold;

    // Get stroke-dasharray
    const perimeter = 2 * Math.PI * r;
    const fullLine = perimeter * (1 - this.percent);
    const dashLine = perimeter - fullLine;

    const circleDashOffset = R / 2 + r - 4;
    const strokeWidthHalf = STROKE_WIDTH / 2;

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
          stroke-width={this.size?.dialThickness || DIAL_THICKNESS}
          stroke="#d9d9d9"
          fill="none"
          transform="matrix(1,0,0,-1,0,276)"
          stroke-dasharray={
            this.percent === 0
              ? `${fullLine} ${dashLine}`
              : `${fullLine - strokeWidthHalf} ${dashLine + strokeWidthHalf}`
          }
          stroke-dashoffset={-circleDashOffset}
        />
        {this.point && dashLine - STROKE_WIDTH > 0 && (
          <circle
            cx={R}
            cy={R}
            r={r}
            stroke-width={this.size?.dialThickness || DIAL_THICKNESS}
            stroke={labelColor}
            fill="none"
            stroke-dasharray={
              this.percent === 1
                ? `${dashLine} ${fullLine}`
                : `${dashLine - strokeWidthHalf} ${fullLine + strokeWidthHalf}`
            }
            transform="matrix(1,0,0,1,0,0)"
            stroke-dashoffset={circleDashOffset - 1}
          />
        )}
        {this.point ? (
          <text
            x={valueBottomMiddleX}
            y={valueBottomMiddleY}
            font-size={this.sizeConfig?.fontSize}
            font-weight="bold"
            text-anchor="middle"
          >
            <tspan>
              {this.stream?.unit ? round(this.point?.y as number) : value}
              <tspan font-size={this.sizeConfig?.unitSize}>{this.stream?.unit || '%'}</tspan>
            </tspan>
          </text>
        ) : (
          <text
            x={valueBottomMiddleX}
            y={valueBottomMiddleY}
            font-size={this.sizeConfig?.fontSize}
            font-weight="bold"
            text-anchor="middle"
            fill={sizeConfigurations.SECONDARYTEXT}
          >
            {NO_VALUE_PRESENT}
          </text>
        )}

        {showDetailedName ? (
          <text
            x={circleX}
            y={labelBottomMiddleY}
            font-weight="bold"
            font-size={this.sizeConfig?.labelSize}
            text-anchor="middle"
            fill={sizeConfigurations.PRIMARYTEXT}
          >
            {this.stream?.detailedName}
          </text>
        ) : null}

        {showLabel && (
          <text
            x={labelBottomMiddleX}
            y={labelBottomMiddleY}
            font-size={this.sizeConfig?.labelSize}
            font-weight="bold"
            text-anchor="middle"
            fill={labelColor || sizeConfigurations.PRIMARYTEXT}
          >
            {label}
          </text>
        )}

        {showLabel && (
          <g transform={`matrix(1,0,0,1,${iconLeftTopX},${iconLeftTopY})`}>
            {icon && getIcons(icon, labelColor, this.sizeConfig?.iconSize)}
          </g>
        )}
      </svg>
    );
  }
}
