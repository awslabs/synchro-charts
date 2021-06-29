import { TransitionLike } from 'd3-selection';
import { ZoomTransform } from 'd3-zoom';
import { MovementConfig, Scale } from '../../common/types';
import { ViewPort } from '../../../../utils/dataTypes';
/**
 * Zoom
 *
 * A facade over `d3-zoom` which allows us to utilize the gesture support and concept of transforms, but
 * translated into terms of date range which are more useful for our usecase within sc-webgl-base-chart since
 * we communicate with the dashboards in terms of start and end dates, rather than view port pixel specific transforms.
 */
export default class Zoom {
    private readonly zoomBehavior;
    private readonly movement;
    private readonly getContainer;
    private xScale;
    private yScale;
    constructor({ xScale, yScale }: {
        xScale: Scale;
        yScale: Scale;
    }, movement: MovementConfig, getContainer: () => SVGGElement | undefined);
    /**
     * Initializes the zoom behavior to a DOM element.
     * This must be called after the DOM is already instantiated.
     *
     * This is separated from the constructor since it's possible to have a scenario where
     * the component which the zoom behavior is bound to also is passed down the `Zoom` object,
     * resulting in a scenario where you can't create the `Zoom` class until the component is mounted but
     * you must pass in the `Zoom` object to properly mount the component.
     */
    init(): void;
    transform(transitionContainer: TransitionLike<any, any>, transform: ZoomTransform): void;
    /**
     * On Zoom Event
     *
     * Calls the specified listener passing in the date range which is being requested via some gesture (scroll, pan, etc)
     */
    on(type: string, listener: (start: Date, end: Date) => void): void;
    /**
     * Update View Port
     *
     * Returns the x and y scale with the date range transformed to the specified view port
     * Maintains the internal state of the zoom behavior.
     * TODO: Support gestures on the y axis
     */
    updateViewPort({ start, end, yMin, yMax }: ViewPort): {
        xScale: Scale;
        yScale: Scale;
    };
    /**
     * Update View Port
     *
     * Updates the view port of the scales used as the frame of reference.
     * Also transforms the internal transform state of zoom to map it into the new view port.
     */
    updateSize({ xMin, xMax, yMin, yMax, }: {
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
    }): {
        xScale: Scale;
        yScale: Scale;
    };
    /**
     * Get Transform
     *
     * Returns the transform which is currently applied to our container.
     */
    private getTransform;
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
    private setTransform;
}
