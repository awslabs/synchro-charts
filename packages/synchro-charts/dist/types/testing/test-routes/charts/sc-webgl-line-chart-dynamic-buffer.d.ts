import { DataPoint } from '../../../utils/dataTypes';
export declare class ScWebglLineChartDynamicBuffer {
    data: DataPoint<number>[];
    addDataPoint: () => void;
    render(): any;
}
