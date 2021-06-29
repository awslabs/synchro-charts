import { ZoomTransform } from 'd3-zoom';
import { MovementConfig, Scale } from '../../common/types';
export declare const createBrushTransform: ({ xScale, xSelectedPixelMax, xSelectedPixelMin, xScaleOriginal, movement, }: {
    xScale: Scale;
    xScaleOriginal: Scale;
    xSelectedPixelMax: number;
    xSelectedPixelMin: number;
    movement: MovementConfig;
}) => ZoomTransform;
