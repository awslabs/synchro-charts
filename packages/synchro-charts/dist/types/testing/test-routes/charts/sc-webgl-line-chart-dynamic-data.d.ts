import { DataPoint } from '../../../utils/dataTypes';
export declare class ScWebglLineChartDynamicData {
    data: DataPoint<number>[];
    addDataPoint: () => void;
    removeDataPoint: () => void;
    render(): any;
}
