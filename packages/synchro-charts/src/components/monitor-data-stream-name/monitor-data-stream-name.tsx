import { Component, Element, h, Prop } from '@stencil/core';
import tippy, { Instance } from 'tippy.js';

import { POINT_TYPE } from '../charts/monitor-webgl-base-chart/activePoints';
import { TIPPY_SETTINGS } from '../common/toolTipSettings';

@Component({
  tag: 'monitor-data-stream-name',
  styleUrl: 'monitor-data-stream-name.css',
  shadow: false,
})
export class MonitorDataStreamName {
  @Element() el: HTMLElement;

  @Prop() displayTooltip?: boolean = true;
  @Prop() onNameChange!: (name: string) => void;
  @Prop() isEditing!: boolean;
  @Prop() label!: string;
  @Prop() detailedLabel?: string;
  @Prop() pointType?: POINT_TYPE;
  @Prop() date?: Date;

  private tooltip: Instance | undefined;

  disconnectedCallback() {
    if (this.tooltip) {
      this.tooltip.destroy();
    }
  }

  renderTooltip = () => {
    if (this.displayTooltip) {
      const container = this.el.querySelector('monitor-expandable-input');
      const tooltip = this.el.querySelector('.data-stream-name-tooltip') as HTMLElement | undefined;

      if (tooltip != null && container != null) {
        tooltip.style.display = 'block';
        this.tooltip = tippy(container, {
          ...TIPPY_SETTINGS,
          content: tooltip,
        });
      }
    }
  };

  render() {
    return (
      <div class="awsui">
        <monitor-expandable-input
          isDisabled={!this.isEditing}
          onValueChange={(value: string) => {
            this.onNameChange(value);
          }}
          onMouseOver={this.renderTooltip}
          onFocus={this.renderTooltip}
          value={this.label}
        />
        <div class="data-stream-name-tooltip awsui-util-container awsui" style={{ display: 'none' }}>
          <div class="awsui-util-spacing-v-s">
            <div>
              <div class="awsui-util-label">{this.detailedLabel || this.label}</div>
              {this.pointType && this.pointType === POINT_TYPE.TREND && (
                <small>This trend line is computed from only visible data.</small>
              )}
            </div>
            {this.date && (
              <div>
                <div class="awsui-util-label">Latest value at</div>
                <div>
                  {this.date.toLocaleString('en-US', {
                    hour12: true,
                    minute: 'numeric',
                    hour: 'numeric',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
