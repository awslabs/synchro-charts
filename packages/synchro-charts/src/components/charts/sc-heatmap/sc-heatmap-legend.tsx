import { Component, h, Prop, State } from '@stencil/core';
import { LegendConfig } from '../common/types';
import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { COLOR_PALETTE } from './heatmapMesh';
import { calcHeatValues, getXBucketRange, HeatValueMap } from './heatmapUtil';
import { BUCKET_COUNT, NUM_OF_COLORS_SEQUENTIAL } from './heatmapConstants';
import { LEGEND_POSITION } from '../common/constants';

// need to change the width of sc-heatmap-legend in CSS file if this is changed
const WIDTH_OF_LEGEND = 240;

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
  };

  getBar = () => {
    if (this.heatValues == null || this.dataStreams.length === 0 || this.heatValues.minHeatValue === Infinity) {
      return null;
    }
    const { minHeatValue, maxHeatValue } = this.heatValues;
    const heatValueRange = maxHeatValue - minHeatValue + 1;
    const numOfBars = Math.min(heatValueRange, NUM_OF_COLORS_SEQUENTIAL);
    const barLength = WIDTH_OF_LEGEND / numOfBars;
    const barArray = new Array(NUM_OF_COLORS_SEQUENTIAL);
    let currentBarX = 0;
    let barIndex = numOfBars === 8 ? 0 : 1;
    let index = 0;
    while (currentBarX < WIDTH_OF_LEGEND && index < barArray.length) {
      const colorIndex = Math.min(
        Math.floor((barIndex / numOfBars) * NUM_OF_COLORS_SEQUENTIAL),
        NUM_OF_COLORS_SEQUENTIAL - 1
      );
      const pathD = `M ${currentBarX} 0 H ${WIDTH_OF_LEGEND}`;

      barArray[index] = (
        <path
          stroke={this.rgbToHex(COLOR_PALETTE.r[colorIndex], COLOR_PALETTE.g[colorIndex], COLOR_PALETTE.b[colorIndex])}
          stroke-linecap="square"
          stroke-width={20}
          d={pathD}
        />
      );

      barIndex += 1;
      index += 1;
      currentBarX += barLength;
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
        {!this.isLoading && this.heatValues.minHeatValue === Infinity ? (
          <div class="heat-values-empty-data">-</div>
        ) : (
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
