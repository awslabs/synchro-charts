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
  // If false, do not display a tooltip row if there is no associated point.

  @State() selectedXBucket: { startDate: Date; endDate: Date } | undefined;
  @State() selectedYBucket?: { lowerYBucket: number; upperYBucket: number };
  @State() heatValues?: HeatValueMap;

  componentDidLoad() {
    this.dataContainer.addEventListener('mousemove', this.setselectedXBucket);
    this.dataContainer.addEventListener('mousemove', this.setselectedYBucket);
    this.dataContainer.addEventListener('mouseleave', this.hideTooltip);
    this.dataContainer.addEventListener('mousedown', this.hideTooltip, { capture: true });
  }

  disconnectedCallback() {
    this.dataContainer.removeEventListener('mousemove', this.setselectedXBucket);
    this.dataContainer.removeEventListener('mousemove', this.setselectedYBucket);
    this.dataContainer.removeEventListener('mouseleave', this.hideTooltip);
    this.dataContainer.removeEventListener('mousedown', this.hideTooltip);
  }

  setselectedXBucket = ({ offsetX, buttons }: MouseEvent) => {
    const isMouseBeingPressed = buttons > 0;

    if (!isMouseBeingPressed && offsetX != null) {
      // Determine the date which corresponds with the mouses position.
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

  setHeatValue = () => {
    if (this.selectedXBucket === undefined) {
      this.heatValues = undefined;
      return;
    }
    const newDataStream: DataStream[] = [];
    const xBucketRange = getXBucketRange(this.viewport);
    const { startDate, endDate } = this.selectedXBucket;
    this.dataStreams.forEach((dataStream, index) => {
      const startIndex = Math.max(pointBisector.left(dataStream.data, startDate.getTime()) - 1, 0);
      const endIndex = Math.min(
        pointBisector.right(dataStream.data, endDate.getTime() + 1),
        dataStream.data.length - 1
      );
      newDataStream[index] = { ...dataStream, data: dataStream.data.slice(startIndex, endIndex + 1) };
    });
    this.heatValues = calcHeatValues({
      dataStreams: newDataStream,
      xBucketRange,
      viewport: this.viewport,
      bucketCount: BUCKET_COUNT,
    });
  };

  setselectedYBucket = ({ offsetY, buttons }: MouseEvent) => {
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
    this.selectedXBucket = undefined;
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
