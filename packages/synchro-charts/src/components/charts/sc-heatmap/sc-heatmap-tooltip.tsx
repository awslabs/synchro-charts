import { Component, h, Prop, State } from '@stencil/core';

import { DataStream, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import {
  calcHeatValues,
  calculateBucketIndex,
  calculateXBucketStart,
  displayDate,
  getXBucketRange,
  HeatValueMap,
} from './heatmapUtil';
import { pointBisector } from '../common/dataFilters';
import { BUCKET_COUNT } from './heatmapConstants';

const TOOLTIP_ROW_HEIGHT = 21;
const TOOLTIP_EMPTY_HEIGHT = 71;
const X_OFFSET = 8;

/**
 * The parent tooltip container, listens for events to ensure tooltip renders at the correct position at the correct time.
 */
@Component({
  tag: 'sc-heatmap-tooltip',
  styleUrl: 'sc-heatmap-tooltip.css',
  shadow: false,
})
export class ScHeatmapTooltip {
  @Prop() size!: SizeConfig;
  @Prop() dataContainer!: HTMLElement;
  @Prop() dataStreams!: DataStream[];
  @Prop() viewport!: ViewPort;
  // If false, do not display a tooltip row if there is no associated point.

  /**
   * CSS Top property for the tooltip container
   */
  @Prop() top: number;

  @State() selectedXBucket: undefined | Date[];
  @State() selectedYBucket?: number[];
  @State() heatValues?: HeatValueMap = {};

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
      this.selectedXBucket = [new Date(selectedXBucketBucketStart), new Date(selectedXBucketBucketEnd)];
      this.setHeatValue();
    } else {
      this.selectedXBucket = undefined;
    }
  };

  setHeatValue = () => {
    if (this.selectedXBucket === undefined) {
      this.heatValues = {};
      return;
    }
    const newDataStream: DataStream[] = [];
    const xBucketRange = getXBucketRange(this.viewport);
    const [lowerXBucketBound, upperXBucketBound] = this.selectedXBucket;
    this.dataStreams.forEach((dataStream, index) => {
      const startIndex = Math.max(pointBisector.left(dataStream.data, lowerXBucketBound.getTime()) - 1, 0);
      const endIndex = Math.min(
        pointBisector.right(dataStream.data, upperXBucketBound.getTime() + 1),
        dataStream.data.length - 1
      );
      newDataStream[index] = { ...dataStream, data: dataStream.data.slice(startIndex, endIndex + 1) };
    });
    this.heatValues = calcHeatValues({
      oldHeatValues: {},
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
      const lowerBucketRange = Math.floor(selectedHeight / bucketHeight) * bucketHeight;
      const upperBucketRange = Math.ceil(selectedHeight / bucketHeight) * bucketHeight;
      this.selectedYBucket = [lowerBucketRange, upperBucketRange];
    } else {
      this.selectedYBucket = undefined;
    }
  };

  hideTooltip = () => {
    this.selectedXBucket = undefined;
  };

  getBucketString = (selectedYBucket: number[]): string => {
    return `${selectedYBucket[0].toFixed(2)} - ${selectedYBucket[1].toFixed(2)}`;
  };

  getTooltipPosition = (viewport, size): undefined | { x: number; y: number } => {
    if (this.selectedXBucket === undefined || this.selectedYBucket === undefined) {
      return undefined;
    }
    const { start, end, yMin, yMax } = viewport;
    const { width, height } = size;
    const selectedXBucketEndMS = this.selectedXBucket[1].getTime();

    const viewportDuration = end.getTime() - start.getTime();
    const datePosition = Math.min(selectedXBucketEndMS, end.getTime());
    const datePositionRatio = (datePosition - start.getTime()) / viewportDuration;
    const pixelX = width * datePositionRatio;

    const [bucketLower, bucketUpper] = this.selectedYBucket;
    const modelY = (bucketLower + bucketUpper) / 2;
    const pixelY = Math.max(0, height * (1 - (modelY - yMin) / (yMax - yMin)));

    return { x: pixelX, y: pixelY };
  };

  render() {
    if (this.selectedXBucket === undefined || this.selectedYBucket === undefined) {
      return null;
    }

    // if heatValues is undefined then we can't get the totalCount
    if (this.heatValues === undefined || this.heatValues === {}) {
      return null;
    }

    const selectedXBucketMS = this.selectedXBucket[0].getTime();
    const { yMin, yMax } = this.viewport;
    const bucketIndex = calculateBucketIndex({
      yValue: this.selectedYBucket[0],
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

    const position = this.getTooltipPosition(this.viewport, this.size);

    if (position == null) {
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
              {this.getBucketString(this.selectedYBucket)}
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
