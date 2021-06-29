import { RectScrollFixed } from '../../utils/types';
export interface ClipSpaceRect {
    readonly bottom: number;
    readonly height: number;
    readonly left: number;
    readonly width: number;
}
/**
 * Return a rect with the property of being unchanged upon scrolling.
 *
 * The reason this is desirable is because it allows us to not have to re-calculate all our
 * rect's every time a scroll event occurs. This allows for a smooth scroll to occur.
 */
export declare const rectScrollFixed: (el: HTMLElement) => RectScrollFixed;
/**
 * A map of clip-space rectangles for chart scenes.
 *
 * Allows us to track what region in clip-space each chart scene should be rendered in.
 * The goal is to not have to continually make calls to `getBoundingClientRect` since it is an expsensive operation
 * which causes layouts to be re-calculated: http://dcousineau.com/blog/2013/09/03/high-performance-js-tip/
 */
export declare class ClipSpaceRectMap {
    private canvas;
    private rectMap;
    private canvasRect;
    constructor(canvas: HTMLCanvasElement);
    /**
     * Update DOMRect for canvas
     */
    updateCanvas(): void;
    /**
     * Updates the rect for the requested chart scene
     */
    updateChartScene(chartSceneId: string, rect: RectScrollFixed): void;
    /**
     * Return clip rect for the requested chart scene
     */
    clipRect(chartSceneId: string): ClipSpaceRect | undefined;
    /**
     * Remove chart scene from rect map
     */
    removeChartScene(chartSceneId: string): void;
}
