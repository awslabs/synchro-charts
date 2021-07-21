import { Component, h, Prop, State } from '@stencil/core';

import { pointBisector } from '../common/dataFilters';
import { DataStream, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { DATA_ALIGNMENT } from '../common/constants';
import {
  calcHeatValues,
  calculateBucketIndex,
  calculateXBucketStart,
  displayDate,
  getResolution,
  HeatValueMap,
} from './heatmapUtil';
import { BUCKET_COUNT } from './heatmapConstants';

const TOOLTIP_ROW_HEIGHT = 21;
const TOOLTIP_EMPTY_HEIGHT = 71;
const X_OFFSET = 8;

@Component({
  tag: 'sc-heatmap-tooltip',
  styleUrl: 'heatmapTooltip.css',
  shadow: false,
})
export class ScHeatmapTooltip {
  @Prop() size!: SizeConfig;
  @Prop() dataContainer!: HTMLElement;
  @Prop() viewport!: ViewPort;
  @Prop() dataStreams!: DataStream[];

  /**
   * If we are drawing data from the data timestamp to timestamp + resolution
   * we want the tooltip to align on the left side
   *
   * Otherwise we are drawing the data from timestamp - resolution to timestamp
   * then we want the tooltip to align on the right side
   */
  @Prop() dataAlignment!: DATA_ALIGNMENT;
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
      const resolution = getResolution(this.viewport);
      const { width } = this.size;

      const ratio = offsetX / width;
      const viewportDuration = end.getTime() - start.getTime();
      const selectedXBucketMS = start.getTime() + viewportDuration * ratio;
      const selectedXBucketBucketStart = calculateXBucketStart({
        xValue: selectedXBucketMS,
        xAxisBucketRange: resolution,
      });
      const selectedXBucketBucketEnd = selectedXBucketBucketStart + resolution;
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
    const resolution = getResolution(this.viewport);
    const [lowerXBucketBound, upperXBucketBound] = this.selectedXBucket;
    this.dataStreams.forEach((dataStream, index) => {
      const startIndex = Math.max(pointBisector.left(dataStream.data, lowerXBucketBound) - 1, 0);
      const endIndex = Math.min(pointBisector.right(dataStream.data, upperXBucketBound), dataStream.data.length - 1);
      newDataStream[index] = { ...dataStream, data: dataStream.data.slice(startIndex, endIndex + 1) };
    });
    this.heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams: newDataStream,
      resolution,
      viewport: this.viewport,
    });
  };

  setselectedYBucket = ({ offsetY, buttons }: MouseEvent) => {
    const isMouseBeingPressed = buttons > 0;

    if (!isMouseBeingPressed && offsetY != null && BUCKET_COUNT != null) {
      const { yMax } = this.viewport;
      const { height } = this.size;

      const bucketHeight = yMax / BUCKET_COUNT;
      const ratio = offsetY / height;
      const selectedHeight = yMax - yMax * ratio;
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

  getBucketCount = (selectedXBucket: Date, yValue: number): number => {
    if (!this.heatValues) {
      return 0;
    }
    const resolution = getResolution(this.viewport);
    const xAxisBucketStart = calculateXBucketStart({ xValue: selectedXBucket.getTime(), xAxisBucketRange: resolution });
    const { yMin, yMax } = this.viewport;
    const bucketIndex = calculateBucketIndex({ yValue, yMax, yMin });
    return this.heatValues[xAxisBucketStart][bucketIndex].totalCount;
  };

  getBucketString = (selectedYBucket: number[]): string => {
    return `${selectedYBucket[0].toString()} - ${selectedYBucket[1].toString()}`;
  };

  getTooltipPosition = (viewport, size): undefined | { x: number; y: number } => {
    if (this.selectedXBucket === undefined || this.selectedYBucket === undefined) {
      return undefined;
    }
    const { start, end, yMin, yMax } = viewport;
    const { width, height } = size;
    const selectedXBucketStartMS = this.selectedXBucket[0].getTime();

    const viewportDuration = end.getTime() - start.getTime();
    const datePositionRatio = (selectedXBucketStartMS - start.getTime()) / viewportDuration;
    const pixelX = width * datePositionRatio;

    const [bucketLower, bucketUpper] = this.selectedYBucket;
    const modelY = (bucketLower + bucketUpper) / 2;
    const pixelY = Math.max(0, height * (1 - (modelY - yMin) / (yMax - yMin)));

    return { x: pixelX, y: pixelY };
  };

  render() {
    const resolution = getResolution(this.viewport);
    if (this.selectedXBucket === undefined || this.selectedYBucket === undefined) {
      return null;
    }

    // if heatValues is undefined then we can't get the totalCount
    if (this.heatValues === undefined || this.heatValues === {}) {
      return null;
    }

    const selectedXBucketMS = this.selectedXBucket[0].getTime();
    const { yMin, yMax } = this.viewport;
    const bucketIndex = calculateBucketIndex({ yValue: this.selectedYBucket[1], yMax, yMin });

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
            <small class={{ 'awsui-util-d-b': true }}>
              {displayDate(this.selectedXBucket, resolution, this.viewport)}
            </small>
            <small class={{ 'awsui-util-d-b': true }}>Bucket range:</small>
            <small class={{ 'value awsui-util-d-b': true }} style={{ color: '#000' }}>
              {this.getBucketString(this.selectedYBucket)}
            </small>
            <small class={{ 'awsui-util-d-b': true, 'awsui-util-mb-s': true }}>Total count:</small>
            <small class={{ 'value awsui-util-d-b': true }} style={{ color: '#000' }}>
              {this.heatValues[selectedXBucketMS][bucketIndex].totalCount}
            </small>
          </div>
        </div>
      </div>
    );
  }
}
