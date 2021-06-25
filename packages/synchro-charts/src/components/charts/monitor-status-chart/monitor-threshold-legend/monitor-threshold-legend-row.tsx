import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'monitor-threshold-legend-row',
  shadow: false,
})
export class MonitorThresholdLegendRow {
  @Prop() color!: string; // CSS Color string
  @Prop() label!: string;

  render() {
    return (
      <div>
        <div class="box" style={{ backgroundColor: this.color }} /> {this.label}
      </div>
    );
  }
}
