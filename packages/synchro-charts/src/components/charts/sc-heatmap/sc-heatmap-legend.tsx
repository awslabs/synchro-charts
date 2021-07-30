import { Component, h, Prop, State } from '@stencil/core';
import { LegendConfig } from '../common/types';
import { LEGEND_POSITION } from '../common/constants';
import { DataStream, STREAM_ICON_STROKE_WIDTH, ViewPort } from '../../../utils/dataTypes';
import { COLOR_PALETTE } from './heatmapMesh';
import { calcHeatValues, getXBucketRange } from './heatmapUtil';
import { BUCKET_COUNT } from './heatmapConstants';

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
  @Prop() viewport: ViewPort;
  @Prop() dataStreams!: DataStream[];
  @Prop() updateDataStreamName!: ({ streamId, name }: { streamId: string; name: string }) => void;
  @Prop() isEditing: boolean = false;
  @Prop() isLoading: boolean;
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
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  getLegendBars = () => {
    return (
      <div>
        <svg class="bar">
          <g>
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[0], COLOR_PALETTE.g[0], COLOR_PALETTE.b[0])}
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 0 0 H 240"
            />
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[1], COLOR_PALETTE.g[1], COLOR_PALETTE.b[1])}
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 30 0 H 240"
            />
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[2], COLOR_PALETTE.g[2], COLOR_PALETTE.b[2])}
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 60 0 H 240"
            />
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[3], COLOR_PALETTE.g[3], COLOR_PALETTE.b[3])}
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 90 0 H 240"
            />
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[4], COLOR_PALETTE.g[4], COLOR_PALETTE.b[4])}
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 120 0 H 240"
            />
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[5], COLOR_PALETTE.g[5], COLOR_PALETTE.b[5])}
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 150 0 H 240"
            />
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[6], COLOR_PALETTE.g[6], COLOR_PALETTE.b[6])}
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 180 0 H 240"
            />
            <path
              stroke={this.rgbToHex(COLOR_PALETTE.r[7], COLOR_PALETTE.g[7], COLOR_PALETTE.b[7])}
              stroke-linecap="square"
              stroke-width={STREAM_ICON_STROKE_WIDTH * 4}
              d="M 210 0 H 240"
            />
          </g>
        </svg>
      </div>
    );
  };

  render() {
    this.config.position = LEGEND_POSITION.BOTTOM;
    const xBucketRange = getXBucketRange(this.viewport);
    const heatValues = calcHeatValues({
      oldHeatValues: {},
      dataStreams: this.dataStreams,
      xBucketRange,
      viewport: this.viewport,
      bucketCount: BUCKET_COUNT,
    });
    return (
      <div class="legend-container" style={{ flexDirection: 'unset' }}>
        <div class="label">
          <p class="font">Number of data points</p>
          <svg>
            <path stroke="#989898" stroke-dasharray="" stroke-linecap="square" stroke-width={2} d="M 0 0 H 150" />
          </svg>
        </div>
        <div class="color-bar-container">
          {this.isLoading ? (
            <div class="spinner-container">
              <sc-loading-spinner dark size={12} />
            </div>
          ) : (
            this.getLegendBars()
          )}
        </div>
        <div class="min-heat-values">1</div>
        <div class="max-heat-values">10</div>
      </div>
    );
  }
}
