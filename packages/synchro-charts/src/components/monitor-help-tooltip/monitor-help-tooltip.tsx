import { Component, Element, h, Prop } from '@stencil/core';
import tippy, { Instance } from 'tippy.js';
import { TIPPY_SETTINGS } from '../common/toolTipSettings';
import { QuestionMarkIcon } from './QuestionMarkIcon';

@Component({
  tag: 'monitor-help-tooltip',
  shadow: false,
})
export class MonitorHelpTooltip {
  @Element() el: HTMLElement;
  @Prop() message!: string;

  private tooltip: Instance | undefined;

  disconnectedCallback() {
    if (this.tooltip) {
      this.tooltip.destroy();
    }
  }

  displayToolTip = () => {
    const container = this.el.querySelector('.help-icon');
    const tooltip = this.el.querySelector('[role="tooltip"]') as HTMLElement;

    if (tooltip != null && container != null) {
      tooltip.style.display = 'block';
      this.tooltip = tippy(container, { ...TIPPY_SETTINGS, content: tooltip });
    }
  };

  render() {
    return (
      <div class="help-icon" tabIndex={-1} onMouseOver={this.displayToolTip} onFocus={this.displayToolTip}>
        <QuestionMarkIcon />
        <div role="tooltip" class="awsui-util-container awsui" style={{ display: 'none' }}>
          <div class="awsui-util-spacing-v-s">
            <p>{this.message}</p>
          </div>
        </div>
      </div>
    );
  }
}
