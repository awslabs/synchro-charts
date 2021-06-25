import { Component, h, Prop } from '@stencil/core';
import { getIcons } from '../common/annotations/iconUtils';
import { StatusIcon } from '../common/constants';

@Component({
  tag: 'sc-chart-icon',
  styleUrl: 'sc-chart-icon.css',
  shadow: false,
})
export class ScChartIcon {
  @Prop() name: StatusIcon = StatusIcon.NORMAL;
  @Prop() color?: string;
  @Prop() size?: number; // pixels

  render() {
    return <div class="sc-chart-icon">{getIcons(this.name, this.color, this.size)}</div>;
  }
}
