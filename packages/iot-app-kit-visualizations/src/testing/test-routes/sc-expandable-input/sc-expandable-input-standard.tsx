import { Component, h, Host, State } from '@stencil/core';

@Component({
  tag: 'sc-expandable-input-standard',
})
export class ScExpandableInputStandard {
  @State() value: string = '';

  render() {
    return (
      <Host>
        <sc-expandable-input
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
