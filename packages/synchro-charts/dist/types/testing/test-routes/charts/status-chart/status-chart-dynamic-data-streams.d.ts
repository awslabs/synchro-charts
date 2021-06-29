import { DataStream } from '../../../../utils/dataTypes';
/**
 * Used to test the behavior of a status chart when adding/removing data streams
 */
export declare class StatusChartDynamicDataStreams {
    dataStreams: DataStream<number>[];
    colorIndex: number;
    private colors;
    increaseColorIndex: () => void;
    getColor: () => string;
    addStream: () => void;
    removeStream: () => void;
    render(): any;
}
