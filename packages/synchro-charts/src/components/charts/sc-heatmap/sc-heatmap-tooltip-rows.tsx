import { Component, h, Prop } from '@stencil/core';
import { SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { BUCKET_COUNT } from './heatmapConstants';

import { HeatValueMap, displayDate, calculateBucketIndex } from './heatmapUtil';

const TOOLTIP_ROW_HEIGHT = 21;
const TOOLTIP_EMPTY_HEIGHT = 71;
const X_OFFSET = 8;

/**
 * The Display Component for the tool tip.
 *
 * Renders the tooltip, tooltip container, the tooltip line and the tool tip rows
 */
@Component({
  tag: 'sc-heatmap-tooltip-rows',
  styleUrl: 'sc-heatmap-tooltip-rows.css',
  shadow: false,
})
export class ScTooltipRows {
  @Prop() selectedXBucket!: { startDate: Date; endDate: Date };
  @Prop() selectedYBucket!: { lowerYBucket: number; upperYBucket: number };
  @Prop() size!: SizeConfig;
  @Prop() viewport!: ViewPort;
  @Prop() heatValues!: HeatValueMap;

  getTooltipPosition = (viewport, size): undefined | { x: number; y: number } => {
    if (this.selectedXBucket === undefined || this.selectedYBucket === undefined) {
      return undefined;
    }
    const { start, end, yMin, yMax } = viewport;
    const { width, height } = size;
    const selectedXBucketEndMS = this.selectedXBucket.endDate.getTime();

    const viewportDuration = end.getTime() - start.getTime();
    const datePosition = Math.min(selectedXBucketEndMS, end.getTime());
    const datePositionRatio = (datePosition - start.getTime()) / viewportDuration;
    const pixelX = width * datePositionRatio;

    const { lowerYBucket, upperYBucket } = this.selectedYBucket;
    const modelY = (lowerYBucket + upperYBucket) / 2;
    const pixelY = Math.max(0, height * (1 - (modelY - yMin) / (yMax - yMin)));

    return { x: pixelX, y: pixelY };
  };

  render() {
    const position = this.getTooltipPosition(this.viewport, this.size);

    if (position == null) {
      return null;
    }

    const selectedXBucketMS = this.selectedXBucket.startDate.getTime();
    const { yMin, yMax } = this.viewport;
    const bucketIndex = calculateBucketIndex({
      yValue: this.selectedYBucket.lowerYBucket,
      yMax,
      yMin,
      bucketCount: BUCKET_COUNT,
    });

    // if chosen date isn't in heatValues then there's no data to be displayed
    if (this.heatValues[selectedXBucketMS] === undefined) {
      return null;
    }

    // if chosen bucket isn't in heatValues then there's no data to be displayed
    if (this.heatValues[selectedXBucketMS][bucketIndex] === undefined) {
      return null;
    }

    const tooltipContainerTop = `${position.y -
      ((TOOLTIP_ROW_HEIGHT + TOOLTIP_EMPTY_HEIGHT) * 3) / 4 -
      this.size.height}px`;

    return (
      <div class="awsui">
        <div
          class="tooltip-line"
          style={{
            left: `${position.x}px`,
            height: `${this.size.height}px`,
          }}
        />
        <div
          class="tooltip-container"
          style={{
            left: `${position.x + X_OFFSET}px`,
            top: tooltipContainerTop,
          }}
        >
          <div class="awsui-util-shadow awsui-util-p-s">
            <small class={{ 'awsui-util-d-b': true }}>{displayDate(this.selectedXBucket, this.viewport)}</small>
            <small class={{ 'awsui-util-d-b': true }}>Bucket range:</small>
            <span class={{ 'value awsui-util-d-b': true }} data-testid="tooltip-buckets" style={{ color: '#000' }}>
              {`${this.selectedYBucket.lowerYBucket.toFixed(2)} - ${this.selectedYBucket.upperYBucket.toFixed(2)}`}
            </span>
            <small class={{ 'awsui-util-d-b': true }}>Total count:</small>
            <span class={{ 'value awsui-util-d-b': true }} data-testid="tooltip-heat-value" style={{ color: '#000' }}>
              {this.heatValues[selectedXBucketMS][bucketIndex].totalCount}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
