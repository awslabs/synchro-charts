import { Component, h, Host, State } from '@stencil/core';

@Component({
  tag: 'iot-app-kit-vis-expandable-input-standard',
})
export class ScExpandableInputStandard {
  @State() value: string = '';

  render() {
    return (
      <Host>
        <iot-app-kit-vis-expandable-input
          onValueChange={(value: string) => {
            this.value = value;
          }}
          value=""
        />
        <br />
        <span id="input-value">{this.value}</span>
      </Host>
    );
  }
}
