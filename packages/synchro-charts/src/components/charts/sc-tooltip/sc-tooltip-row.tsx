import { Component, h, Prop } from '@stencil/core';

import { POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import {
  DataPoint,
  STREAM_ICON_PATH_COMMAND,
  STREAM_ICON_STROKE_LINECAP,
  STREAM_ICON_STROKE_WIDTH,
  TREND_ICON_DASH_ARRAY,
  AggregateType,
} from '../../../utils/dataTypes';
import { Value } from '../../value/Value';
import { getAggregationFrequency } from '../../sc-data-stream-name/helper';
import { StatusIcon } from '../common/constants';

const baseColor = '#000';
const AGGREGATED_LEVEL = 'average';

@Component({
  tag: 'sc-tooltip-row',
  styleUrl: 'sc-tooltip-row.css',
  shadow: false,
})
export class ScTooltipRow {
  @Prop() label!: string;
  @Prop() resolution!: number | undefined;
  @Prop() aggregateTypes?: AggregateType[] | undefined;
  @Prop() hasIndexForFirstAggregate?: boolean | undefined;
  @Prop() color!: string;
  @Prop() point!: DataPoint | undefined;
  @Prop() showDataStreamColor!: boolean;
  @Prop() pointType!: POINT_TYPE;
  @Prop() valueColor?: string = baseColor;
  @Prop() icon?: StatusIcon;

  private firstAggregateType = this.aggregateTypes && this.hasIndexForFirstAggregate ? this.aggregateTypes[0] : AggregateType.AVERAGE;

  render() {
    const isTrendPoint = this.pointType === POINT_TYPE.TREND;
    return (
      <div class="clearfix">
        {this.showDataStreamColor && (
          <span class="awsui-util-mr-xs">
            <svg class="bar" data-testid={`tooltip-icon-${this.pointType}`}>
              <path
                stroke={this.color}
                stroke-dasharray={isTrendPoint ? TREND_ICON_DASH_ARRAY : undefined}
                stroke-linecap={STREAM_ICON_STROKE_LINECAP}
                stroke-width={STREAM_ICON_STROKE_WIDTH}
                d={STREAM_ICON_PATH_COMMAND}
              />
            </svg>
          </span>
        )}

        <span class="label awsui-util-d-i" data-testid="tooltip-row-label">
          {this.label}
        </span>
        <span class="value awsui-util-d-i" data-testid="current-value" style={{ color: this.valueColor }}>
          {this.icon && <sc-chart-icon name={this.icon} />}
          <Value value={this.point && this.point.y} />
        </span>
        {this.resolution != null && (
          <div class="awsui-util-pb-s">
            <small>{getAggregationFrequency(this.resolution, this.firstAggregateType)}</small>
          </div>
        )}
      </div>
    );
  }
}
