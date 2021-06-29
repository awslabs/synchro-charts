import { DataPoint } from '../../../../utils/dataTypes';
/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Used to test the behavior of a scatter chart when adding/removing data points
 */
export declare class ScScatterChartDynamicData {
    data: DataPoint<number>[];
    addDataPoint: () => void;
    removeDataPoint: () => void;
    render(): any;
}
