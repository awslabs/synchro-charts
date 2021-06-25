import { Component, h } from '@stencil/core';

@Component({
  tag: 'monitor-grid',
  styleUrl: 'monitor-grid.css',
  shadow: false,
})
export class MonitorGrid {
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
