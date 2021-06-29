import { POINT_TYPE } from '../charts/sc-webgl-base-chart/activePoints';
export declare class ScDataStreamName {
    el: HTMLElement;
    displayTooltip?: boolean;
    onNameChange: (name: string) => void;
    isEditing: boolean;
    label: string;
    detailedLabel?: string;
    pointType?: POINT_TYPE;
    date?: Date;
    private tooltip;
    disconnectedCallback(): void;
    renderTooltip: () => void;
    render(): any;
}
