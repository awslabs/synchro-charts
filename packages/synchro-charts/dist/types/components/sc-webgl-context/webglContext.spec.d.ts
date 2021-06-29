import 'webgl-mock-threejs';
export declare const createTestWebglRenderer: (domRect: DOMRect) => {
    initRendering: (renderCanvas: HTMLCanvasElement) => void;
    dispose: () => void;
    render: (chartScene: import("./types").ChartScene) => void;
    addChartScene: (v: import("./types").ViewPortManager, shouldSync?: boolean) => void;
    removeChartScene: (chartSceneId: string) => void;
    setChartRect: (sceneId: string, rect: import("../../utils/types").RectScrollFixed) => void;
    updateViewPorts: ({ start, end, manager, preventPropagation, }: {
        start: Date;
        end: Date;
        manager: import("./types").ViewPortManager;
        preventPropagation?: boolean | undefined;
    }) => void;
    onResolutionChange: () => void;
};
