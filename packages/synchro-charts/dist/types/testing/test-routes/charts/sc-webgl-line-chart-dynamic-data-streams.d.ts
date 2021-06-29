import { DataStream } from '../../../utils/dataTypes';
/**
 * Used to test the behavior of a line chart when adding/removing data streams
 */
export declare class ScWebglLineChartDynamicDataStreams {
    dataStreams: DataStream<number>[];
    addStream: () => void;
    removeStream: () => void;
    render(): any;
}
