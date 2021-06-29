import { SpecPage } from '../../stencil-public-runtime';
import { Components } from '../../components.d';
export declare type ChartProps = Components.ScLineChart;
export declare type ChartSpecPage = (props: Partial<ChartProps>) => Promise<{
    page: SpecPage;
    chart: HTMLElement;
}>;
export interface DisableList {
    annotations?: boolean;
    trends?: boolean;
    viewport?: boolean;
    yRange?: boolean;
    legend?: boolean;
}
export declare const newChartSpecPage: (tagName: string) => ChartSpecPage;
