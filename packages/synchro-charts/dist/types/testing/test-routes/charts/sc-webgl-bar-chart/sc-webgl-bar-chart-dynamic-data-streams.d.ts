import { DataStream } from '../../../../utils/dataTypes';
/**
 * Used to test the behavior of a bar chart when adding/removing data streams
 */
export declare class ScWebglBarChartDynamicDataStreams {
    dataStreams: DataStream<number>[];
    colorIndex: number;
    private colors;
    increaseColorIndex: () => void;
    getColor: () => string;
    addStream: () => void;
    removeStream: () => void;
    render(): any;
}
