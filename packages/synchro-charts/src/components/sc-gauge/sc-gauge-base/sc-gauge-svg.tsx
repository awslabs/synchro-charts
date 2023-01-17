import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import { arc, DefaultArcObject } from 'd3-shape';
import { DataPoint, DataStream } from '../../../utils/dataTypes';
import { getIcons } from '../../charts/common/annotations/iconUtils';
import { Threshold } from '../../charts/common/types';
import { ColorConfigurations } from '../../common/constants';
import { NO_VALUE_PRESENT } from '../../common/terms';
import { AngleDefault } from '../../common/types';
import { GaugeSizeConfig, GuageOuterRing } from '../utils/type';
import {
  CORNER_RADIUS,
  GAUGE_THICKNESS,
  DIAMETER,
  END_RADIAN,
  FONT_SIZE,
  GAUGE_HEIGHT,
  ICON_SIZE,
  INITIAL_ANGLE,
  INITIAL_RADIAN,
  INNERRING_DIAMETER,
  LABEL_SIZE,
  OUTRING_DIAMETER,
  OUTRING_INNER_DIAMETER,
  RADIAN,
  TOTAL_ANGLE,
  UNIT_SIZE,
} from '../utils/util';

const GAUGLE_OFFSET_Y = (GAUGE_HEIGHT / 2 - (OUTRING_DIAMETER - INNERRING_DIAMETER)) / 2;
const STROKE_COLOR = ColorConfigurations.WHITE;
const DEFAULT_FONT_SIZE = 12;
// Distance from label to ring
const DISTANCE = 20;
@Component({
  tag: 'sc-gauge-svg',
  shadow: false,
})
export class ScGaugeSvg {
  @Element() el: SVGGraphicsElement;
  @Prop() percent: number;
  @Prop() value: number | string;
  @Prop() point?: DataPoint;
  @Prop() breachedThreshold: Threshold;
  @Prop() stream?: DataStream | null;
  @Prop() size?: GaugeSizeConfig;
  @Prop() significantDigits?: number;
  @Prop() unit: string;
  @Prop() outerRingRange?: GuageOuterRing[];
  @Prop() isLoading: boolean;
  @Prop() loadingText: string;

  @State() outers: any[] = [];

  @State() valueInnerRing: string;
  @State() defaultInnerRing: string;

  @State() labelBottomMiddleX: number = 0;

  @State() iconLeftTopX: number = 0;
  @State() iconLeftTopY: number = 0;

  @State() label: string;
  @State() showLabel: boolean = false;

  @State() sizeConfig: GaugeSizeConfig;

  oldColorAngle: AngleDefault = {
    startAngle: INITIAL_RADIAN,
    endAngle: END_RADIAN,
  };

  oldDefaultAngle: AngleDefault = {
    startAngle: END_RADIAN,
    endAngle: INITIAL_RADIAN,
  };

  componentWillLoad() {
    this.onSizeChanged(this.size);
    this.onBreachedThresholdChanged(this.breachedThreshold);
    this.changeRing();
    this.onOuterRingRangeChanged();
  }

  componentDidLoad() {
    this.positionLabelAndIcon();
  }

  @Watch('breachedThreshold')
  onBreachedThresholdChanged(newBreachedThreshold?: Threshold) {
    this.label = newBreachedThreshold?.label?.show ? newBreachedThreshold?.label?.text : '';
    this.showLabel = !!(this.stream && !this.stream.unit && this.breachedThreshold && this.label);
  }

  @Watch('size')
  onSizeChanged(newSize?: GaugeSizeConfig) {
    this.sizeConfig = {
      fontSize: newSize?.fontSize || FONT_SIZE,
      iconSize: newSize?.iconSize || ICON_SIZE,
      gaugeThickness: newSize?.gaugeThickness || GAUGE_THICKNESS,
      labelSize: newSize?.labelSize || LABEL_SIZE,
      unitSize: newSize?.unitSize || UNIT_SIZE,
    };
  }

  @Watch('outerRingRange')
  onOuterRingRangeChanged() {
    if (this.outerRingRange) {
      this.outers = [];
      let start = INITIAL_RADIAN;
      let end = INITIAL_RADIAN;
      let labelpositon = RADIAN;
      const ringD: DefaultArcObject = {
        innerRadius: INNERRING_DIAMETER,
        outerRadius: INNERRING_DIAMETER - this.sizeConfig.gaugeThickness,
        padAngle: RADIAN / 2,
        startAngle: 0,
        endAngle: 0,
      };
      this.outerRingRange.forEach(a => {
        end = RADIAN * a.percent * TOTAL_ANGLE + INITIAL_RADIAN;
        labelpositon = RADIAN * (INITIAL_ANGLE + a.percent * TOTAL_ANGLE);
        const arcObject = arc()
          .innerRadius(OUTRING_DIAMETER)
          .outerRadius(OUTRING_INNER_DIAMETER)
          .cornerRadius(CORNER_RADIUS)
          .padAngle(RADIAN / 2)
          .startAngle(start)
          .endAngle(end);
        const data = {
          path: arcObject(ringD),
          fill: a.color || ColorConfigurations.WHITE,
          value: a.showValue,
          x: Math.cos(labelpositon) * (OUTRING_DIAMETER + DISTANCE),
          y: Math.sin(labelpositon) * (OUTRING_DIAMETER + DISTANCE) + GAUGLE_OFFSET_Y,
        };
        this.outers.push(data);
        start = end;
      });
    }
  }

