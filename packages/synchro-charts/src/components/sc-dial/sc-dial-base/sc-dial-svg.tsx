import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import { easeCubicInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import { arc, DefaultArcObject } from 'd3-shape';
import { transition } from 'd3-transition';
import { NO_VALUE_PRESENT } from '../../../constants';
import { DataPoint, DataStream } from '../../../utils/dataTypes';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { Threshold } from '../../charts/common/types';
import { AngleDefault, DialSizeConfig } from '../utils/type';
import { ColorConfigurations } from '../utils/util';

const FONT_SIZE = 48;
const ICON_SIZE = 24;
const LABEL_SIZE = 24;
const UNIT_SIZE = 24;
const DIAL_THICKNESS = 34;
const DIAMETER = 138;
const RADIAN = Math.PI / 180;
const DURATION = 1000;
const CORNER_RADIUS = 4;
const SPACE = 4;
@Component({
  tag: 'sc-dial-svg',
  shadow: false,
})
export class ScDialSvg {
  @Element() el: SVGGraphicsElement;
  @Prop() percent: number;
  @Prop() value: number | string;
  @Prop() point?: DataPoint;
  @Prop() breachedThreshold: Threshold;
  @Prop() stream?: DataStream | null;
  @Prop() size?: DialSizeConfig;
  @Prop() unit: string;
  @Prop() isLoading: boolean;
  @Prop() loadingText: string;

  @State() sizeConfig: DialSizeConfig;

  @State() labelBottomMiddleX: number = 0;

  @State() iconLeftTopX: number = 0;
  @State() iconLeftTopY: number = 0;

  @State() label: string;
  @State() showLabel: boolean = false;

  @State() defaultRing: string = '';
  @State() colorRing: string = '';

  sizeChanged: boolean = false;

  oldColorAngle: AngleDefault = {
    startAngle: 0,
    endAngle: 0,
  };

  oldDefaultAngle: AngleDefault = {
    startAngle: 0,
    endAngle: 0,
  };

  componentWillLoad() {
    this.onSizeChanged(this.size);
    this.onBreachedThresholdChanged(this.breachedThreshold);
    this.changeRing();
  }

  componentDidLoad() {
    this.positionLabelAndIcon();
  }

  componentDidUpdate() {
    if (this.sizeChanged) {
      this.positionLabelAndIcon();
    }
  }

  @Watch('breachedThreshold')
  onBreachedThresholdChanged(newBreachedThreshold?: Threshold) {
    this.label = newBreachedThreshold?.label?.show ? newBreachedThreshold?.label?.text : '';
    this.showLabel = !!(this.stream && !this.stream.unit && this.breachedThreshold && this.label);
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
    this.sizeChanged = true;
  }

  @Watch('percent')
  onPercentsChanged() {
    this.changeRing();
  }

  changeRing() {
    const ringD: DefaultArcObject = {
      innerRadius: DIAMETER,
      outerRadius: DIAMETER - this.sizeConfig.dialThickness,
      padAngle: RADIAN / 2,
      startAngle: 0,
      endAngle: 0,
    };
    const unitRadian = Math.PI * 2;
    const percent = this.percent < 0 ? 0 : this.percent;
    const angle1 = unitRadian * percent;
    const angle2 = unitRadian * (1 - percent);
    const currentAngle = 0;
    const endAngle1 = currentAngle + angle1;
    const endAngle2 = endAngle1 + angle2;

    const colorArc = arc()
      .cornerRadius(CORNER_RADIUS)
      .startAngle(currentAngle)
      .endAngle(endAngle1);
    const defaultArc = arc()
      .cornerRadius(CORNER_RADIUS)
      .startAngle(endAngle2)
      .endAngle(endAngle1);

    transition()
      .duration(DURATION)
      .ease(easeCubicInOut)
      .attrTween('d', () => {
        const endAngleColor = colorArc.endAngle()(ringD);
        const startAngleColor = colorArc.startAngle()(ringD);

        const endAngleDefault = defaultArc.endAngle()(ringD);
        const startAngleDefault = defaultArc.startAngle()(ringD);

        const interpolateColor = interpolate(
          { startAngle: this.oldColorAngle.startAngle, endAngle: this.oldColorAngle.endAngle },
          { startAngle: startAngleColor, endAngle: endAngleColor }
        );

        const interpolateDefault = interpolate(
          { startAngle: this.oldDefaultAngle.startAngle, endAngle: this.oldDefaultAngle.endAngle },
          { startAngle: startAngleColor, endAngle: endAngleColor }
        );

        this.oldColorAngle.startAngle = startAngleColor;
        this.oldColorAngle.endAngle = endAngleColor;

        this.oldDefaultAngle.startAngle = startAngleDefault;
        this.oldDefaultAngle.endAngle = endAngleDefault;

        return t => {
          if (percent > 0) {
            this.colorRing = colorArc.endAngle(interpolateColor(t).endAngle)(ringD) || '';
          }
          this.defaultRing = defaultArc.endAngle(interpolateDefault(t).endAngle)(ringD) || '';
          return t;
        };
      });
  }

  positionLabelAndIcon() {
    if (this.showLabel) {
      this.sizeChanged = false;
      const DEFAULT = 0;
      const textLabel = this.el.querySelectorAll('text');
      const textLabelLength = textLabel ? textLabel.length : 0;
      const label = textLabel[textLabelLength - 1];
      const labelWidth = (label?.getBBox && label?.getBBox().width) || DEFAULT;
      const labelHeight = (label?.getBBox && label?.getBBox().height) || DEFAULT;
      const labelY = (label?.getBBox && label?.getBBox().y) || DEFAULT;

      this.labelBottomMiddleX = DIAMETER + (this.sizeConfig.iconSize - labelWidth) / 2;
      this.iconLeftTopX = DIAMETER - (this.sizeConfig.iconSize + labelWidth) / 2;
      this.iconLeftTopY = labelY - (this.sizeConfig.iconSize - labelHeight) / 2;
    }
  }

  render() {
    const r = DIAMETER - this.sizeConfig?.dialThickness / 2;

    const labelColor = this.breachedThreshold?.color || ColorConfigurations.BLUE;
    const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;

    // Center coordinates
    const circleX = DIAMETER;
    const circleY = DIAMETER;

    // Offset Center Y to center of value
    const valueOffsetY = this.sizeConfig?.fontSize / 4;

    const valueBottomMiddleX = circleX;
    const valueBottomMiddleY = circleY + ((this.stream && this.stream.detailedName) || this.label ? 0 : valueOffsetY);

    // Label bottom Y coordinate (The y-coordinate of the text tag is at the bottom of the font)
    const labelBottomMiddleY = DIAMETER + r / 2;

    const showDetailedName = this.stream && !this.stream.unit && this.point && !this.breachedThreshold;

    return (
      <fragment>
        {this.isLoading ? (
          <sc-dial-loading
            diameter={DIAMETER}
            strokeWidth={this.sizeConfig.dialThickness}
            labelSize={this.sizeConfig.labelSize}
            iconSize={this.sizeConfig.iconSize}
            loadingText={this.loadingText}
          />
        ) : (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 276 276"
            data-testid="current-value"
            preserveAspectRatio="xMidYMin meet"
          >
            <g transform={`matrix(1,0,0,1,${DIAMETER},${DIAMETER})`}>
              <path
                d={this.defaultRing}
                fill={ColorConfigurations.GRAY}
                stroke={ColorConfigurations.WHITE}
                stroke-linejoin="round"
              />
              <path d={this.colorRing} fill={labelColor} stroke={ColorConfigurations.WHITE} stroke-linejoin="round" />
            </g>
            {this.point ? (
              <text
                x={valueBottomMiddleX}
                y={valueBottomMiddleY}
                font-size={this.size?.fontSize}
                font-weight="bold"
                text-anchor="middle"
              >
                <tspan>
                  {this.value}
                  <tspan font-size={this.size?.unitSize} dx={SPACE}>
                    {this.unit}
                  </tspan>
                </tspan>
              </text>
            ) : (
              <text
                x={valueBottomMiddleX}
                y={valueBottomMiddleY}
                font-size={this.size?.fontSize}
                font-weight="bold"
                text-anchor="middle"
                fill={ColorConfigurations.SECONDARYTEXT}
              >
                {NO_VALUE_PRESENT}
              </text>
            )}
            {showDetailedName ? (
              <text
                x={circleX}
                y={labelBottomMiddleY}
                font-weight="bold"
                font-size={this.size?.labelSize}
                text-anchor="middle"
                fill={ColorConfigurations.PRIMARYTEXT}
              >
                {this.stream?.detailedName}
              </text>
            ) : null}
            {this.showLabel && (
              <text
                x={this.labelBottomMiddleX}
                y={labelBottomMiddleY}
                font-size={this.size?.labelSize}
                font-weight="bold"
                text-anchor="start"
                fill={labelColor || ColorConfigurations.PRIMARYTEXT}
              >
                {this.label}
              </text>
            )}
            {this.showLabel && (
              <g transform={`matrix(1,0,0,1,${this.iconLeftTopX},${this.iconLeftTopY})`}>
                {icon && getIcons(icon, labelColor, this.size?.iconSize)}
              </g>
            )}
          </svg>
        )}
      </fragment>
    );
  }
}
