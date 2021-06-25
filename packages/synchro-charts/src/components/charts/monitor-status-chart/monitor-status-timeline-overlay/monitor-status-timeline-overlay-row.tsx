import { Component, h, Prop } from '@stencil/core';
import { Primitive } from '../../../../utils/dataTypes';
import { Value } from '../../../value/Value';
import { StatusIcon } from '../../common/constants';

@Component({
  tag: 'monitor-status-timeline-overlay-row',
  styleUrl: 'monitor-status-timeline-overlay-row.css',
  shadow: false,
})
export class MonitorStatusTimelineOverlayRow {
  @Prop() label!: string;
  @Prop() isEditing!: boolean;
  @Prop() onNameChange!: (name: string) => void;
  @Prop() valueColor?: string; // css color string
  @Prop() detailedLabel?: string;
  @Prop() value?: Primitive;
  @Prop() icon?: StatusIcon;
  @Prop() unit?: string;

  render() {
    return [
      <div class="stream-info">
        <monitor-data-stream-name
          label={this.label}
          detailedLabel={this.detailedLabel}
          onNameChange={this.onNameChange}
          isEditing={this.isEditing}
        />
        <div class="expando" />
        <span class="value" style={{ color: this.valueColor || 'unset', display: 'flex', alignItems: 'center' }}>
          {this.icon && <sc-chart-icon name={this.icon} />}
          <Value value={this.value} unit={this.unit} />
        </span>
      </div>,
      <div class="no-data-visualization" />,
    ];
  }
}
