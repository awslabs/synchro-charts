import { DataStream } from '../../../utils/dataTypes';
export declare class ScWebglChartStandard {
    chartKeys: {
        key: string;
        data: DataStream[];
    }[];
    width: number;
    xOffset: number;
    shiftLeft: () => void;
    shiftRight: () => void;
    increaseWidth: () => void;
    decreaseWidth: () => void;
    addChartAtFront: () => void;
    addChartAtBack: () => void;
    removeFrontChart: () => void;
    removeBackChart: () => void;
    render(): any;
}
