import { MINUTE_IN_MS } from '../../../utils/time';

/**
 * Display Constants
 *
 * Adjust these to scale the margins provided within the status chart.
 * This represent which fraction of the 'width' of a given status group a margin.
 */

export const HEIGHT = 1;

// a small fudge factor due to the anti aliasing applied on the edges of the visualization.
// the ideal solution would be to fix the shader to give a crisp line.
const MARGIN_FUDGE_FACTOR = 0.5;
// must match css variable --timeline-row-margin-top, with a small fudge factor removed
export const STATUS_MARGIN_TOP_PX = 34 - MARGIN_FUDGE_FACTOR;

// This determines the maximum width in terms of duration, for a single raw point of data within the status chart.
export const MAX_RAW_RESOLUTION_DURATION = MINUTE_IN_MS;

export const DEFAULT_STATUS_BAR_COLOR_1 = [213, 219, 219]; // (r, g, b) from 0 to 255
export const DEFAULT_STATUS_BAR_COLOR_2 = [135, 149, 150]; // (r, g, b) from 0 to 255
