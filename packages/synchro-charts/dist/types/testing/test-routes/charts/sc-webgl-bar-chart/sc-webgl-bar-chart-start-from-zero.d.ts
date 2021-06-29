import { DataPoint } from '../../../../utils/dataTypes';
/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that bar chart starts from 0
 */
export declare class ScWebglBarChartStartFromZero {
    testData: DataPoint<number>[];
    changeDataDirection: () => void;
    render(): any;
}
