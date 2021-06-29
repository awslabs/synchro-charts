import { ViewPort } from '../../../utils/dataTypes';
/**
 * Get Pixel Density in terms of the clip space
 *
 * Returns the ratio of model space to pixel space in each dimension.
 * i.e. how many pixels does 10 minutes represent on a given `container`?
 */
export declare const pixelDensity: ({ viewPort: { end, start, yMax, yMin }, toClipSpace, size, }: {
    viewPort: ViewPort;
    toClipSpace: (time: number) => number;
    size: {
        width: number;
        height: number;
    };
}) => {
    x: number;
    y: number;
};
