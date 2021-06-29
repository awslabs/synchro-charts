export declare const getBarMargin: (toClipSpace: (time: number) => number, resolution: number) => number;
/**
 * Get the bar width
 *
 * Returns the clipSpace width which each bar should be.
 * It is assumed that each bar within a group will have the same width.
 */
export declare const getBarWidth: ({ toClipSpace, resolution, numDataStreams, }: {
    toClipSpace: (time: number) => number;
    numDataStreams: number;
    resolution: number;
}) => number;
