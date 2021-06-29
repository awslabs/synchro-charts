import { DataPoint, Primitive } from '../../utils/dataTypes';
import { Threshold } from '../charts/common/types';
export declare class ScGridTooltip {
    el: HTMLElement;
    isEnabled: boolean;
    title: string;
    propertyPoint?: DataPoint<Primitive>;
    alarmPoint?: DataPoint<Primitive>;
    breachedThreshold?: Threshold;
    private tooltip;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    displayToolTip: () => void;
    render(): any;
}
