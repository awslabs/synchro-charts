import { Component, h, Prop } from '@stencil/core';
import { DataStream, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { activePoints, POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import { tooltipPosition } from './tooltipPosition';
import { TooltipPoint } from './types';
import { isDefined, isSupportedDataType } from '../../../utils/predicates';
import { sortTooltipPoints } from './sort';
import { StreamType } from '../../../utils/dataConstants';
import { DATA_ALIGNMENT } from '../common/constants';
import {
  getResolution,
  displayDate,
  HeatValueMap,
  calculateXBucketStart,
  calculateBucketIndex,
} from '../sc-heatmap/heatmapUtil';

const TOOLTIP_ROW_HEIGHT = 21;
const TOOLTIP_EMPTY_HEIGHT = 71;
const X_OFFSET = 8;

/**
 * The Display Component for the tool tip.
 *
 * Renders the tooltip, tooltip container, the tooltip line and the tool tip rows
 */
@Component({
  tag: 'sc-tooltip-rows',
  shadow: false,
})
export class ScTooltipHeatmapRows {
  @Prop() selectedDate!: Date;
  @Prop() selectedBucket!: number[];
  @Prop() size!: SizeConfig;
  @Prop() dataStreams!: DataStream[];
  @Prop() viewport!: ViewPort;
  @Prop() maxDurationFromDate?: number; // milliseconds
  @Prop() showDataStreamColor: boolean = true;
  @Prop() supportString!: boolean;
  @Prop() showBlankTooltipRows!: boolean;
  @Prop() visualizesAlarms!: boolean;
  @Prop() heatValues!: HeatValueMap;

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
  @Prop() top?: number;
  @Prop() sortPoints?: boolean = true;

  /** Total height of the tool tip display */
  tooltipHeight = (numRows: number) => numRows * TOOLTIP_ROW_HEIGHT + TOOLTIP_EMPTY_HEIGHT;

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

  /**
   * Returns the data which is supported
   *
   * i.e. if `supportsString` is false, do not return any data streams of string type
   */
  visualizedDataStreams = (): DataStream[] => {
    const streams = this.dataStreams.filter(isSupportedDataType(this.supportString));

    if (this.visualizesAlarms) {
      // Visualize all infos with a valid data type
      return streams;
    }

    // Visualize only property-infos (non-alarms) with a valid data type
    return streams.filter(({ streamType }) => streamType !== StreamType.ALARM);
  };

  /**
   * Return each of the 'points' to be displayed
   *
   * each of these will correspond to one `tooltip-row`
   */
  getTooltipPoints = (): TooltipPoint[] => {
    const resolution = getResolution(this.viewport);
    const minResolution = Math.min(resolution, 0);

    const dataPoints = activePoints({
      viewport: this.viewport,
      dataStreams: this.visualizedDataStreams(),
      dataAlignment: this.dataAlignment,
      selectedDate: this.selectedDate,
      allowMultipleDates: minResolution === 0,
      maxDurationFromDate: this.maxDurationFromDate,
    }).map(p => ({
      ...p,
      type: POINT_TYPE.DATA,
    }));

    const tooltipPoints = [...dataPoints];

    // Either sort, or place them in the order the infos are presented
    const points = this.sortPoints
      ? tooltipPoints.sort(sortTooltipPoints(p => p.y))
      : this.dataStreams.map(({ id }) => tooltipPoints.find(p => p.streamId === id)).filter(isDefined);

    // Optionally filter out anything without a point
    if (this.showBlankTooltipRows) {
      return points;
    }
    return points.filter(p => p.point != null);
  };

  getBucket = (selectedBucket: number[]): string => {
    return `${selectedBucket[0].toString()} - ${selectedBucket[1].toString()}`;
  };

  render() {
    const resolution = getResolution(this.viewport);

    const points = this.getTooltipPoints();
    const position = tooltipPosition({
      points,
      resolution,
      viewport: this.viewport,
      size: this.size,
      selectedTimestamp: this.selectedDate.getTime(),
    });

    if (points.length === 0) {
      // If there are no tooltip points to display on the tool tip, don't display anything.
      return null;
    }

    if (position == null) {
      return null;
    }

    const tooltipContainerTop =
      this.top != null
        ? `${this.top}px`
        : `${position.y - (this.tooltipHeight(points.length) * 3) / 4 - this.size.height}px`;

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
            <small class={{ 'awsui-util-d-b': true, 'left-offset': !this.showDataStreamColor }}>
              {displayDate(this.selectedDate, resolution, this.viewport)}
            </small>
            <small class={{ 'awsui-util-d-b': true, 'left-offset': !this.showDataStreamColor }}>Bucket range:</small>
            <small
              class={{ 'value awsui-util-d-b': true, 'left-offset': !this.showDataStreamColor }}
              style={{ color: '#000' }}
            >
              {this.getBucket(this.selectedBucket)}
            </small>
            <small
              class={{ 'awsui-util-d-b': true, 'awsui-util-mb-s': true, 'left-offset': !this.showDataStreamColor }}
            >
              Total count:
            </small>
            <small
              class={{ 'value awsui-util-d-b': true, 'left-offset': !this.showDataStreamColor }}
              style={{ color: '#000' }}
            >
              {this.getBucketCount(this.selectedDate, this.selectedBucket[1])}
            </small>
          </div>
        </div>
      </div>
    );
  }
}
