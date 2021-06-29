import { DataPoint, DataStream, DataStreamId, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { TooltipPoint } from './types';
import { Threshold, ThresholdColorAndIcon } from '../common/types';
import { TrendResult } from '../common/trends/types';
import { DATA_ALIGNMENT } from '../common/constants';
/**
 * The Display Component for the tool tip.
 *
 * Renders the tooltip, tooltip container, the tooltip line and the tool tip rows
 */
export declare class ScTooltipRows {
    selectedDate: Date;
    size: SizeConfig;
    dataStreams: DataStream[];
    viewPort: ViewPort;
    thresholds: Threshold[];
    trendResults: TrendResult[];
    maxDurationFromDate?: number;
    showDataStreamColor: boolean;
    supportString: boolean;
    showBlankTooltipRows: boolean;
    visualizesAlarms: boolean;
    /**
     * If we are drawing data from the data timestamp to timestamp + resolution
     * we want the tooltip to align on the left side
     *
     * Otherwise we are drawing the data from timestamp - resolution to timestamp
     * then we want the tooltip to align on the right side
     */
    dataAlignment: DATA_ALIGNMENT;
    /**
     * CSS Top property for the tooltip container
     */
    top?: number;
    sortPoints?: boolean;
    /** Total height of the tool tip display */
    tooltipHeight: (numRows: number) => number;
    /**
     * Returns the color to display the value within a legend row.
     *
     * Takes into account whether the data stream is breached.
     * Does not take into account associated alarms
     */
    rowsValueColorAndIcon: (id: DataStreamId, { y }: DataPoint, date: Date) => ThresholdColorAndIcon | undefined;
    /**
     * The point in time which is 'actively' being viewed within the tooltip.
     */
    getDisplayedDate: (points: TooltipPoint[]) => Date;
    /**
     * Returns the data which is supported
     *
     * i.e. if `supportsString` is false, do not return any data streams of string type
     */
    visualizedDataStreams: () => DataStream[];
    /**
     * Return each of the 'points' to be displayed
     *
     * each of these will correspond to one `tooltip-row`
     */
    getTooltipPoints: () => TooltipPoint[];
    render(): any;
}
