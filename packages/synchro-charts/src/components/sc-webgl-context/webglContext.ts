/* eslint-disable @typescript-eslint/no-use-before-define */
import { WebGLRenderer } from 'three';
import { ChartScene } from './types';
import { ClipSpaceRect, ClipSpaceRectMap } from '../common/webGLPositioning';
import { RectScrollFixed } from '../../utils/types';
import { ViewportHandler } from '../viewportHandler/viewportHandler';
import { isValid } from '../../utils/predicates';
import { ViewPortManager } from '../viewportHandler/types';

const isChartScene = isValid((v: Partial<ChartScene>) => v.camera != null);

/**
 * Render Scene Info
 *
 * Renders a single chart scene, which will represent a single, rectangular view of data
 * within the shared WebGL context.
 *
 * This technique is inspired by https://threejsfundamentals.org/threejs/lessons/threejs-multiple-scenes.html
 * In summary, each chart scene has an HTML element  - and the associated scene is rendered to overlay on the
 * rectangle defined by the given HTML element.
 */
const renderChartScene = (
  renderer: WebGLRenderer,
  { scene, camera }: ChartScene,
  { left, bottom, width, height }: ClipSpaceRect
): void => {
  renderer.setScissor(left, bottom, width, height);
  renderer.setViewport(left, bottom, width, height);
  renderer.render(scene, camera);
};

/**
 * Set the renderer to the size of the screen, adjust for resolution.
 *
 * Needs to be called every time the display size, or resolution changes.
 */
function resizeRendererToDisplaySize(renderer: WebGLRenderer): boolean {
  const canvas = renderer.domElement;
  const width = Math.floor(canvas.clientWidth * window.devicePixelRatio) || 0;
  const height = Math.floor(canvas.clientHeight * window.devicePixelRatio) || 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

/**
 * Create a webGL renderer
 *
 * Creates a single webGL rendering context which can be shared across different visualizations.
 * The primary motivator for sharing a single WebGL context is due to the overhead and limitations on making multiple WebGL Context.
 * Resources such as buffered data and textures cannot be shared across WebGL Contexts, and furthermore, due to performance considerations
 * of have many WebGL Contexts, certain browsers have a hard limit on the number of active WebGL Contexts.
 *
 * Refer to https://stackoverflow.com/questions/59140439/allowing-more-webgl-contexts for additional context.
 */
export const createWebGLRenderer = () => {
  let rectMap: ClipSpaceRectMap;
  const sceneManager: ViewportHandler<ViewPortManager> = new ViewportHandler();

  /**
   * Add Chart Scene
   *
   * Adds a chart scene to be rendered within the webGL context.
   * Once added, the given `ChartScene` will be part of the animation loop until explicitly removed.
   *
   * @param shouldSync - determines whether the new scene should sync to the existing view port, or if it
   *                     should instead use the viewport provided with the chart
   */
  const addChartScene = (v: ViewPortManager, shouldSync = true) => {
    sceneManager.add(v, shouldSync);
  };

  /**
   * Remove Chart Scene
   *
   * Remove and dispose of a given scene.
   */
  const removeChartScene = (chartSceneId: string) => {
    mustBeInitialized();
    sceneManager.remove(chartSceneId);

    rectMap.removeChartScene(chartSceneId);
    fullClearAndRerender();
  };

  /**
   * Initiate Rendering Loop
   *
   * Begins a rendering loop to render all chart streams onto the provided canvas
   */
  let renderer: WebGLRenderer | undefined;
  let canvas: HTMLCanvasElement | undefined;

  const fullClearAndRerender = () => {
    if (renderer) {
      // Turn off scissor test to make the clear effect the entire canvas
      renderer.setScissorTest(false);

      // Important to set the clear color again, since the webGL context may have been lost, causing
      // the clear color to be reset to the default.
      renderer.setClearColor(0xffffff, 0);
      renderer.clear();
      renderer.setScissorTest(true);

      // Re-render every chart scene. Necessary since entire canvas has been cleared
      const chartScenes: ChartScene[] = sceneManager.managers().filter(isChartScene);
      chartScenes.forEach(render);
    }
  };

  const onScroll = () => {
    if (renderer && canvas) {
      const transform = `translate(${window.scrollX}px, ${window.scrollY}px)`;
      if (renderer.domElement.style) {
        // eslint-disable-next-line no-param-reassign
        renderer.domElement.style.transform = transform;
      }

      rectMap.updateCanvas();
      fullClearAndRerender();
    }
  };

  const onResize = () => {
    mustBeInitialized();

    if (renderer && canvas) {
      resizeRendererToDisplaySize(renderer);
      rectMap.updateCanvas();
      fullClearAndRerender();
    }
  };

  const initRendering = (renderCanvas: HTMLCanvasElement) => {
    rectMap = new ClipSpaceRectMap(renderCanvas);
    canvas = renderCanvas;
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });

    // Enable scissor test, which allows us to render our visualizations to a subset of the canvas
    // https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setScissor
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor
    renderer.setScissorTest(true);
    renderer.setClearColor(0x000000, 0); // transparent clear
    onScroll();
    onResize();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
  };

  /**
   * Enforces that the webgl context must first be initialized.
   *
   * Throws an error when the initialized has failed to occur.
   */
  const mustBeInitialized = () => {
    if (rectMap == null) {
      throw new Error(
        'webgl context must be initialized before it can be utilized. ' +
          'Please refer to https://synchrocharts.com/#/Setup to learn more about how to setup Synchro Charts.'
      );
    }
  };

  const render = (chartScene: ChartScene) => {
    mustBeInitialized();

    const clipSpaceRect = rectMap.clipRect(chartScene.id);
    if (renderer && canvas && clipSpaceRect) {
      renderChartScene(renderer, chartScene, clipSpaceRect);
    }
  };

  const dispose = () => {
    if (renderer) {
      renderer.dispose();
    }

    sceneManager.dispose();

    /** Release event listeners */
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };

  /**
   * Registers the position and dimension of where the requested chart scene renders to.
   * Clears the previous renderer location if it exists.
   */
  const setChartRect = (sceneId: string, rect: RectScrollFixed) => {
    mustBeInitialized();
    rectMap.updateChartScene(sceneId, rect);
    fullClearAndRerender();
  };

  /**
   * This must be called every time resolution has changed.
   */
  const onResolutionChange = () => {
    onResize();
  };

  return {
    initRendering,
    dispose,
    render,
    addChartScene,
    removeChartScene,
    setChartRect,
    updateViewPorts: sceneManager.syncViewPortGroup,
    onResolutionChange,
  };
};

// TODO: Rather than exposing this as a singleton, it would be preferred to expose it as
//  a shared context within a component sub-tree.
export const webGLRenderer = createWebGLRenderer();
