import { ZoomBehavior, ZoomedElementBaseType } from 'd3-zoom';
import { BaseChartConfig } from '../../common/types';
/**
 * Create Zoom Behavior
 * Handles the translation between the `config` properties and the zoom behavior's properties.
 */
export declare const createZoomBehavior: ({ movement: { zoomMin, zoomMax }, }: BaseChartConfig) => ZoomBehavior<ZoomedElementBaseType, unknown>;
