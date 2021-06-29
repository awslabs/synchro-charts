import { DataStream, MessageOverrides, MinimalViewPortConfig, TableColumn } from '../../utils/dataTypes';
import { Trend } from '../charts/common/trends/types';
import { Annotations, ChartConfig, Threshold } from '../charts/common/types';
export declare class ScTable implements ChartConfig {
    viewPort: MinimalViewPortConfig;
    widgetId: string;
    dataStreams: DataStream[];
    annotations: Annotations;
    trends: Trend[];
    liveModeOnlyMessage: string;
    messageOverrides: MessageOverrides;
    /** Table column values */
    tableColumns: TableColumn[];
    /** Active Viewport */
    start: Date;
    end: Date;
    duration?: number;
    onViewPortChange(newViewPort: MinimalViewPortConfig): void;
    onUpdate: ({ start, end, duration }: {
        start: Date;
        end: Date;
        duration?: number | undefined;
    }) => void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    getThresholds: () => Threshold[];
    render(): any;
}
