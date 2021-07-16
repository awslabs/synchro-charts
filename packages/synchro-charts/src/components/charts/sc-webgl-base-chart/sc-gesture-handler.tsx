import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
import { scaleLinear, scaleTime } from 'd3-scale';

import { select } from 'd3-selection';
import Zoom from './Zoom/Zoom';
import { createBrushTransform } from './ChartBrush/brushTransform';
import { SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { MovementConfig } from '../common/types';

const TRANSITION_DURATION = 600;
// Want to prevent double clicking accident firing a teeny tiny brush gesture
const MIN_BRUSH_WIDTH = 6;

const MOVEMENT_CONFIG: MovementConfig = {
  enableXScroll: true,
  enableYScroll: false,
  zoomMax: Infinity,
  zoomMin: 0.00001,
};

@Component({
  tag: 'sc-gesture-handler',
  styleUrl: 'sc-gesture-handler.css',
  shadow: false,
})
export class ScGestureHandler {
  @Element() el: HTMLElement;

  @Prop() size!: SizeConfig;
  @Prop() viewport!: ViewPort;
  @Prop() onDateRangeChange!: ({ end, start }: { start: Date; end: Date }) => void;

  @State() start?: number;
  @State() end?: number;

  private zoom: Zoom;
  private zoomContainer: SVGRectElement | undefined = undefined;

  // The initial viewport that was present when the zoom-container is mounted.
  // This is necessary because the transformations applied via the zoom behavior are
  // relative to the initial viewport, so to calculate the correct transformation
  // we need to know the original frame of reference.
  private initialViewPort: ViewPort;

  componentDidLoad() {
    this.initialViewPort = this.viewport;
    this.setupZoom();
    this.el.addEventListener('mousedown', this.beginBrush, { capture: true });
    this.el.addEventListener('mousemove', this.moveBrush);
    this.el.addEventListener('mouseup', this.finishBrush);
    this.el.addEventListener('mouseleave', this.cancelBrush);
  }

  disconnectedCallback() {
    this.el.removeEventListener('mousedown', this.beginBrush);
    this.el.removeEventListener('mousemove', this.moveBrush);
    this.el.removeEventListener('mouseup', this.finishBrush);
    this.el.removeEventListener('mouseleave', this.cancelBrush);
  }

  @Watch('viewport')
  onViewPortChange(newViewPort: ViewPort) {
    this.zoom.updateViewPort(newViewPort);
  }

  @Watch('size')
  onSizeChange() {
    const { width: chartWidth, height: chartHeight } = this.size;
    this.zoom.updateSize({
      xMin: 0,
      xMax: chartWidth,
      yMax: 0,
      yMin: chartHeight,
    });
  }

  /**
   * Initiate the start of a brush gesture by clicking
   */
  beginBrush = ({ offsetX, shiftKey }: MouseEvent) => {
    if (!shiftKey) {
      this.start = offsetX;
      this.end = offsetX;
    }
  };

  /**
   * Continue a brushing gesture by holding the mouse button and dragging
   */
  moveBrush = ({ offsetX, buttons, shiftKey }: MouseEvent) => {
    const isButtonPressed = buttons > 0;
    if (isButtonPressed && this.start != null && !shiftKey) {
      this.end = offsetX;
    } else {
      this.start = undefined;
      this.end = undefined;
    }
  };

  /**
   * Conclude a brushing gesture by letting the mouse button go.
   */
  finishBrush = ({ shiftKey }: MouseEvent) => {
    // check if were actually finishing a brush motion.
    // this event will also be fired when someone clicks and drags
    // into the brush container
    if (this.start != null && this.end != null && !shiftKey) {
      const startPx = Math.min(this.start, this.end);
      const endPx = Math.max(this.start, this.end);
      if (endPx - startPx > MIN_BRUSH_WIDTH) {
        this.initiateTransform(startPx, endPx);
      }
    }
    this.start = undefined;
    this.end = undefined;
  };

  cancelBrush = () => {
    this.start = undefined;
    this.end = undefined;
  };

  initiateTransform = (startPx: number, endPx: number) => {
    const xScale = scaleTime()
      .domain([this.viewport.start.getTime(), this.viewport.end.getTime()])
      .range([0, this.size.width]);
    const xScaleOriginal = scaleTime()
      .domain([this.initialViewPort.start.getTime(), this.initialViewPort.end.getTime()])
      .range([0, this.size.width]);
    const brushTransform = createBrushTransform({
      xSelectedPixelMin: startPx,
      xSelectedPixelMax: endPx,
      xScaleOriginal,
      xScale,
      movement: MOVEMENT_CONFIG,
    });
    const transitionContainer = select(this.getZoomContainer())
      .transition()
      .duration(TRANSITION_DURATION);
    this.zoom.transform(transitionContainer, brushTransform);
  };

  scales() {
    const { yMin, yMax, start, end } = this.viewport;
    const { width, height } = this.size;
    const xScale = scaleTime()
      .domain([start.getTime(), end.getTime()])
      .range([0, width]);
    const yScale = scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0]);
    return {
      xScale,
      yScale,
    };
  }

  getZoomContainer = () => {
    if (!this.zoomContainer) {
      // Prevent the continual dom querying.
      this.zoomContainer = this.el.querySelector('.zoom-container') as SVGRectElement;
    }
    return this.zoomContainer;
  };

  /**
   * Setup Zoom
   * Establishes how the chart pans and scales due to gestures and outside date range changes.
   */
  setupZoom() {
    const { xScale, yScale } = this.scales();
    this.zoom = new Zoom({ xScale, yScale }, MOVEMENT_CONFIG, this.getZoomContainer);
    this.zoom.on('zoom.base-chart', (start, end) => {
      this.onDateRangeChange({ start, end });
    });
    this.zoom.init();
  }

  render() {
    const { width, height } = this.size;
    return (
      <svg>
        {this.start != null && this.end != null && <line x1={this.start} y1={0} x2={this.start} y2={height} />}
        {this.start != null && this.end != null && (
          <rect
            class="brush-box"
            x={Math.min(this.start, this.end)}
            height={height}
            width={Math.abs(this.end - this.start)}
            y={0}
          />
        )}
        {this.start != null && this.end != null && <line x1={this.end} y1={0} x2={this.end} y2={height} />}
        <rect class="overlay zoom-container" width={width} height={height} />
      </svg>
    );
  }
}
