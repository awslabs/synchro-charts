import { Component, h, Prop } from '@stencil/core';
import { SizeConfig } from '../../../utils/dataTypes';

@Component({
  tag: 'sc-webgl-axis',
  styleUrl: 'sc-webgl-axis.css',
  shadow: false,
})
export class ScWebglAxis {
  @Prop() size!: SizeConfig;

  render() {
    const { width, height, marginLeft, marginRight, marginTop, marginBottom } = this.size;
    return (
      <svg
        class="axis"
        style={{
          width: `${width + marginLeft + marginRight}px`,
          height: `${height + marginBottom + marginTop}px`,
        }}
      />
    );
  }
}
