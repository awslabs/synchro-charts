import { DataStream, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { Threshold } from '../common/types';
import { TrendResult } from '../common/trends/types';
import { DATA_ALIGNMENT } from '../common/constants';
/**
 * The parent tooltip container, listens for events to ensure tooltip renders at the correct position at the correct time.
 */
export declare class ScTooltip {
    size: SizeConfig;
    dataContainer: HTMLElement;
    dataStreams: DataStream[];
    viewPort: ViewPort;
    thresholds: Threshold[];
    trendResults: TrendResult[];
    maxDurationFromDate?: number;
    showDataStreamColor: boolean;
    supportString: boolean;
    visualizesAlarms: boolean;
    showBlankTooltipRows: boolean;
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
    top: number;
    sortPoints: boolean;
    selectedDate?: Date;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    setSelectedDate: ({ offsetX, buttons }: MouseEvent) => void;
    hideTooltip: () => void;
    render(): any;
}
