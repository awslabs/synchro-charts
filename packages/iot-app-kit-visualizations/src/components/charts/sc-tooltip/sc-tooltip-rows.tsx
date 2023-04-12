import { Component, h, Prop } from '@stencil/core';

import uniq from 'lodash.uniq';
import { AggregateType, DataPoint, DataStream, DataStreamId, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { getAggregationFrequency } from '../../sc-data-stream-name/helper';
import { displayDate } from '../../../utils/time';
import { TooltipPoint, TooltipPositioning } from './types';
import { Threshold, ThresholdColorAndIcon } from '../common/types';
import { breachedThreshold } from '../common/annotations/breachedThreshold';
import { TrendResult } from '../common/trends/types';

/**
 * The Display Component for the tool tip.
 *
 * Renders the tooltip, tooltip container, the tooltip line and the tool tip rows
 */
@Component({
  tag: 'iot-app-kit-vis-tooltip-rows',
  shadow: false,
})
export class ScTooltipRows {
  @Prop() selectedDate!: Date;
  @Prop() size!: SizeConfig;
  @Prop() dataStreams!: DataStream[];
  @Prop() viewport!: ViewPort;
  @Prop() thresholds!: Threshold[];
  @Prop() trendResults: TrendResult[] = [];
  @Prop() showDataStreamColor: boolean = true;
  @Prop() tooltipPoints: TooltipPoint[];
  @Prop() toolTipPositioning!: TooltipPositioning;

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

  render() {
    const resolutions = this.dataStreams.map(({ resolution }) => resolution);
    const minResolution = resolutions.length > 0 ? Math.min(...resolutions) : 0;
    const isCrossResolution = uniq(resolutions).length > 1;

    const displayedDate = this.getDisplayedDate(this.tooltipPoints);

    if (this.tooltipPoints.length === 0 || !this.toolTipPositioning) {
      // If there are no tooltip points to display on the tool tip, don't display anything.
      return null;
    }

    const { top, left, right, transform } = this.toolTipPositioning;

    return (
      <div class="awsui">
        <div
          class="tooltip-line"
          style={{
            left: `${this.toolTipPositioning.x + this.size.marginLeft}px`,
            height: `${this.size.height}px`,
          }}
        />
        <div class="tooltip-container" style={{ top, left, right, transform }}>
          <div class="awsui-util-shadow awsui-util-p-s">
            <small class={{ 'awsui-util-d-b': true, 'left-offset': !this.showDataStreamColor }}>
              {displayDate(displayedDate, minResolution, this.viewport)}
            </small>
            {!isCrossResolution && (
              <small
                class={{ 'awsui-util-d-b': true, 'awsui-util-mb-s': true, 'left-offset': !this.showDataStreamColor }}
              >
                {getAggregationFrequency(minResolution, AggregateType.AVERAGE)}
              </small>
            )}
            {this.tooltipPoints.map(tooltipPoint => {
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
                <iot-app-kit-vis-tooltip-row
                  key={`${tooltipPoint.streamId}-${tooltipPoint.type}`}
                  showDataStreamColor={this.showDataStreamColor}
                  label={tooltipPoint.label || dataStream.name}
                  aggregationType={dataStream.aggregationType}
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
