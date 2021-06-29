import { SizeConfig, ViewPort } from '../../../utils/dataTypes';
export declare class ScGestureHandler {
    el: HTMLElement;
    size: SizeConfig;
    viewPort: ViewPort;
    onDateRangeChange: ({ end, start }: {
        start: Date;
        end: Date;
    }) => void;
    start?: number;
    end?: number;
    private zoom;
    private zoomContainer;
    private initialViewPort;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    onViewPortChange(newViewPort: ViewPort): void;
    onSizeChange(): void;
    /**
     * Initiate the start of a brush gesture by clicking
     */
    beginBrush: ({ offsetX, shiftKey }: MouseEvent) => void;
    /**
     * Continue a brushing gesture by holding the mouse button and dragging
     */
    moveBrush: ({ offsetX, buttons, shiftKey }: MouseEvent) => void;
    /**
     * Conclude a brushing gesture by letting the mouse button go.
     */
    finishBrush: ({ shiftKey }: MouseEvent) => void;
    cancelBrush: () => void;
    initiateTransform: (startPx: number, endPx: number) => void;
    scales(): {
        xScale: import("d3-scale").ScaleTime<number, number>;
        yScale: import("d3-scale").ScaleLinear<number, number>;
    };
    getZoomContainer: () => SVGRectElement;
    /**
     * Setup Zoom
     * Establishes how the chart pans and scales due to gestures and outside date range changes.
     */
    setupZoom(): void;
    render(): any;
}
