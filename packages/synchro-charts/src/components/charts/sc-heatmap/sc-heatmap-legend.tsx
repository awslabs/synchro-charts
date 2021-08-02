import { Component, h, Prop, State } from '@stencil/core';
import { LegendConfig } from '../common/types';
import { LEGEND_POSITION } from '../common/constants';
import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { COLOR_PALETTE } from './heatmapMesh';
import { calcHeatValues, getXBucketRange, HeatValueMap } from './heatmapUtil';
import { BUCKET_COUNT, NUM_OF_COLORS_SEQUENTIAL } from './heatmapConstants';

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
  @Prop() isLoading: boolean;
  @State() heatValues: HeatValueMap;

  componentToHex = (color: number) => {
    const hex = color.toString(16).split('.')[0];
    if (hex === '0') {
      return '00';
    }
    return hex.length === 1 ? `0${hex}` : hex;
  };

  rgbToHex = (r: number, g: number, b: number) => {
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  getBar = () => {
    const barArray = new Array(NUM_OF_COLORS_SEQUENTIAL);
    let currentBarX = 0;
    let currentBarNumber = 1;
    for (let i = 0; i < NUM_OF_COLORS_SEQUENTIAL; i += 1) {
      if (currentBarX >= 240 || currentBarNumber === 8) {
        return barArray;
      }
      const { minHeatValue, maxHeatValue } = this.heatValues;
      const heatValueRange = maxHeatValue - minHeatValue + 1;
      const numOfBars = Math.min(heatValueRange, NUM_OF_COLORS_SEQUENTIAL);
      const barLength = 240 / numOfBars;

      const colorIndex = Math.floor((currentBarNumber / numOfBars) * NUM_OF_COLORS_SEQUENTIAL) - 1;
      const pathD = `M ${currentBarX} 0 H 240`;

      currentBarX += barLength;
      currentBarNumber += 1;
      barArray[i] = (
        <path
          stroke={this.rgbToHex(COLOR_PALETTE.r[colorIndex], COLOR_PALETTE.g[colorIndex], COLOR_PALETTE.b[colorIndex])}
          stroke-linecap="square"
          stroke-width={20}
          d={pathD}
        />
      );
    }
    return barArray;
  };

  render() {
    this.config.position = LEGEND_POSITION.BOTTOM;
    const xBucketRange = getXBucketRange(this.viewport);
    if (this.dataStreams.length === 0) {
      return null;
    }

    this.heatValues = calcHeatValues({
      oldHeatValues: {},
      dataStreams: this.dataStreams,
      xBucketRange,
      viewport: this.viewport,
      bucketCount: BUCKET_COUNT,
    });
    return (
      <div class="legend-container">
        <div class="label">
          <p>Number of data points</p>
          <svg>
            <path stroke="#989898" stroke-linecap="square" stroke-width={2} d="M 0 0 H 150" />
          </svg>
        </div>
        <div class="color-bar-container">
          {this.isLoading ? (
            <div class="spinner-container">
              <sc-loading-spinner dark size={12} />
            </div>
          ) : (
            <div>
              <svg class="bar">
                <g>{this.getBar()}</g>
              </svg>
            </div>
          )}
        </div>
        {!this.isLoading && (
          <div class="heat-values">
            <div class="min-heat-values">
              {this.heatValues.minHeatValue === this.heatValues.maxHeatValue ? 0 : this.heatValues.minHeatValue}
            </div>
            <div class="max-heat-values">{this.heatValues.maxHeatValue}</div>
          </div>
        )}
      </div>
    );
  }
}
