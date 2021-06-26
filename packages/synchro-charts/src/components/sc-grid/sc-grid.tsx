import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-grid',
  styleUrl: 'sc-grid.css',
  shadow: false,
})
export class ScGrid {
  render() {
    return (
      <div class="grid-wrapper">
        <div class="grid">
          <slot />
        </div>
      </div>
    );
  }
}
