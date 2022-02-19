import { Component, Prop, h, Host } from '@stencil/core';
import {
  DataPoint,
  Primitive,
  STREAM_ICON_PATH_COMMAND,
  STREAM_ICON_STROKE_LINECAP,
  STREAM_ICON_STROKE_WIDTH,
  TREND_ICON_DASH_ARRAY,
} from '../../../../utils/dataTypes';
import { POINT_TYPE } from '../../sc-webgl-base-chart/activePoints';
import { StencilCSSProperty } from '../../../../utils/types';
import { Value } from '../../../value/Value';
import { DEFAULT_LEGEND_TEXT_COLOR } from '../constants';
import { StatusIcon } from '../../common/constants';

// Styling to control the height of the gap between the stream-name and the unit
const EDIT_MODE_STYLE: StencilCSSProperty = {
  top: '-2px',
};
const VIEW_MODE_STYLE: StencilCSSProperty = {
  top: '-11px',
};

@Component({
  tag: 'sc-legend-row',
  styleUrl: 'sc-legend-row.css',
  shadow: false,
})
export class ScLegendRow {
  @Prop() streamId!: string;
  @Prop() label!: string;
  @Prop() updateDataStreamName!: ({ streamId, name }: { streamId: string; name: string }) => void;
  @Prop() isEditing!: boolean;
  @Prop() isLoading!: boolean;
  @Prop() showDataStreamColor!: boolean; // Whether to display the 'color bar'
  @Prop() color!: string; // Color to display the 'color bar'

  @Prop() detailedLabel?: string;
  @Prop() point?: DataPoint<Primitive>;
  @Prop() unit?: string;
  @Prop() pointType?: POINT_TYPE;
  @Prop() valueColor?: string = DEFAULT_LEGEND_TEXT_COLOR;
  @Prop() icon?: StatusIcon;

  updateName = (name: string) => {
    this.updateDataStreamName({
      streamId: this.streamId,
      name,
    });
  };

  render() {
    const isTrendPoint = this.pointType && this.pointType === POINT_TYPE.TREND;
    return (
      <Host>
        <div class="legend-row-container awsui">
          {this.showDataStreamColor && (
            <div class="color-container">
              {this.isLoading ? (
                <div class="spinner-container">
                  <sc-loading-spinner dark size={12} />
                </div>
              ) : (
                <svg class="bar" data-testid={`legend-icon-${this.pointType}`}>
                  <path
                    stroke={this.color}
                    stroke-dasharray={isTrendPoint ? TREND_ICON_DASH_ARRAY : ''}
                    stroke-linecap={STREAM_ICON_STROKE_LINECAP}
                    stroke-width={STREAM_ICON_STROKE_WIDTH}
                    d={STREAM_ICON_PATH_COMMAND}
                  />
                </svg>
              )}
            </div>
          )}

          <div class="info">
            <sc-data-stream-name
              onNameChange={this.updateName}
              isEditing={this.isEditing}
              label={this.label}
              detailedLabel={this.detailedLabel}
              pointType={this.pointType}
              date={this.point && new Date(this.point.x)}
            />
            <div class="legend-value" style={this.isEditing ? EDIT_MODE_STYLE : VIEW_MODE_STYLE}>
              {this.icon && <sc-chart-icon name={this.icon} />}
              <h4 class="awsui-util-d-i" data-testid="current-value" style={{ color: this.valueColor }}>
                <Value value={this.point ? this.point.y : undefined} />
              </h4>
              {this.unit && <small>&nbsp;{this.unit}</small>}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
