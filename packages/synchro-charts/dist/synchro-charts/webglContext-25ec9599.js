import { W as WebGLRenderer } from './three.module-af3affdd.js';
import { i as isValid } from './predicates-ced25765.js';

/**
 * Convert a rect to a ClipSpaceRect
 *
 * This will return us the coordinates of a rectangle within clip space coordinates (i.e. coordinate space for webGL)
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection to learn more about clip space
 */
const clipSpaceRect = (containerRect, canvasRect) => {
    const density = window.devicePixelRatio;
    const { left, bottom, width, height } = containerRect;
    const canvasHeight = canvasRect.height;
    // The coordinate y-axis is flipped between the DOM and webGL so we must correct for that.
    // Bounding client rect measures the bottom as the distance from the top, i.e.:
    // For DOM, (0, 0) is the top left.
    // In WebGL, (0, 0) is the bottom left.
    const positiveYUpBottom = canvasHeight - (bottom - window.scrollY);
    // Need to account for pixel density - i.e. retina display
    const pixelLeft = (left - window.scrollX) * density;
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
const rectScrollFixed = (el) => {
    const domRect = el.getBoundingClientRect();
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
class ClipSpaceRectMap {
    constructor(canvas) {
        this.rectMap = {};
        this.canvas = canvas;
        this.updateCanvas();
    }
    /**
     * Update DOMRect for canvas
     */
    updateCanvas() {
        this.canvasRect = this.canvas.getBoundingClientRect();
    }
    /**
     * Updates the rect for the requested chart scene
     */
    updateChartScene(chartSceneId, rect) {
        this.rectMap[chartSceneId] = rect;
    }
    /**
     * Return clip rect for the requested chart scene
     */
    clipRect(chartSceneId) {
        return this.rectMap[chartSceneId] ? clipSpaceRect(this.rectMap[chartSceneId], this.canvasRect) : undefined;
    }
    /**
     * Remove chart scene from rect map
     */
    removeChartScene(chartSceneId) {
        delete this.rectMap[chartSceneId];
    }
}

/**
 * Handlers the syncing view port across different view port groups.
 *
 * This allows us to have defined groupings of widgets which all efficiently have their viewports synced
 * without utilizing any framework level code.
 *
 * This allows us to have performant syncing of charts.
 */
class ViewPortHandler {
    constructor() {
        this.viewPortManagers = [];
        this.viewPortMap = {};
        this.managers = () => {
            // NOTE: Providing new reference to a array to prevent manipulation of the internal array from the outside.
            return [...this.viewPortManagers];
        };
        this.dispose = () => {
            this.viewPortManagers.forEach(({ id }) => this.remove(id));
        };
        this.add = (v, shouldSync = true) => {
            this.viewPortManagers = [...this.viewPortManagers, v];
            /**
             * If the added chart scene is part of a view port group, sync it's viewport to
             * the current viewport groups time span.
             */
            if (v.viewPortGroup && this.viewPortMap[v.viewPortGroup] && shouldSync) {
                v.updateViewPort(this.viewPortMap[v.viewPortGroup]);
            }
        };
        this.remove = (managerId) => {
            const v = this.viewPortManagers.find(({ id }) => id === managerId);
            // Dispose of the chart scene to ensure that the memory is released
            if (v) {
                v.dispose();
            }
            // Remove manager from list of registered view port managers
            this.viewPortManagers = this.viewPortManagers.filter(({ id }) => id !== managerId);
        };
        /**
         * Sync all viewports sharing the group of the given chart scene, to have their viewport being at `start`,
         * and ending at `end`.
         *
         * preventPropagation - if true, then we sync all viewports to the provided viewport. Otherwise it only updates the handlers internal state.
         * manager - the manager which is the source of this syncing
         */
        this.syncViewPortGroup = ({ start, end, manager, preventPropagation = false, }) => {
            if (manager.viewPortGroup) {
                this.viewPortMap[manager.viewPortGroup] = { start, end };
            }
            if (!preventPropagation) {
                const updateViewPort = (v) => {
                    v.updateViewPort({ start, end });
                };
                if (manager.viewPortGroup) {
                    /** Get all of the groups which belong within the viewport group */
                    const managers = this.viewPortManagers.filter(({ viewPortGroup: group }) => manager.viewPortGroup === group);
                    /**  Sync all of the chart scenes within the viewport group. */
                    managers.forEach(updateViewPort);
                }
                else {
                    /**
                     * No view port group defined, so only update the camera associated with the
                     * scene which emitted the event (no syncing of other charts.)
                     */
                    updateViewPort(manager);
                }
            }
        };
    }
}

/* eslint-disable @typescript-eslint/no-use-before-define */
const isChartScene = isValid((v) => v.camera != null);
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
const renderChartScene = (renderer, { scene, camera }, { left, bottom, width, height }) => {
    renderer.setScissor(left, bottom, width, height);
    renderer.setViewport(left, bottom, width, height);
    renderer.render(scene, camera);
};
/**
 * Set the renderer to the size of the screen, adjust for resolution.
 *
 * Needs to be called every time the display size, or resolution changes.
 */
function resizeRendererToDisplaySize(renderer) {
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
const createWebGLRenderer = () => {
    let rectMap;
    const sceneManager = new ViewPortHandler();
    /**
     * Add Chart Scene
     *
     * Adds a chart scene to be rendered within the webGL context.
     * Once added, the given `ChartScene` will be part of the animation loop until explicitly removed.
     *
     * @param shouldSync - determines whether the new scene should sync to the existing view port, or if it
     *                     should instead use the viewport provided with the chart
     */
    const addChartScene = (v, shouldSync = true) => {
        sceneManager.add(v, shouldSync);
    };
    /**
     * Remove Chart Scene
     *
     * Remove and dispose of a given scene.
     */
    const removeChartScene = (chartSceneId) => {
        sceneManager.remove(chartSceneId);
        rectMap.removeChartScene(chartSceneId);
        fullClearAndRerender();
    };
    /**
     * Initiate Rendering Loop
     *
     * Begins a rendering loop to render all chart streams onto the provided canvas
     */
    let renderer;
    let canvas;
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
            const chartScenes = sceneManager.managers().filter(isChartScene);
            chartScenes.forEach(render);
        }
    };
    const onScroll = () => {
        if (renderer && canvas) {
            const transform = `translate(${window.scrollX}px, ${window.scrollY}px)`;
            // eslint-disable-next-line no-param-reassign
            renderer.domElement.style.transform = transform;
            rectMap.updateCanvas();
            fullClearAndRerender();
        }
    };
    const onResize = () => {
        if (renderer && canvas) {
            resizeRendererToDisplaySize(renderer);
            rectMap.updateCanvas();
            fullClearAndRerender();
        }
    };
    const initRendering = (renderCanvas) => {
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
    const render = (chartScene) => {
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
    const setChartRect = (sceneId, rect) => {
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
const webGLRenderer = createWebGLRenderer();

export { rectScrollFixed as r, webGLRenderer as w };
