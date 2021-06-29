import { DataPoint } from '../../../../utils/dataTypes';
/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a status chart when adding/removing data points
 */
export declare class StatusChartDynamicData {
    data: DataPoint<number>[];
    monthIndex: number;
    addDataPoint: () => void;
    removeDataPoint: () => void;
    render(): any;
}
