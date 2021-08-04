import { Component, h, Prop, State } from '@stencil/core';

import { DataStream, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { calcHeatValues, calculateXBucketStart, getXBucketRange, HeatValueMap } from './heatmapUtil';
import { pointBisector } from '../common/dataFilters';
import { BUCKET_COUNT } from './heatmapConstants';

/**
 * The parent tooltip container, listens for events to ensure tooltip renders at the correct position at the correct time.
 */
@Component({
  tag: 'sc-heatmap-tooltip',
  shadow: false,
})
export class ScHeatmapTooltip {
  @Prop() size!: SizeConfig;
  @Prop() dataContainer!: HTMLElement;
  @Prop() dataStreams!: DataStream[];
  @Prop() viewport!: ViewPort;

  @State() selectedXBucket?: { startDate: Date; endDate: Date };
  @State() selectedYBucket?: { lowerYBucket: number; upperYBucket: number };
  @State() heatValues?: HeatValueMap;

  componentDidLoad() {
    this.dataContainer.addEventListener('mousemove', this.setSelectedXBucket);
    this.dataContainer.addEventListener('mousemove', this.setSelectedYBucket);
    this.dataContainer.addEventListener('mouseleave', this.hideTooltip);
    this.dataContainer.addEventListener('mousedown', this.hideTooltip, { capture: true });
  }

  disconnectedCallback() {
    this.dataContainer.removeEventListener('mousemove', this.setSelectedXBucket);
    this.dataContainer.removeEventListener('mousemove', this.setSelectedYBucket);
    this.dataContainer.removeEventListener('mouseleave', this.hideTooltip);
    this.dataContainer.removeEventListener('mousedown', this.hideTooltip);
  }

  /**
   * Set the selected x-bucket based on the mouse's position.
   */
  setSelectedXBucket = ({ offsetX, buttons }: MouseEvent) => {
    const isMouseBeingPressed = buttons > 0;

    if (!isMouseBeingPressed && offsetX != null) {
      const { start, end } = this.viewport;
      const xBucketRange = getXBucketRange(this.viewport);
      const { width } = this.size;

      const ratio = offsetX / width;
      const viewportDuration = end.getTime() - start.getTime();
      const selectedXBucketMS = start.getTime() + viewportDuration * ratio;
      const selectedXBucketBucketStart = calculateXBucketStart({
        xValue: selectedXBucketMS,
        xBucketRange,
      });
      const selectedXBucketBucketEnd = selectedXBucketBucketStart + xBucketRange;
      this.selectedXBucket = {
        startDate: new Date(selectedXBucketBucketStart),
        endDate: new Date(selectedXBucketBucketEnd),
      };
      this.setHeatValue();
    } else {
      this.selectedXBucket = undefined;
    }
  };

  /**
   * Calculate the heatValues only for the selected x-bucket.
   */
  setHeatValue = () => {
    if (this.selectedXBucket == null) {
      this.heatValues = undefined;
      return;
    }
    const xBucketRange = getXBucketRange(this.viewport);
    const { startDate, endDate } = this.selectedXBucket;
    const filteredDataStreams = this.dataStreams.map(dataStream => {
      const startIndex = Math.max(pointBisector.left(dataStream.data, startDate.getTime()) - 1, 0);
      const endIndex = Math.min(
        pointBisector.right(dataStream.data, endDate.getTime() + 1),
        dataStream.data.length - 1
      );
      return { ...dataStream, data: dataStream.data.slice(startIndex, endIndex + 1) };
    });

    this.heatValues = calcHeatValues({
      dataStreams: filteredDataStreams,
      xBucketRange,
      viewport: this.viewport,
      bucketCount: BUCKET_COUNT,
    });
  };

  /**
   *  Set the selected y-bucket based on the mouse's posiition.
   */
  setSelectedYBucket = ({ offsetY, buttons }: MouseEvent) => {
    const isMouseBeingPressed = buttons > 0;

    if (!isMouseBeingPressed && offsetY != null && BUCKET_COUNT != null) {
      const { yMax, yMin } = this.viewport;
      const { height } = this.size;

      const yRange = yMax - yMin;
      const bucketHeight = yRange / BUCKET_COUNT;
      const ratio = offsetY / height;
      const selectedHeight = yMax - yRange * ratio;
      const lowerYBucket = Math.floor(selectedHeight / bucketHeight) * bucketHeight;
      const upperYBucket = Math.ceil(selectedHeight / bucketHeight) * bucketHeight;
      this.selectedYBucket = { lowerYBucket, upperYBucket };
    } else {
      this.selectedYBucket = undefined;
    }
  };

  hideTooltip = () => {
    this.selectedYBucket = undefined;
  };

  render() {
    if (this.selectedXBucket == null || this.selectedYBucket == null || this.heatValues == null) {
      return null;
    }

    return (
      <sc-heatmap-tooltip-rows
        selectedXBucket={this.selectedXBucket}
        selectedYBucket={this.selectedYBucket}
        size={this.size}
        viewport={this.viewport}
        heatValues={this.heatValues}
      />
    );
  }
}
