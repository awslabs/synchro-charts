import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iot-app-kit-vis-threshold-legend-row',
  shadow: false,
})
export class ScThresholdLegendRow {
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
