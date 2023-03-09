import { Component, h, Prop } from '@stencil/core';

/**
 *  Spinner
 *  Source SVG by Jordan Gray
 *  https://stackoverflow.com/questions/22531861/ring-shaped-process-spinner-with-fading-gradient-effect-around-the-ring
 */

@Component({
  tag: 'iot-app-kit-vis-loading-spinner',
  styleUrl: 'sc-loading-spinner.css',
  shadow: true,
})
export class ScLoadingSpinner {
  // The width and height in pixels if provided.
  @Prop() size?: number;
  @Prop() dark?: boolean;

  render() {
    const { size, dark = false } = this;
    return (
      <svg
        class={{ dark }}
        style={size != null ? { width: `${size}px`, height: `${size}px` } : {}}
        data-testid="loading"
        viewBox="0 0 200 200"
      >
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
      </svg>
    );
  }
}
