import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-error-badge',
  styleUrl: 'sc-error-badge.css',
  shadow: false,
})
export class ScErrorBadge {
  render() {
    return (
      <div data-test-tag="error">
        <span class="warning-symbol">⚠</span>
        <slot />
      </div>
    );
  }
}
