import { ChartScene, ViewPortManager } from './types';
import { RectScrollFixed } from '../../utils/types';
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
export declare const createWebGLRenderer: () => {
    initRendering: (renderCanvas: HTMLCanvasElement) => void;
    dispose: () => void;
    render: (chartScene: ChartScene) => void;
    addChartScene: (v: ViewPortManager, shouldSync?: boolean) => void;
    removeChartScene: (chartSceneId: string) => void;
    setChartRect: (sceneId: string, rect: RectScrollFixed) => void;
    updateViewPorts: ({ start, end, manager, preventPropagation, }: {
        start: Date;
        end: Date;
        manager: ViewPortManager;
        preventPropagation?: boolean | undefined;
    }) => void;
    onResolutionChange: () => void;
};
export declare const webGLRenderer: {
    initRendering: (renderCanvas: HTMLCanvasElement) => void;
    dispose: () => void;
    render: (chartScene: ChartScene) => void;
    addChartScene: (v: ViewPortManager, shouldSync?: boolean) => void;
    removeChartScene: (chartSceneId: string) => void;
    setChartRect: (sceneId: string, rect: RectScrollFixed) => void;
    updateViewPorts: ({ start, end, manager, preventPropagation, }: {
        start: Date;
        end: Date;
        manager: ViewPortManager;
        preventPropagation?: boolean | undefined;
    }) => void;
    onResolutionChange: () => void;
};
