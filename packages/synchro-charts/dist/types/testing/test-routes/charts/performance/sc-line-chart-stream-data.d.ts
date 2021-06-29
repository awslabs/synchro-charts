import { DataPoint, ViewPort } from '../../../../utils/dataTypes';
export declare class ScLineChartStreamData {
    dataPoints: DataPoint<number>[];
    viewPort: ViewPort;
    private dataLoop;
    private viewPortShifter;
    viewPortLoop: () => number;
    componentWillLoad(): void;
    disconnectedCallback(): void;
    render(): any;
}
