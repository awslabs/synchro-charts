import { Component, h, Prop } from '@stencil/core';
import { ColorConfigurations } from '../../common/constants';

const SPACE = 4;
@Component({
  tag: 'sc-dial-loading',
  shadow: false,
})
export class ScDialLoading {
  @Prop() diameter: number;
  @Prop() strokeWidth: number;
  @Prop() iconSize: number;
  @Prop() labelSize: number;
  @Prop() loadingText: string;

  render() {
    const innerDiameter = this.diameter - this.strokeWidth / 2;
    const textBottomCenterX = innerDiameter + SPACE;
    const textBottomCenterY = this.diameter + this.iconSize / 4;

    const iconTopLeftX = innerDiameter - this.iconSize - SPACE;
    const iconTopLeftY = this.diameter - this.iconSize / 2;

    const iconAnimateTransformX = iconTopLeftX + this.iconSize / 2;
    const iconAnimateTransformY = iconTopLeftY + this.iconSize / 2;

    return (
      <svg width="100%" height="100%" viewBox="0 0 276 276" data-testid="loading" preserveAspectRatio="xMidYMin meet">
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
        <circle
          cx={this.diameter}
          cy={this.diameter}
          r={innerDiameter}
          stroke-width={this.strokeWidth}
          stroke={ColorConfigurations.GRAY}
          fill="none"
        />
        <use xlinkHref="#sym-octagon" width={this.iconSize} height={this.iconSize} x={iconTopLeftX} y={iconTopLeftY}>
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from={`0 ${iconAnimateTransformX} ${iconAnimateTransformY}`}
            to={`360 ${iconAnimateTransformX} ${iconAnimateTransformY}`}
            dur="0.6s"
            repeatCount="indefinite"
          />
        </use>
        <text x={textBottomCenterX} y={textBottomCenterY} font-size={this.labelSize} text-anchor="start">
          {this.loadingText}
        </text>
      </svg>
    );
  }
}
