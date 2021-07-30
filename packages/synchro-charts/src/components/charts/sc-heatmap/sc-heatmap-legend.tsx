import { Component, h, Prop, State } from '@stencil/core';
import { LegendConfig } from '../common/types';
import { LEGEND_POSITION } from '../common/constants';
import { DataStream, STREAM_ICON_STROKE_WIDTH } from '../../../utils/dataTypes';
import { COLOR_PALETTE } from './heatmapMesh';

// Styling to control the height of the gap between the stream-name and the unit
// const EDIT_MODE_STYLE: StencilCSSProperty = {
//   top: '-2px',
// };
// const VIEW_MODE_STYLE: StencilCSSProperty = {
//   top: '-8px',
// };

@Component({
  tag: 'sc-heatmap-legend',
  styleUrl: './sc-heatmap-legend.css',
  shadow: false,
})
export class ScLegend {
  @Prop() config!: LegendConfig;
  @Prop() dataStreams!: DataStream[];
  @Prop() updateDataStreamName!: ({ streamId, name }: { streamId: string; name: string }) => void;
  @Prop() isEditing: boolean = false;
  @Prop() supportString: boolean;
  @State() streamId: string = '';

  updateName = (name: string) => {
    this.updateDataStreamName({
      streamId: this.streamId,
      name,
    });
  };

  componentToHex = (color: number) => {
    const hex = color.toString(16).split('.')[0];
    if (hex === '0') {
      return '00';
    }
    return hex.length === 1 ? `0${hex}` : hex;
  };

  rgbToHex(r: number, g: number, b: number) {
    console.log(`#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`);
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  render() {
    this.config.position = LEGEND_POSITION.BOTTOM;
    console.log('heatmap legend');
    console.log(
      `0: #${this.componentToHex(COLOR_PALETTE.r[0])}${this.componentToHex(COLOR_PALETTE.g[0])}${this.componentToHex(
        COLOR_PALETTE.b[0]
      )}`
    );
    console.log(
      `1: #${this.componentToHex(COLOR_PALETTE.r[1])}${this.componentToHex(COLOR_PALETTE.g[1])}${this.componentToHex(
        COLOR_PALETTE.b[1]
      )}`
    );

    console.log(
      `2: #${this.componentToHex(COLOR_PALETTE.r[2])}${this.componentToHex(COLOR_PALETTE.g[2])}${this.componentToHex(
        COLOR_PALETTE.b[2]
      )}`
    );

    console.log(
      `3: #${this.componentToHex(COLOR_PALETTE.r[3])}${this.componentToHex(COLOR_PALETTE.g[4])}${this.componentToHex(
        COLOR_PALETTE.b[3]
      )}`
    );
    console.log(
      `4: #${this.componentToHex(COLOR_PALETTE.r[4])}${this.componentToHex(COLOR_PALETTE.g[4])}${this.componentToHex(
        COLOR_PALETTE.b[4]
      )}`
    );
    console.log(
      `1: #${this.componentToHex(COLOR_PALETTE.r[1])}${this.componentToHex(COLOR_PALETTE.g[1])}${this.componentToHex(
        COLOR_PALETTE.b[1]
      )}`
    );

    console.log(
      `2: #${this.componentToHex(COLOR_PALETTE.r[2])}${this.componentToHex(COLOR_PALETTE.g[2])}${this.componentToHex(
        COLOR_PALETTE.b[2]
      )}`
    );

    console.log(
      `3: #${this.componentToHex(COLOR_PALETTE.r[3])}${this.componentToHex(COLOR_PALETTE.g[4])}${this.componentToHex(
        COLOR_PALETTE.b[3]
      )}`
    );
    console.log(
      `4: #${this.componentToHex(COLOR_PALETTE.r[4])}${this.componentToHex(COLOR_PALETTE.g[4])}${this.componentToHex(
        COLOR_PALETTE.b[4]
      )}`
    );

    return (
      <div class="legend-container" style={{ flexDirection: 'unset' }}>
        <div class="legend-row-container awsui">
          <svg class="bar">
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[0], COLOR_PALETTE.g[0], COLOR_PALETTE.b[0])}
              stroke-dasharray=""
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 2 2 H 25"
            />
          </svg>
          <svg class="bar">
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[1], COLOR_PALETTE.g[1], COLOR_PALETTE.b[1])}
              stroke-dasharray=""
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 2 2 H 25"
            />
          </svg>
          <svg class="bar">
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[2], COLOR_PALETTE.g[2], COLOR_PALETTE.b[2])}
              stroke-dasharray=""
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 2 2 H 25"
            />
          </svg>
          <svg class="bar">
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[3], COLOR_PALETTE.g[3], COLOR_PALETTE.b[4])}
              stroke-dasharray=""
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 2 2 H 25"
            />
          </svg>
          <svg class="bar">
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[4], COLOR_PALETTE.g[4], COLOR_PALETTE.b[5])}
              stroke-dasharray=""
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 2 2 H 25"
            />
          </svg>
          <svg class="bar">
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[5], COLOR_PALETTE.g[5], COLOR_PALETTE.b[5])}
              stroke-dasharray=""
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 2 2 H 25"
            />
          </svg>
          <svg class="bar">
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[6], COLOR_PALETTE.g[6], COLOR_PALETTE.b[6])}
              stroke-dasharray=""
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 2 2 H 25"
            />
          </svg>
          <svg class="bar">
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[7], COLOR_PALETTE.g[7], COLOR_PALETTE.b[7])}
              stroke-dasharray=""
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 2 2 H 25"
            />
          </svg>
        </div>
      </div>
    );
  }
}
