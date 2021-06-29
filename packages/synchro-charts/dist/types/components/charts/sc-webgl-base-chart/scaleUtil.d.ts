import { ZoomTransform } from 'd3-zoom';
import { MovementConfig, Scale, ScaleConfig } from '../common/types';
import { SizeConfig, ViewPort } from '../../../utils/dataTypes';
export declare const transformScales: (transform: ZoomTransform, movementOptions: MovementConfig, { xScale, yScale }: {
    xScale: Scale;
    yScale: Scale;
}) => {
    xScale: Scale;
    yScale: Scale;
};
/**
 * Create Scales
 *
 * NOTE: `width` and `height` are defined as the
 * pixel dimensions of the charting area, thus the rectangle defined by
 * them will always be the range.
 */
export declare const createScales: ({ viewPort: { start, end, yMin, yMax }, size: { width, height }, scale: { xScaleType, yScaleType }, }: {
    viewPort: ViewPort;
    size: SizeConfig;
    scale: ScaleConfig;
}) => {
    xScale: Scale;
    yScale: Scale;
};
