import { Component, Element, h, Prop, State } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';
import isEqual from 'lodash.isequal';
import { rectScrollFixed } from '../common/webGLPositioning';
import { RectScrollFixed } from '../../utils/types';
import { renderChild } from './renderChild';
import { webGLRenderer } from '../sc-webgl-context/webglContext';
import { MinimalSizeConfig } from '../../utils/dataTypes';

/**
 * The rate at which the layout will update for graphics projected onto some element.
 *
 * A smaller duration will make performance suffer but prevent ghosting.
 */
const MS_PER_RECT_POLL = 650;

/**
 * Widget Sizer
 */
@Component({
  tag: 'sc-size-provider',
  styleUrl: 'sc-size-provider.css',
  shadow: false,
})
export class ScSizeProvider {
  @Element() el!: HTMLElement;
  @Prop() renderFunc!: (rect: RectScrollFixed) => void;

  /** Size overrides. these will take precident over any auto-calculated sizing */
  @Prop() size?: MinimalSizeConfig;

  /** The DOM Elements size as computed by the observer. corrected on resolution changes. */
  @State() computedSize: { width: number; height: number } | null = null;

  @State() rect: RectScrollFixed | null = null;

  private resizer: ResizeObserver;
  private rectPollingHandler: number | null = null;

  componentWillLoad() {
    /**
     * Creates a listener for elements dimensions changing.
     * This allows us to dynamically set the widget dimensions.
     */
    this.resizer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        /** Update Size */
        const { width, height } = entry.contentRect;
        this.computedSize = { width, height };
      });
    });
  }

  componentDidLoad() {
    this.setRect();
    this.rectPollingHandler = window.setInterval(this.setRect, MS_PER_RECT_POLL);
    this.resizer.observe(this.el.firstElementChild as Element);
  }

  disconnectedCallback() {
    this.resizer.disconnect();
    if (this.rectPollingHandler) {
      window.clearInterval(this.rectPollingHandler);
    }
  }

  setRect = () => {
    if (this.el && this.el.isConnected) {
      const newRect = rectScrollFixed(this.el);
      const rectHasUpdated = !isEqual(newRect, this.rect);
      if (rectHasUpdated) {
        if (this.rect && this.rect.density !== newRect.density) {
          // When the density has changed, we need to trigger a resolution change. This will occur in scenarios
          // such as attaching or detaching a monitor.
          webGLRenderer.onResolutionChange();
        }

        // Note: It's important to only set this value if the contents actually change,
        //       since it triggers a cascading re-render.
        this.rect = newRect;
      }
    }
  };

  render() {
    const rect: RectScrollFixed | undefined =
      (this.size || this.computedSize) && this.rect
        ? {
            ...this.rect,
            ...this.computedSize,
            ...this.size,
          }
        : undefined;
    return <div class="sc-size-provider-container">{renderChild(this.renderFunc, rect)}</div>;
  }
}
