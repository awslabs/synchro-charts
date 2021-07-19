import { Component, h, Prop, State } from '@stencil/core';

import { DataStream, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { Threshold } from '../common/types';
import { TrendResult } from '../common/trends/types';
import { DATA_ALIGNMENT } from '../common/constants';
import { select } from 'd3-selection';

/**
 * The parent tooltip container, listens for events to ensure tooltip renders at the correct position at the correct time.
 */
@Component({
  tag: 'sc-tooltip',
  styleUrl: 'sc-tooltip.css',
  shadow: false,
})
export class ScTooltip {
  @Prop() size!: SizeConfig;
  @Prop() dataContainer!: HTMLElement;
  @Prop() dataStreams!: DataStream[];
  @Prop() viewport!: ViewPort;
  @Prop() thresholds!: Threshold[];
  @Prop() trendResults: TrendResult[] = [];
  @Prop() maxDurationFromDate?: number; // milliseconds
  @Prop() showDataStreamColor: boolean = true;
  @Prop() supportString!: boolean;
  @Prop() visualizesAlarms!: boolean;
  @Prop() bucketHeight?: number;
  // If false, do not display a tooltip row if there is no associated point.
  @Prop() showBlankTooltipRows: boolean = false;

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
  @Prop() sortPoints: boolean = true;

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

    if (!isMouseBeingPressed && offsetY != null && this.bucketHeight != null) {
      const { yMax } = this.viewport;
      const { height } = this.size;

      const bucketHeight = yMax / this.bucketHeight;
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
      const { width } = this.size;

      const ratio = offsetX / width;
      const viewportDuration = end.getTime() - start.getTime();
      const selectedDateMS = start.getTime() + viewportDuration * ratio;

      this.selectedDate = new Date(selectedDateMS);
    } else {
      this.selectedDate = undefined;
    }
  };

  hideTooltip = () => {
    this.selectedDate = undefined;
    this.selectedBucket = undefined;
  };

  render() {
    const resolution = this.dataStreams.length > 0 ? this.dataStreams[0].resolution : undefined;
    if (resolution == null || this.selectedDate == null) {
      return null;
    }

    return (
      <sc-tooltip-rows
        trendResults={this.trendResults}
        size={this.size}
        dataStreams={this.dataStreams}
        viewport={this.viewport}
        selectedDate={this.selectedDate}
        thresholds={this.thresholds}
        maxDurationFromDate={this.maxDurationFromDate}
        showDataStreamColor={this.showDataStreamColor}
        dataAlignment={this.dataAlignment}
        supportString={this.supportString}
        visualizesAlarms={this.visualizesAlarms}
        showBlankTooltipRows={this.showBlankTooltipRows}
        sortPoints={this.sortPoints}
        top={this.top}
      />
    );
  }
}
