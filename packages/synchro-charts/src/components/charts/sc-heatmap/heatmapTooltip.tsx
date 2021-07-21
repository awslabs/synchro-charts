import { Component, h, Prop, State } from '@stencil/core';

import { DataStream, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { DATA_ALIGNMENT } from '../common/constants';
import { calculateBucketIndex, calculateXBucketStart, displayDate, getResolution, HeatValueMap } from './heatmapUtil';

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
  @Prop() bucketCount?: number;
  @Prop() isHeatmap?: boolean = false;
  @Prop() heatValues?: HeatValueMap = {};

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

  @State() selectedDate?: Date;
  @State() selectedBucket?: number[];

  componentDidLoad() {
    this.dataContainer.addEventListener('mousemove', this.setSelectedDate);
    this.dataContainer.addEventListener('mouseleave', this.hideTooltip);
    this.dataContainer.addEventListener('mousedown', this.hideTooltip, { capture: true });
  }

  disconnectedCallback() {
    this.dataContainer.removeEventListener('mousemove', this.setSelectedDate);
    this.dataContainer.removeEventListener('mouseleave', this.hideTooltip);
    this.dataContainer.removeEventListener('mousedown', this.hideTooltip);
  }

  getCursorBucket = ({ offsetY, buttons }: MouseEvent) => {
    const isMouseBeingPressed = buttons > 0;

    if (!isMouseBeingPressed && offsetY != null && this.bucketCount != null) {
      const { yMax } = this.viewport;
      const { height } = this.size;

      const bucketHeight = yMax / this.bucketCount;
      const ratio = offsetY / height;
      const selectedHeight = yMax - yMax * ratio;
      const lowerBucketRange = Math.floor(selectedHeight / bucketHeight) * bucketHeight;
      const upperBucketRange = Math.ceil(selectedHeight / bucketHeight) * bucketHeight;
      this.selectedBucket = [lowerBucketRange, upperBucketRange];
    } else {
      this.selectedBucket = undefined;
    }
  };

  setSelectedDate = ({ offsetX, buttons }: MouseEvent) => {
    const isMouseBeingPressed = buttons > 0;

    if (!isMouseBeingPressed && offsetX != null) {
      // Determine the date which corresponds with the mouses position.
      const { start, end } = this.viewport;
      const resolution = getResolution(this.viewport);
      const { width } = this.size;

      const ratio = offsetX / width;
      const viewportDuration = end.getTime() - start.getTime();
      const selectedDateMS = start.getTime() + viewportDuration * ratio;
      const selectedDateBucketStart = calculateXBucketStart({ xValue: selectedDateMS, xAxisBucketRange: resolution });

      this.selectedDate = new Date(selectedDateBucketStart);
    } else {
      this.selectedDate = undefined;
    }
  };

  hideTooltip = () => {
    this.selectedDate = undefined;
  };

  getBucketCount = (selectedDate: Date, yValue: number): number => {
    if (!this.heatValues) {
      return 0;
    }
    const resolution = getResolution(this.viewport);
    const xAxisBucketStart = calculateXBucketStart({ xValue: selectedDate.getTime(), xAxisBucketRange: resolution });
    const { yMin, yMax } = this.viewport;
    const bucketIndex = calculateBucketIndex({ yValue, yMax, yMin });
    return this.heatValues[xAxisBucketStart][bucketIndex].totalCount;
  };

  getBucketString = (selectedBucket: number[]): string => {
    return `${selectedBucket[0].toString()} - ${selectedBucket[1].toString()}`;
  };

  getTooltipPosition = (viewport, size): undefined | { x: number; y: number } => {
    if (this.selectedDate === undefined || this.selectedBucket === undefined) {
      return undefined;
    }
    const { start, end, yMin, yMax } = viewport;
    const { width, height } = size;
    const timestamp = this.selectedDate.getTime();

    const viewportDuration = end.getTime() - start.getTime();
    const datePositionRatio = (timestamp - start.getTime()) / viewportDuration;
    const pixelX = width * datePositionRatio;

    const [bucketLower, bucketUpper] = this.selectedBucket;
    const modelY = (bucketLower + bucketUpper) / 2;
    const pixelY = Math.max(0, height * (1 - (modelY - yMin) / (yMax - yMin)));

    return { x: pixelX, y: pixelY };
  };

  render() {
    const resolution = getResolution(this.viewport);
    if (resolution == null || this.selectedDate == null || this.selectedBucket == null) {
      return null;
    }

    // if heatValues is undefined then we can't get the totalCount
    if (this.heatValues === undefined) {
      return null;
    }

    const selectedDateMS = this.selectedDate.getTime();
    const { yMin, yMax } = this.viewport;
    const bucketIndex = calculateBucketIndex({ yValue: this.selectedBucket[1], yMax, yMin });

    // if chosen date isn't in heatValues then there's no data to be displayed
    if (this.heatValues[selectedDateMS] === undefined) {
      return null;
    }

    // if chosen bucket isn't in heatValues then there's no data to be displayed
    if (this.heatValues[selectedDateMS][bucketIndex] === undefined) {
      return null;
    }

    const selectedBucketCount = this.heatValues[selectedDateMS][bucketIndex].totalCount;
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
              {displayDate(this.selectedDate, resolution, this.viewport)}
            </small>
            <small class={{ 'awsui-util-d-b': true }}>Bucket range:</small>
            <small class={{ 'value awsui-util-d-b': true }} style={{ color: '#000' }}>
              {this.getBucketString(this.selectedBucket)}
            </small>
            <small class={{ 'awsui-util-d-b': true, 'awsui-util-mb-s': true }}>Total count:</small>
            <small class={{ 'value awsui-util-d-b': true }} style={{ color: '#000' }}>
              {selectedBucketCount}
            </small>
          </div>
        </div>
      </div>
    );
  }
}
