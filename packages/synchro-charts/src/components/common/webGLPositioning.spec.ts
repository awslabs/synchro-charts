import { ClipSpaceRectMap, rectScrollFixed } from './webGLPositioning';

const INITIAL_CANVAS_HEIGHT = 500;
const INITIAL_CANVAS_WIDTH = 650;

type CanvasRect = {
  height: number;
  width: number;
  top: number;
  right: number;
  left: number;
  bottom: number;
  x: number;
  y: number;
};

const createCanvas = (dimensions?: Partial<CanvasRect>): HTMLCanvasElement => {
  const canvas = new HTMLCanvasElement();
  canvas.getBoundingClientRect = () =>
    ({
      width: INITIAL_CANVAS_WIDTH,
      height: INITIAL_CANVAS_HEIGHT,
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      bottom: INITIAL_CANVAS_HEIGHT,
      right: INITIAL_CANVAS_WIDTH,
      toJSON: () => '',
      ...dimensions,
    } as DOMRect);
  return canvas;
};

const createDiv = ({ width, height, x, y }: { width: number; height: number; x: number; y: number }) => {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({
    x,
    y,
    width,
    height,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    toJSON: () => '',
  });
  return el;
};

describe('clip space mapping', () => {
  it('returns clip rect when properly set', () => {
    const CHART_SCENE_ID = '1';
    const WIDTH = 100;
    const HEIGHT = 100;
    const X = 0;
    const Y = 0;

    const clipSpaceRectMap = new ClipSpaceRectMap(createCanvas());
    const el = createDiv({
      width: WIDTH,
      height: HEIGHT,
      x: X,
      y: Y,
    });

    clipSpaceRectMap.updateChartScene(CHART_SCENE_ID, rectScrollFixed(el));

    expect(clipSpaceRectMap.clipRect(CHART_SCENE_ID)).toEqual({
      width: WIDTH,
      height: HEIGHT,
      left: 0,
      bottom: INITIAL_CANVAS_HEIGHT - HEIGHT,
    });
  });

  it('returns clip rect from a canvas that is interior to the viewport', () => {
    const canvasDimensions = {
      bottom: 711,
      height: 681,
      left: 30,
      right: 1004,
      top: 30,
      width: 974,
      x: 30,
      y: 30,
    };

    const chartDimensions = {
      bottom: 500,
      height: 446,
      left: 80,
      right: 480,
      top: 54,
      width: 400,
      x: 80,
      y: 54,
    };

    const CHART_SCENE_ID = '1';

    const clipSpaceRectMap = new ClipSpaceRectMap(createCanvas(canvasDimensions));
    const el = createDiv(chartDimensions);

    clipSpaceRectMap.updateChartScene(CHART_SCENE_ID, rectScrollFixed(el));

    expect(clipSpaceRectMap.clipRect(CHART_SCENE_ID)).toEqual({
      width: chartDimensions.width,
      height: chartDimensions.height,
      left: chartDimensions.left - canvasDimensions.left,
      bottom: canvasDimensions.bottom - chartDimensions.bottom,
    });
  });

  it('clip space rect does not change when canvas has change but not been explicitly updated', () => {
    const CHART_SCENE_ID = '1';
    const WIDTH = 100;
    const HEIGHT = 100;
    const X = 0;
    const Y = 0;

    const canvas = createCanvas();

    const clipSpaceRectMap = new ClipSpaceRectMap(canvas);
    const el = createDiv({
      width: WIDTH,
      height: HEIGHT,
      x: X,
      y: Y,
    });

    clipSpaceRectMap.updateChartScene(CHART_SCENE_ID, rectScrollFixed(el));

    const UPDATED_CANVAS_WIDTH = INITIAL_CANVAS_WIDTH + 100;
    const UPDATED_CANVAS_HEIGHT = INITIAL_CANVAS_HEIGHT + 55;
    canvas.getBoundingClientRect = () => ({
      width: UPDATED_CANVAS_WIDTH,
      height: UPDATED_CANVAS_HEIGHT,
      x: 0,
      y: 0,
      left: 0,
      right: UPDATED_CANVAS_WIDTH,
      top: 0,
      bottom: UPDATED_CANVAS_HEIGHT,
      toJSON: () => '',
    });

    expect(clipSpaceRectMap.clipRect(CHART_SCENE_ID)).toEqual({
      width: WIDTH,
      height: HEIGHT,
      left: 0,
      bottom: INITIAL_CANVAS_HEIGHT - HEIGHT,
    });
  });

  it('clip space rect does change when canvas has changed and updateCanvas has been called', () => {
    const CHART_SCENE_ID = '1';
    const WIDTH = 100;
    const HEIGHT = 100;
    const X = 0;
    const Y = 0;

    const canvas = createCanvas();

    const clipSpaceRectMap = new ClipSpaceRectMap(canvas);
    const el = createDiv({
      width: WIDTH,
      height: HEIGHT,
      x: X,
      y: Y,
    });

    clipSpaceRectMap.updateChartScene(CHART_SCENE_ID, rectScrollFixed(el));

    const UPDATED_CANVAS_WIDTH = INITIAL_CANVAS_WIDTH + 100;
    const UPDATED_CANVAS_HEIGHT = INITIAL_CANVAS_HEIGHT + 55;
    canvas.getBoundingClientRect = () => ({
      width: UPDATED_CANVAS_WIDTH,
      height: UPDATED_CANVAS_HEIGHT,
      x: 0,
      y: 0,
      left: 0,
      right: UPDATED_CANVAS_WIDTH,
      top: 0,
      bottom: UPDATED_CANVAS_HEIGHT,
      toJSON: () => '',
    });
    clipSpaceRectMap.updateCanvas();

    expect(clipSpaceRectMap.clipRect(CHART_SCENE_ID)).toEqual({
      width: WIDTH,
      height: HEIGHT,
      left: 0,
      bottom: UPDATED_CANVAS_HEIGHT - HEIGHT,
    });
  });

  it('returns undefined when chart scene is not set', () => {
    const UNREGISTERED_CHART_SCENE_ID = '1';
    const clipSpaceRectMap = new ClipSpaceRectMap(createCanvas());

    expect(clipSpaceRectMap.clipRect(UNREGISTERED_CHART_SCENE_ID)).toBeUndefined();
  });
});
