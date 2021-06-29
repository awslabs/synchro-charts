import { DataPoint, DataStream, ViewPort } from '../../../utils/dataTypes';
import { LegendConfig, Threshold, ThresholdColorAndIcon } from '../common/types';
import { TrendResult } from '../common/trends/types';
export declare class ScLegend {
    config: LegendConfig;
    viewPort: ViewPort;
    dataStreams: DataStream[];
    updateDataStreamName: ({ streamId, name }: {
        streamId: string;
        name: string;
    }) => void;
    visualizesAlarms: boolean;
    isEditing: boolean;
    isLoading: boolean;
    thresholds: Threshold[];
    supportString: boolean;
    showDataStreamColor: boolean;
    trendResults: TrendResult[];
    visualizedDataStreams: () => DataStream[];
    /**
     * Returns the given color of a breached threshold, if there is one.
     */
    breachedThresholdColor: (point: DataPoint | undefined, dataStream: DataStream) => ThresholdColorAndIcon | undefined;
    render(): any;
}
