import { Component, h, Prop } from '@stencil/core';
import { LegendConfig } from '../common/types';
import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { COLOR_PALETTE } from './heatmapMesh';
import { calcHeatValues, getXBucketRange, HeatValueMap } from './heatmapUtil';
import { BUCKET_COUNT, NUM_OF_COLORS_SEQUENTIAL } from './heatmapConstants';
import { LEGEND_POSITION } from '../common/constants';

const LEGEND_WIDTH_HORIZONTAL = 240;
const LEGEND_WIDTH_VERTICAL = 150;

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

  getBar = (heatValues: HeatValueMap, legendWidth: number) => {
    if (heatValues == null || this.dataStreams.length === 0 || heatValues.minHeatValue === Infinity) {
      return null;
    }
    const { minHeatValue, maxHeatValue } = heatValues;
    const heatValueRange = maxHeatValue - minHeatValue + 1;
    const numOfBars = Math.min(heatValueRange, NUM_OF_COLORS_SEQUENTIAL);
    const barLength = legendWidth / numOfBars;
    const barArray = new Array(NUM_OF_COLORS_SEQUENTIAL);
    let currentBarX = 0;
    let barIndex = numOfBars === 8 ? 0 : 1;
    let index = 0;
    while (currentBarX < legendWidth && index < barArray.length) {
      const colorIndex = Math.min(
        Math.floor((barIndex / numOfBars) * NUM_OF_COLORS_SEQUENTIAL),
        NUM_OF_COLORS_SEQUENTIAL - 1
      );

      barArray[index] = (
        <rect
          x={currentBarX}
          width={barLength}
          height="10"
          style={{
            fill: `rgb(${COLOR_PALETTE.r[colorIndex]},${COLOR_PALETTE.g[colorIndex]},${COLOR_PALETTE.b[colorIndex]})`,
          }}
        />
      );
      barIndex += 1;
      index += 1;
      currentBarX += barLength;
    }
    return barArray;
  };

  render() {
    const xBucketRange = getXBucketRange(this.viewport);
    if (this.dataStreams.length === 0) {
      return null;
    }

    const heatValues = calcHeatValues({
      dataStreams: this.dataStreams,
      xBucketRange,
      viewport: this.viewport,
      bucketCount: BUCKET_COUNT,
    });

    const legendWidth =
      this.config.position === LEGEND_POSITION.BOTTOM ? LEGEND_WIDTH_HORIZONTAL : LEGEND_WIDTH_VERTICAL;
    const barContainerWidth = `${legendWidth}px`;
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
              <svg class="bar" style={{ width: barContainerWidth }}>
                {this.getBar(heatValues, legendWidth)}
              </svg>
            </div>
          )}
        </div>
        {!this.isLoading &&
          (heatValues.minHeatValue === Infinity ? (
            <div class="heat-values-empty-data">-</div>
          ) : (
            <div class="heat-values">
              <div class="min-heat-values">
                {heatValues.minHeatValue === heatValues.maxHeatValue ? 0 : heatValues.minHeatValue}
              </div>
              <div class="max-heat-values" style={{ 'margin-left': `${legendWidth - 10}px` }}>
                {heatValues.maxHeatValue}
              </div>
            </div>
          ))}
      </div>
    );
  }
}
