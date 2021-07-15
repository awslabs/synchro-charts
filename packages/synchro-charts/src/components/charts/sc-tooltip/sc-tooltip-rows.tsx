import { Component, h, Prop } from '@stencil/core';

import uniq from 'lodash.uniq';
import { DataPoint, DataStream, DataStreamId, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { activePoints, POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import { getAggregationFrequency } from '../../sc-data-stream-name/helper';
import { displayDate } from '../../../utils/time';
import { tooltipPosition } from './tooltipPosition';
import { trendLinePoints } from './trendLinePoints';
import { TooltipPoint } from './types';
import { isDefined, isSupportedDataType } from '../../../utils/predicates';
import { Threshold, ThresholdColorAndIcon } from '../common/types';
import { breachedThreshold } from '../common/annotations/breachedThreshold';
import { sortTooltipPoints } from './sort';
import { StreamType } from '../../../utils/dataConstants';
import { TrendResult } from '../common/trends/types';
import { DATA_ALIGNMENT } from '../common/constants';

const AGGREGATED_LEVEL = 'average';
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
export class ScTooltipRows {
  @Prop() selectedDate!: Date;
  @Prop() size!: SizeConfig;
  @Prop() dataStreams!: DataStream[];
  @Prop() viewport!: ViewPort;
  @Prop() thresholds!: Threshold[];
  @Prop() trendResults: TrendResult[] = [];
  @Prop() maxDurationFromDate?: number; // milliseconds
  @Prop() showDataStreamColor: boolean = true;
  @Prop() supportString!: boolean;
  @Prop() showBlankTooltipRows!: boolean;
  @Prop() visualizesAlarms!: boolean;

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

  /**
   * Returns the color to display the value within a legend row.
   *
   * Takes into account whether the data stream is breached.
   * Does not take into account associated alarms
   */
  rowsValueColorAndIcon = (id: DataStreamId, { y }: DataPoint, date: Date): ThresholdColorAndIcon | undefined => {
    const dataStream = this.dataStreams.find(info => info.id === id);
    if (dataStream == null) {
      return undefined;
    }

    const threshold = breachedThreshold({
      date,
      value: y,
      thresholds: this.thresholds,
      dataStreams: [], // Not going to support the alarms yet, we cannot effectively fetch the data.
      dataStream,
    });

    return threshold != null ? { color: threshold.color, icon: threshold.icon } : undefined;
  };

  /**
   * The point in time which is 'actively' being viewed within the tooltip.
   */
  getDisplayedDate = (points: TooltipPoint[]): Date => {
    const resolutions = this.dataStreams.map(({ resolution }) => resolution);
    const minResolution = resolutions.length > 0 ? Math.min(...resolutions) : 0;

    if (minResolution === 0) {
      return this.selectedDate;
    }
    const firstPoint = points[0] && points[0].point ? new Date(points[0].point.x) : undefined;
    const firstPointTrend = this.trendResults[0] ? this.trendResults[0].startDate : undefined;

    return firstPoint || firstPointTrend || this.selectedDate;
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
    const resolutions = this.dataStreams.map(({ resolution }) => resolution);
    const minResolution = resolutions.length > 0 ? Math.min(...resolutions) : 0;

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

    const trendPoints = trendLinePoints({
      dataStreams: this.dataStreams,
      displayedDate: this.getDisplayedDate(dataPoints),
      trendResults: this.trendResults,
    });

    const tooltipPoints = [...dataPoints, ...trendPoints];

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

  render() {
    const resolutions = this.dataStreams.map(({ resolution }) => resolution);
    const minResolution = resolutions.length > 0 ? Math.min(...resolutions) : 0;
    const isCrossResolution = uniq(resolutions).length > 1;

    const points = this.getTooltipPoints();
    const displayedDate = this.getDisplayedDate(points);
    const position = tooltipPosition({
      points,
      resolution: minResolution,
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
              {displayDate(displayedDate, minResolution, this.viewport)}
            </small>
            {!isCrossResolution && (
              <small
                class={{ 'awsui-util-d-b': true, 'awsui-util-mb-s': true, 'left-offset': !this.showDataStreamColor }}
              >
                {getAggregationFrequency(minResolution, AGGREGATED_LEVEL)}
              </small>
            )}
            {points.map(tooltipPoint => {
              const { streamId } = tooltipPoint;
              /** Find the data stream info associated with the given data point */
              const dataStream = this.dataStreams.find(({ id }) => id === streamId);

              if (!dataStream) {
                /* eslint-disable-next-line  no-console */
                console.warn(`No data stream info associated with id ${streamId}`);
                return null;
              }
              const { color: valueColor = undefined, icon = undefined } =
                (tooltipPoint.point && this.rowsValueColorAndIcon(streamId, tooltipPoint.point, displayedDate)) || {};

              return (
                <sc-tooltip-row
                  key={`${tooltipPoint.streamId}-${tooltipPoint.type}`}
                  showDataStreamColor={this.showDataStreamColor}
                  label={tooltipPoint.label || dataStream.name}
                  resolution={isCrossResolution ? dataStream.resolution : undefined}
                  color={tooltipPoint.color || dataStream.color || 'black'}
                  point={tooltipPoint.point}
                  pointType={tooltipPoint.type}
                  valueColor={valueColor}
                  icon={icon}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
