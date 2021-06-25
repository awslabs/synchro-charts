import { Component, h, Host, State } from '@stencil/core';

@Component({
  tag: 'monitor-expandable-input-standard',
})
export class MonitorExpandableInputStandard {
  @State() value: string = '';

  render() {
    return (
      <Host>
        <monitor-expandable-input
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
