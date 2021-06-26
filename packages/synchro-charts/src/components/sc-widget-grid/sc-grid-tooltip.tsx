import { Component, Element, h, Prop } from '@stencil/core';

import tippy, { Instance } from 'tippy.js';
import { TIPPY_SETTINGS } from '../common/toolTipSettings';
import { DataPoint, Primitive } from '../../utils/dataTypes';
import { Value } from '../value/Value';
import { Threshold } from '../charts/common/types';

@Component({
  tag: 'sc-grid-tooltip',
  shadow: false,
})
export class ScGridTooltip {
  @Element() el: HTMLElement;

  @Prop() isEnabled: boolean;
  @Prop() title: string;
  @Prop() propertyPoint?: DataPoint<Primitive>;
  @Prop() alarmPoint?: DataPoint<Primitive>;
  @Prop() breachedThreshold?: Threshold;

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
    const color = this.breachedThreshold ? this.breachedThreshold.color : undefined;
    const displaysMoreThanTitle = thereIsSomeData && this.isEnabled;

    return (
      <div onMouseOver={this.displayToolTip} onFocus={this.displayToolTip} class="tooltip-container">
        <div class="cell-tooltip awsui-util-container awsui" style={{ display: 'none' }}>
          <div class={{ 'awsui-util-container-header': true, 'awsui-util-mb-m': displaysMoreThanTitle }}>
            <h3>{this.title}</h3>
          </div>
          {displaysMoreThanTitle && (
            <div>
              <div class="awsui-util-spacing-v-s">
                {this.propertyPoint && (
                  <div>
                    <div class="awsui-util-label">Latest value:</div>
                    <div>
                      <strong style={{ color }}>
                        <Value value={this.propertyPoint.y} />
                      </strong>{' '}
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
                  </div>
                )}

                {this.alarmPoint && (
                  <div>
                    <div class="awsui-util-label">Status:</div>
                    <div>
                      <strong style={{ color }}>{this.alarmPoint.y}</strong> since{' '}
                      {new Date(this.alarmPoint.x).toLocaleString('en-US', {
                        hour12: true,
                        minute: 'numeric',
                        hour: 'numeric',
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                      {this.breachedThreshold && this.breachedThreshold.description && (
                        <div>({this.breachedThreshold.description})</div>
                      )}
                    </div>
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
