import { event, select, TransitionLike } from 'd3-selection';
import { zoom, ZoomBehavior, zoomIdentity, ZoomTransform } from 'd3-zoom';

import { MovementConfig, Scale } from '../../common/types';
import { transformScales } from '../scaleUtil';
import { getTransformedDateRange, getTransformFromDates } from './transformUtil';
import { filterGestures } from './filterGestures';
import { ViewPort } from '../../../../utils/dataTypes';

type ZoomContainer = SVGGElement & { __zoom: ZoomTransform };

/**
 * Zoom
 *
 * A facade over `d3-zoom` which allows us to utilize the gesture support and concept of transforms, but
 * translated into terms of date range which are more useful for our usecase within iot-app-kit-vis-webgl-base-chart since
 * we communicate with the dashboards in terms of start and end dates, rather than view port pixel specific transforms.
 */
export default class Zoom {
  private readonly zoomBehavior: ZoomBehavior<any, any>;
  private readonly movement: MovementConfig;
  // The zoom object may be constructed before it's container is constructed.
  private readonly getContainer: () => ZoomContainer | undefined;
  // Scales are references to the initial frame of reference.
  // This is due to transforms being applied absolutely against the initial frame of reference.
  private xScale: Scale;
  private yScale: Scale;

  constructor(
    { xScale, yScale }: { xScale: Scale; yScale: Scale },
    movement: MovementConfig,
    getContainer: () => SVGGElement | undefined
  ) {
    this.zoomBehavior = zoom()
      .scaleExtent([movement.zoomMin, movement.zoomMax])
      .filter(filterGestures);
    this.xScale = xScale.copy();
    this.yScale = yScale.copy();
    this.movement = movement;
    this.getContainer = getContainer as () => ZoomContainer;
  }

  /**
   * Initializes the zoom behavior to a DOM element.
   * This must be called after the DOM is already instantiated.
   *
   * This is separated from the constructor since it's possible to have a scenario where
   * the component which the zoom behavior is bound to also is passed down the `Zoom` object,
   * resulting in a scenario where you can't create the `Zoom` class until the component is mounted but
   * you must pass in the `Zoom` object to properly mount the component.
   */
  public init() {
    const container = this.getContainer();
    if (container == null) {
      throw new Error('Must not init Zoom before the container is available!');
    }
    select(container).call(this.zoomBehavior);
  }

  public transform(transitionContainer: TransitionLike<any, any>, transform: ZoomTransform) {
    this.zoomBehavior.transform(transitionContainer as any, transform);
  }

  /**
   * On Zoom Event
   *
   * Calls the specified listener passing in the date range which is being requested via some gesture (scroll, pan, etc)
   */
  public on(type: string, listener: (start: Date, end: Date) => void) {
    this.zoomBehavior.on(type, () => {
      const { startDate, endDate } = getTransformedDateRange({
        xScale: this.xScale,
        transform: event.transform,
      });
      listener(startDate, endDate);
    });
  }

  /**
   * Update View Port
   *
   * Returns the x and y scale with the date range transformed to the specified view port
   * Maintains the internal state of the zoom behavior.
   * TODO: Support gestures on the y axis
   */
  public updateViewPort({ start, end, yMin, yMax }: ViewPort): { xScale: Scale; yScale: Scale } {
    const [prevStart, prevEnd] = this.xScale.domain() as [Date, Date];
    const transform = getTransformFromDates({
      prevXScale: this.xScale,
      prevDates: { start: prevStart, end: prevEnd },
      currDates: { start, end },
    });
    this.setTransform(transform);
    return transformScales(transform, this.movement, {
      xScale: this.xScale,
      yScale: this.yScale.domain([yMin, yMax]) as Scale,
    });
  }

  /**
   * Update View Port
   *
   * Updates the view port of the scales used as the frame of reference.
   * Also transforms the internal transform state of zoom to map it into the new view port.
   */
  public updateSize({
    xMin,
    xMax,
    yMin,
    yMax,
  }: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  }): { xScale: Scale; yScale: Scale } {
    // Apply the new view port to the transform (transform the transform!)
    const { x, y, k } = this.getTransform();
    const [prevXMin, prevXMax] = this.xScale.range();
    const xRatio = (xMax - xMin) / (prevXMax - prevXMin);
    // Update Viewports
    this.xScale.range([xMin, xMax]);
    this.yScale.range([yMin, yMax]);
    this.setTransform(zoomIdentity.translate(x * xRatio, y).scale(k));

    return transformScales(this.getTransform(), this.movement, {
      xScale: this.xScale,
      yScale: this.yScale,
    });
  }

  /**
   * Get Transform
   *
   * Returns the transform which is currently applied to our container.
   */
  private getTransform(): ZoomTransform {
    const container = this.getContainer();
    if (container == null) {
      throw new Error('Container must not be null to set a internal zoom transform');
    }
    /* eslint-disable-next-line no-underscore-dangle */
    return container.__zoom;
  }

  /**
   * Set Internal Zoom Transform
   *
   * Updates the zoom containers state. This is necessary because we wish to apply
   * transforms which did not stem from the zoom behavior itself.
   *
   * IMPORTANT: Whenever a transformation is applied to the DOM from a transform
   * emitted by something other than the associated zoom container, one must
   * set the internal zoom transform manually.
   *
   * You can see from the source code, https://github.com/d3/d3-zoom/blob/master/src/transform.js
   * that `__zoom` is the property which stores the internal state of which transform is currently applied.
   *
   * NOTE: This does not apply the transform. It simply tells d3-zoom what transform was last set.
   */
  private setTransform(transform: ZoomTransform) {
    const container = this.getContainer();
    if (container == null) {
      throw new Error('Container must not be null to set a internal zoom transform');
    }
    /* eslint-disable-next-line no-underscore-dangle */
    container.__zoom = transform;
  }
}
