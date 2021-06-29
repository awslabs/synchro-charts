import { TooltipPoint } from './types';
import { Timestamp, ViewPort } from '../../../utils/dataTypes';
export declare const tooltipPosition: ({ viewPort, size: { width, height }, points, resolution, selectedTimestamp, }: {
    viewPort: ViewPort;
    size: {
        width: number;
        height: number;
    };
    points: TooltipPoint[];
    selectedTimestamp: Timestamp;
    resolution: number;
}) => undefined | {
    x: number;
    y: number;
};
