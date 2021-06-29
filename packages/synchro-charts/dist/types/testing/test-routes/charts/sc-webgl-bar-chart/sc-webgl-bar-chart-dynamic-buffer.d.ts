import { DataPoint } from '../../../../utils/dataTypes';
export declare class ScWebglBarChartDynamicBuffer {
    data: DataPoint<number>[];
    addDataPoint: () => void;
    render(): any;
}
