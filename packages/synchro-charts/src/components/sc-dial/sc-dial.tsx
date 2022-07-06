import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-dial',
  styleUrl: 'sc-dial.css',
  shadow: true,
})
export class ScDial {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
