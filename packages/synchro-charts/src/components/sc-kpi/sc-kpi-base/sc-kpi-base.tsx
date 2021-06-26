import { Component, h, Prop } from '@stencil/core';
import { Threshold } from '../../charts/common/types';
import { DataPoint, DataStream, Primitive, MessageOverrides, MinimalViewPortConfig } from '../../../utils/dataTypes';
import { POINT_TYPE } from '../../charts/sc-webgl-base-chart/activePoints';
import { Trend } from './Trend';
import { Value } from '../../value/Value';
import { DataType } from '../../../utils/dataConstants';

/** Font Colors */
// should be $color-text-form-default https://polaris.a2z.com/fundamentals/foundation/design_tokens/
const DEFAULT_FONT_COLOR = '#16191f';
// should be $color-background-control-disabled https://polaris.a2z.com/fundamentals/foundation/design_tokens/
const DISABLED_FONT_COLOR = '#d5dbdb';

const FONT_SIZE = 44;
const MINI_FONT_SIZE = 44;
const ICON_SHRINK_FACTOR = 0.7;

@Component({
  tag: 'sc-kpi-base',
  styleUrl: 'sc-kpi-base.css',
  shadow: false,
})
export class ScKpiBase {
  @Prop() breachedThreshold?: Threshold;

  @Prop() alarmStream?: DataStream;
  @Prop() alarmPoint?: DataPoint<Primitive>;

  @Prop() propertyStream?: DataStream;
  @Prop() propertyPoint?: DataPoint<Primitive>;

  @Prop() messageOverrides!: MessageOverrides;

  @Prop() viewPort!: MinimalViewPortConfig;
  @Prop() trendStream!: DataStream | undefined;
  @Prop() isEditing: boolean = false;
  @Prop() isEnabled: boolean = true;
  @Prop() miniVersion!: boolean;
  @Prop() onChangeLabel!: ({ streamId, name }: { streamId: string; name: string }) => void;

  @Prop() isLoading?: boolean = false;
  @Prop() isRefreshing?: boolean = false;
  @Prop() valueColor?: string; // css color string

  getValues = (): { latestPoint?: DataPoint<Primitive>; previousPoint?: DataPoint<Primitive> } => {
    if (!this.trendStream || !this.trendStream.data.length) {
      return {
        latestPoint: undefined,
        previousPoint: undefined,
      };
    }

    const latestPoint = this.trendStream.data[this.trendStream.data.length - 1];
    const previousPoint = this.trendStream.data[this.trendStream.data.length - 2];

    return {
      latestPoint,
      previousPoint,
    };
  };

  /**
   * Update Name
   *
   * Given a change in the 'title' of the widget, fire off the correct data stream name change.
   */
  updateName = (name: string) => {
    if (this.propertyStream) {
      this.onChangeLabel({
        streamId: this.propertyStream.id,
        name,
      });
    } else if (this.alarmStream) {
      this.onChangeLabel({
        streamId: this.alarmStream.id,
        name,
      });
    }
  };

  fontColor = (latestPoint?: DataPoint<Primitive>): string => {
    if (!this.isEnabled) {
      return DISABLED_FONT_COLOR;
    }

    if (latestPoint == null) {
      return DEFAULT_FONT_COLOR;
    }

    return this.valueColor || DEFAULT_FONT_COLOR;
  };

  fontSize = (): number => (this.miniVersion ? MINI_FONT_SIZE : FONT_SIZE);

  iconSize = (): number => this.fontSize() * ICON_SHRINK_FACTOR;

  render() {
    const { latestPoint, previousPoint } = this.getValues();

    const shouldShowTrends =
      this.isEnabled &&
      previousPoint &&
      latestPoint &&
      this.trendStream &&
      this.trendStream.dataType !== DataType.STRING;

    const stream = this.propertyStream || this.alarmStream;
    const point = this.propertyStream ? this.propertyPoint : this.alarmPoint;
    const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;

    if (stream == null) {
      return undefined;
    }

    const error = this.propertyStream && this.propertyStream.error;

    return (
      <div class={{ wrapper: true, large: !this.miniVersion }}>
        <div />
        <sc-data-stream-name
          displayTooltip={false}
          label={stream.name}
          detailedLabel={stream.detailedName}
          pointType={POINT_TYPE.DATA}
          date={point && new Date(point.x)}
          onNameChange={this.updateName}
          isEditing={this.isEditing}
        />
        <div class="icon-container">
          {this.isEnabled && icon && <sc-chart-icon name={icon} size={this.iconSize()} color={this.valueColor} />}
        </div>
        <div class={{ main: true, large: !this.miniVersion }}>
          {error != null && <sc-error-badge data-testid="warning">{error}</sc-error-badge>}

          {this.isLoading ? (
            <sc-loading-spinner
              data-testid="loading"
              style={{ height: `${this.fontSize()}px`, width: `${this.fontSize()}px` }}
            />
          ) : (
            <div
              data-testid="current-value"
              class={{ 'value-wrapper': true, large: !this.miniVersion }}
              style={{ color: this.fontColor(point) }}
            >
              <Value isEnabled={this.isEnabled} value={point ? point.y : undefined} unit={stream.unit} />
            </div>
          )}
          {shouldShowTrends && this.isEnabled && (
            <Trend
              previousPoint={previousPoint as DataPoint<number>}
              latestPoint={latestPoint as DataPoint<number>}
              miniVersion={this.miniVersion}
            />
          )}
          {!shouldShowTrends && this.isEnabled && point && (
            <div>
              at{' '}
              {new Date(point.x).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}
