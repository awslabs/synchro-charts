import { DataPoint } from '../../../../utils/dataTypes';
export declare class StatusChartDynamicBuffer {
    data: DataPoint<number>[];
    addDataPoint: () => void;
    render(): any;
}