  @Watch('percent')
  onPercentsChanged() {
    this.changeRing();
  }

  changeRing() {
    const ringD: DefaultArcObject = {
      innerRadius: INNERRING_DIAMETER,
      outerRadius: INNERRING_DIAMETER - this.sizeConfig.gaugeThickness,
      padAngle: RADIAN / 2,
      startAngle: 0,
      endAngle: 0,
    };

    const unitRadian = Math.PI * 2 * (TOTAL_ANGLE / 360);
    const percent = Math.max(Math.min(this.percent, 1), 0);
    const angle1 = unitRadian * percent;
    const angle2 = unitRadian * (1 - percent);
    const currentAngle = INITIAL_RADIAN;
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

    if (percent > 0) {
      this.valueInnerRing = colorArc(ringD) || '';
    }
    this.defaultInnerRing = defaultArc(ringD) || '';
  }

  positionLabelAndIcon() {
    if (this.showLabel) {
      const DEFAULT = 0;
      const labels = this.el.querySelectorAll('text');
      const label = labels[labels.length - 1];
      const labelWidth = (label?.getBBox && label?.getBBox().width) || DEFAULT;
      const labelHeight = (label?.getBBox && label?.getBBox().height) || DEFAULT;
      const labelY = (label?.getBBox && label?.getBBox().y) || DEFAULT;

      this.labelBottomMiddleX = OUTRING_DIAMETER + (this.sizeConfig.iconSize - labelWidth) / 2;
      this.iconLeftTopX = OUTRING_DIAMETER - (this.sizeConfig.iconSize + labelWidth) / 2;
      this.iconLeftTopY = labelY - (this.sizeConfig.iconSize - labelHeight) / 2;
    }
  }

  render() {
    const labelColor = this.breachedThreshold?.color || this.stream?.color || ColorConfigurations.BLUE;
    const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;
    const valueUnitSpace = 5;

    // Center coordinates
    const circleX = OUTRING_DIAMETER;

    // Offset Center Y to center of value
    const valueOffsetY = this.sizeConfig?.fontSize / 4;

    const valueBottomMiddleX = OUTRING_DIAMETER;
    const valueBottomMiddleY =
      OUTRING_DIAMETER +
      this.sizeConfig.labelSize / 2 +
      ((this.stream && this.stream.detailedName) || this.label ? 0 : valueOffsetY);

    // Label bottom Y coordinate (The y-coordinate of the text tag is at the bottom of the font)
    const labelBottomMiddleY = OUTRING_DIAMETER + this.sizeConfig.labelSize / 2 + GAUGLE_OFFSET_Y;

    const showDetailedName = this.stream && !this.stream.unit && this.point && !this.breachedThreshold;
    return (
      <fragment>
        {this.isLoading ? (
          <sc-gauge-loading
            offsetY={GAUGLE_OFFSET_Y}
            strokeWidth={this.sizeConfig.gaugeThickness}
            labelSize={this.sizeConfig.labelSize}
            iconSize={this.sizeConfig.iconSize}
            loadingText={this.loadingText}
          />
        ) : (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 250"
            data-testid="current-value"
            preserveAspectRatio="xMidYMin meet"
          >
            <g transform={`matrix(1,0,0,1,${OUTRING_DIAMETER},${DIAMETER + GAUGLE_OFFSET_Y})`}>
              <path
                d={this.defaultInnerRing}
                fill={ColorConfigurations.GRAY}
                stroke={ColorConfigurations.WHITE}
                stroke-linejoin="round"
              />
              <path
                d={this.valueInnerRing}
                fill={labelColor}
                stroke={ColorConfigurations.WHITE}
                stroke-linejoin="round"
              />
            </g>
            <g transform={`matrix(1,0,0,1,${OUTRING_DIAMETER},${DIAMETER + GAUGLE_OFFSET_Y})`}>
              {this.outers &&
                this.outers.map(outer => (
                  <path d={outer.path} fill={outer.fill} stroke={STROKE_COLOR} stroke-width="1" />
                ))}
            </g>
            <g transform={`matrix(1,0,0,1,${DIAMETER},${DIAMETER})`}>
              {this.outers &&
                this.outers.map(outer => (
                  <text x={outer.x} y={outer.y} font-size={DEFAULT_FONT_SIZE} text-anchor="left">
                    {outer.value}
                  </text>
                ))}
            </g>

            {this.point ? (
              <text
                x={valueBottomMiddleX}
                y={valueBottomMiddleY}
                font-size={this.sizeConfig?.fontSize}
                font-weight="bold"
                text-anchor="middle"
              >
                <tspan>
                  {this.value}
                  <tspan font-size={this.sizeConfig?.unitSize} dx={valueUnitSpace}>
                    {this.unit}
                  </tspan>
                </tspan>
              </text>
            ) : (
              <text
                x={valueBottomMiddleX}
                y={valueBottomMiddleY}
                font-size={this.sizeConfig?.fontSize}
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
                font-size={this.sizeConfig?.labelSize}
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
                font-size={this.sizeConfig?.labelSize}
                font-weight="bold"
                text-anchor="start"
                fill={labelColor || ColorConfigurations.PRIMARYTEXT}
              >
                {this.label}
              </text>
            )}

            {this.showLabel && (
              <g transform={`matrix(1,0,0,1,${this.iconLeftTopX},${this.iconLeftTopY})`}>
                {icon && getIcons(icon, labelColor, this.sizeConfig?.iconSize)}
              </g>
            )}
          </svg>
        )}
      </fragment>
    );
  }
}
