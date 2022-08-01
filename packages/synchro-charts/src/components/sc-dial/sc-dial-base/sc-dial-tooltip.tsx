import { Component, Element, h, Prop } from '@stencil/core';

import tippy, { Instance } from 'tippy.js';
import { DataPoint } from '../../../utils/dataTypes';
import { Threshold } from '../../charts/common/types';
import { TIPPY_SETTINGS } from '../../common/toolTipSettings';
import { Value } from '../../value/Value';

@Component({
  tag: 'sc-dial-tooltip',
  styleUrl: 'sc-dial-base.css',
  shadow: false,
})
export class ScDialTooltip {
  @Element() el: HTMLElement;

  @Prop() title: string;
  @Prop() propertyPoint?: DataPoint;
  @Prop() alarmPoint?: DataPoint;
  @Prop() breachedThreshold?: Threshold;
  @Prop() unit?: string;
  @Prop() value?: number | undefined;
  @Prop() color?: string | undefined;

  private tooltip: Instance | undefined;

  componentDidLoad() {
    this.displayToolTip();
  }

  disconnectedCallback() {
    if (this.tooltip) {
      this.tooltip.destroy();
    }
  }

  displayToolTip = () => {
    const container = this.el.querySelector('.tooltip-container');
    const tooltip = this.el.querySelector('.cell-tooltip') as HTMLElement | undefined;

    if (tooltip != null && container != null) {
      tooltip.style.display = 'block';
      this.tooltip = tippy(container, {
        ...TIPPY_SETTINGS,
        placement: 'left',
        content: tooltip,
      });
    }
  };

  render() {
    const thereIsSomeData = this.propertyPoint != null || this.alarmPoint != null;
    const { color } = this;
    const icon = this.breachedThreshold ? this.breachedThreshold.icon : undefined;

    return (
      <div class="tooltip-container" style={{ width: 'inherit', height: 'inherit' }}>
        <div class="cell-tooltip awsui-util-container awsui">
          <div class={{ 'awsui-util-container-header': true, 'awsui-util-mb-m': thereIsSomeData }}>
            <h3>{this.title}</h3>
          </div>
          {thereIsSomeData && (
            <div>
              <div class="awsui-util-spacing-v-s">
                {this.propertyPoint && (
                  <div>
                    <div class="awsui-util-label">Latest value:</div>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                      <strong style={{ color, display: 'flex', marginRight: '3px' }}>
                        {icon && <sc-chart-icon name={icon} color={color} style={{ marginRight: '3px' }} />}
                        <Value value={this.value} unit={this.unit} />
                      </strong>
                      at{' '}
                      {new Date(this.propertyPoint.x).toLocaleString('en-US', {
                        hour12: true,
                        minute: 'numeric',
                        hour: 'numeric',
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </div>
                    {this.alarmPoint && (
                      <div>
                        {this.breachedThreshold && this.breachedThreshold.icon && (
                          <span style={{ color }}>{this.breachedThreshold.value}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <slot />
      </div>
    );
  }
}
