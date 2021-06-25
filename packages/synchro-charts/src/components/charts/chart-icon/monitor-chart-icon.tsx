import { Component, h, Prop } from '@stencil/core';
import { getIcons } from '../common/annotations/iconUtils';
import { StatusIcon } from '../common/constants';

@Component({
  tag: 'monitor-chart-icon',
  styleUrl: 'monitor-chart-icon.css',
  shadow: false,
})
export class MonitorChartIcon {
  @Prop() name: StatusIcon = StatusIcon.NORMAL;
  @Prop() color?: string;
  @Prop() size?: number; // pixels

  render() {
    return <div class="monitor-chart-icon">{getIcons(this.name, this.color, this.size)}</div>;
  }
}
