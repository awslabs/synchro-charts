import { RectScrollFixed } from '../../utils/types';

export interface ClipSpaceRect {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly width: number;
}

/**
 * Convert a rect to a ClipSpaceRect
 *
 * This will return us the coordinates of a rectangle within clip space coordinates (i.e. coordinate space for webGL)
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection to learn more about clip space
 */
const clipSpaceRect = (containerRect: RectScrollFixed, canvasRect: DOMRectReadOnly): ClipSpaceRect => {
  const density = window.devicePixelRatio;
  const { left, bottom, width, height } = containerRect;

  // The coordinate y-axis is flipped between the DOM and webGL so we must correct for that.
  // Bounding client rect measures the bottom as the distance from the top, i.e.:
  // For DOM, (0, 0) is the top left.
  // In WebGL, (0, 0) is the bottom left.
  const positiveYUpBottom = canvasRect.bottom - (bottom - window.scrollY);

  // Need to account for pixel density - i.e. retina display
  const pixelLeft = (left - canvasRect.left - window.scrollX) * density;
  const pixelBottom = positiveYUpBottom * density;
  const pixelWidth = width * density;
  const pixelHeight = height * density;

  return {
    left: pixelLeft,
    bottom: pixelBottom,
    width: pixelWidth,
    height: pixelHeight,
  };
};

/**
 * Return a rect with the property of being unchanged upon scrolling.
 *
 * The reason this is desirable is because it allows us to not have to re-calculate all our
 * rect's every time a scroll event occurs. This allows for a smooth scroll to occur.
 */
export const rectScrollFixed = (el: HTMLElement): RectScrollFixed => {
  const domRect = el.getBoundingClientRect() as DOMRect;
  return {
    width: domRect.width,
    height: domRect.height,
    left: domRect.left + window.scrollX,
    right: domRect.right + window.scrollX,
    bottom: domRect.bottom + window.scrollY,
    top: domRect.top + window.scrollY,
    x: domRect.x + window.scrollX,
    y: domRect.y + window.scrollY,
    density: window.devicePixelRatio,
  };
};

/**
 * A map of clip-space rectangles for chart scenes.
 *
 * Allows us to track what region in clip-space each chart scene should be rendered in.
 * The goal is to not have to continually make calls to `getBoundingClientRect` since it is an expsensive operation
 * which causes layouts to be re-calculated: http://dcousineau.com/blog/2013/09/03/high-performance-js-tip/
 */
export class ClipSpaceRectMap {
  private canvas: HTMLCanvasElement;
  private rectMap: { [sceneId: string]: RectScrollFixed } = {};
  private canvasRect: DOMRectReadOnly;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.updateCanvas();
  }

  /**
   * Update DOMRect for canvas
   */
  updateCanvas() {
    this.canvasRect = this.canvas.getBoundingClientRect() as DOMRectReadOnly;
  }

  /**
   * Updates the rect for the requested chart scene
   */
  updateChartScene(chartSceneId: string, rect: RectScrollFixed) {
    this.rectMap[chartSceneId] = rect;
  }

  /**
   * Return clip rect for the requested chart scene
   */
  clipRect(chartSceneId: string): ClipSpaceRect | undefined {
    return this.rectMap[chartSceneId] ? clipSpaceRect(this.rectMap[chartSceneId], this.canvasRect) : undefined;
  }

  /**
   * Remove chart scene from rect map
   */
  removeChartScene(chartSceneId: string) {
    delete this.rectMap[chartSceneId];
  }
}
