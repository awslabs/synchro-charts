import { DataStreamInfo } from '../../utils/dataTypes';
export declare class WidgetTestRoute {
    dataStreamInfos: DataStreamInfo[];
    component: string;
    onWidgetUpdated({ detail: configUpdate }: CustomEvent): void;
    render(): any;
}
