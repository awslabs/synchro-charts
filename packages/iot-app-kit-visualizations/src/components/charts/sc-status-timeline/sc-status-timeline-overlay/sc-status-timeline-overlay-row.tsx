import { Component, h, Prop } from '@stencil/core';
import { Primitive } from '../../../../utils/dataTypes';
import { Value } from '../../../value/Value';
import { StatusIcon } from '../../common/constants';

@Component({
  tag: 'iot-app-kit-vis-status-timeline-overlay-row',
  styleUrl: 'sc-status-timeline-overlay-row.css',
  shadow: false,
})
export class ScStatusTimelineOverlayRow {
  @Prop() label!: string;
  @Prop() isEditing!: boolean;
  @Prop() onNameChange!: (name: string) => void;
  @Prop() valueColor?: string; // css color string
  @Prop() detailedLabel?: string;
  @Prop() value?: Primitive;
  @Prop() icon?: StatusIcon;
  @Prop() unit?: string;
  @Prop() precision?: number;

  render() {
    return [
      <div class="stream-info">
        <iot-app-kit-vis-data-stream-name
          label={this.label}
          detailedLabel={this.detailedLabel}
          onNameChange={this.onNameChange}
          isEditing={this.isEditing}
        />
        <div class="expando" />
        <span class="value" style={{ color: this.valueColor || 'unset', display: 'flex', alignItems: 'center' }}>
          {this.icon && <iot-app-kit-vis-chart-icon name={this.icon} />}
          <Value value={this.value} unit={this.unit} precision={this.precision} />
        </span>
      </div>,
      <div class="no-data-visualization" />,
    ];
  }
}
