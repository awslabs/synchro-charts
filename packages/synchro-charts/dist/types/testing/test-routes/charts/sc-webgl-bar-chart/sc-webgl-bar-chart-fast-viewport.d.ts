import { DataStream } from '../../../../utils/dataTypes';
/**
 * Used to test the behavior of a bar chart when changing viewport fast and wide
 */
export declare class ScWebglBarChartFastViewport {
    dataStreams: DataStream<number>[];
    colorIndex: number;
    start: Date;
    end: Date;
    private idx;
    private timeRange;
    changeViewport: () => void;
    render(): any;
}
