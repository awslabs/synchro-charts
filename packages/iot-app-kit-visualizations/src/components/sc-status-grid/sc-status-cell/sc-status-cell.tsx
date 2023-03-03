import { Component, h, Prop } from '@stencil/core';
import { DataPoint, DataStream, DEFAULT_MESSAGE_OVERRIDES, MessageOverrides } from '../../../utils/dataTypes';
import { Threshold } from '../../charts/common/types';
import { LabelsConfig } from '../../common/types';
import { highContrastColor } from './highContrastColor';
import { Value } from '../../value/Value';
import { StatusIcon } from '../../charts/common/constants';

// TODO: Get exact color used at https://aws-uxdr.invisionapp.com/share/THVZU5CZY5U?redirHash=#/screens/405175804
const DEFAULT_COLOR = '#f1f1f1';
const ICON_SIZE_PX = 14;

@Component({
  tag: 'sc-status-cell',
  styleUrl: 'sc-status-cell.css',
  shadow: false,
})
export class ScStatusCell {
  @Prop() messageOverrides: MessageOverrides;

  @Prop() breachedThreshold?: Threshold;

  @Prop() alarmStream?: DataStream;
  @Prop() alarmPoint?: DataPoint;

  @Prop() propertyStream?: DataStream;
  @Prop() propertyPoint?: DataPoint;

  @Prop() isEnabled: boolean;
  @Prop() valueColor?: string; // css color string
  @Prop() icon?: StatusIcon;
  @Prop() labelsConfig: Required<LabelsConfig>;
  @Prop() isEditing: boolean = false;

  @Prop() onChangeLabel!: ({ streamId, name }: { streamId: string; name: string }) => void;

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

  render() {
    const { icon, valueColor } = this;
    const { showName, showValue, showUnit } = this.labelsConfig;
    const backgroundColor = this.isEnabled && valueColor ? valueColor : DEFAULT_COLOR;

    /** Display Settings. We want to dynamically construct the layout dependent on what information is shown */
    const emphasizeValue = !showValue;
    const emphasizeNameAndUnit = showValue && !showName && !showUnit;

    /** If anything is emphasized, then something is emphasized */
    const somethingIsEmphasized = emphasizeValue || emphasizeNameAndUnit;

    const stream = this.alarmStream || this.propertyStream;
    const point = this.alarmStream ? this.alarmPoint : this.propertyPoint;

    const foregroundColor = highContrastColor(backgroundColor);
    return (
      <div
        class="status-cell tooltip-container"
        style={{
          backgroundColor,
          color: foregroundColor,
          justifyContent: somethingIsEmphasized ? 'center' : 'unset',
        }}
      >
        {showName && (
          <sc-data-stream-name
            displayTooltip={false}
            class={{ name: true, large: emphasizeValue, center: emphasizeValue }}
            style={{ color: foregroundColor }}
            label={stream ? stream.name : ''}
            detailedLabel={(stream && stream.detailedName) || ''}
            onNameChange={this.updateName}
            isEditing={this.isEditing}
          />
        )}
        {this.breachedThreshold && this.breachedThreshold.description != null && (
          <div
            style={{ color: foregroundColor }}
            class={{ description: true, large: emphasizeValue, center: emphasizeValue }}
          >
            {this.breachedThreshold.description}
          </div>
        )}
        {!somethingIsEmphasized && <div class="divider" />}
        {showValue && stream && (
          <div class={{ center: emphasizeNameAndUnit }}>
            {this.isEnabled && this.propertyStream && this.alarmStream && (
              <div class="secondary">
                <span style={{ color: foregroundColor }}>
                  {this.messageOverrides.liveTimeFrameValueLabel || DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel}:{' '}
                  <Value
                    value={this.propertyPoint ? this.propertyPoint.y : undefined}
                    unit={this.propertyStream.unit}
                  />
                </span>
              </div>
            )}
            <div class={{ value: true, large: emphasizeNameAndUnit }} style={{ color: foregroundColor }}>
              {this.isEnabled &&
                icon && [
                  <sc-chart-icon name={icon} size={ICON_SIZE_PX} color={highContrastColor(backgroundColor)} />,
                  <div class="spacer" />,
                ]}
              <Value unit={stream.unit} value={point ? point.y : undefined} isEnabled={this.isEnabled} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
