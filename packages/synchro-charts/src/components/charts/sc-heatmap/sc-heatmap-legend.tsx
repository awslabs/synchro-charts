import { Component, h, Prop } from '@stencil/core';
import { LegendConfig } from '../common/types';
import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { calcHeatValues, getXBucketRange, HeatValueMap } from './heatmapUtil';
import { BUCKET_COUNT } from './heatmapConstants';
import { LEGEND_POSITION } from '../common/constants';
import { getSequential } from './displayLogic';

const LEGEND_WIDTH_HORIZONTAL = 240;
const LEGEND_WIDTH_VERTICAL = 150;

@Component({
  tag: 'sc-heatmap-legend',
  styleUrl: './sc-heatmap-legend.css',
  shadow: false,
})
export class ScHeatmapLegend {
  @Prop() config!: LegendConfig;
  @Prop() viewport: ViewPort;
  @Prop() dataStreams!: DataStream[];
  @Prop() isLoading: boolean;

  getBar = (heatValues: HeatValueMap, legendWidth: number) => {
    if (heatValues.minHeatValue === Infinity) {
      return null;
    }
    const colorPalette = getSequential(heatValues);
    const numOfBars = colorPalette.r.length;
    const barLength = legendWidth / numOfBars;

    return new Array(numOfBars).fill(null).map((value, index) => {
      const currentBarX = index * barLength;
      return (
        <rect
          x={currentBarX}
          width={barLength}
          height="10"
          style={{
            fill: `rgb(${colorPalette.r[index]},${colorPalette.g[index]},${colorPalette.b[index]})`,
          }}
        />
      );
    });
  };

  render() {
    if (this.dataStreams.length === 0) {
      return null;
    }

    if (this.config.legendLabels?.title == null) {
      return null;
    }

    const xBucketRange = getXBucketRange(this.viewport);
    const heatValues = calcHeatValues({
      dataStreams: this.dataStreams,
      xBucketRange,
      viewport: this.viewport,
      bucketCount: BUCKET_COUNT,
    });

    const legendWidth =
      this.config.position === LEGEND_POSITION.BOTTOM ? LEGEND_WIDTH_HORIZONTAL : LEGEND_WIDTH_VERTICAL;

    return (
      <div class="legend-container">
        <div class="legend-label">
          <p>{this.config.legendLabels.title}</p>
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
              <svg class="bar" style={{ width: `${legendWidth}px` }}>
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
