import { DataPoint, Primitive } from '../../../../utils/dataTypes';
import { POINT_TYPE } from '../../sc-webgl-base-chart/activePoints';
import { StatusIcon } from '../../common/constants';
export declare class ScLegendRow {
    streamId: string;
    label: string;
    updateDataStreamName: ({ streamId, name }: {
        streamId: string;
        name: string;
    }) => void;
    isEditing: boolean;
    isLoading: boolean;
    showDataStreamColor: boolean;
    color: string;
    detailedLabel?: string;
    point?: DataPoint<Primitive>;
    unit?: string;
    pointType?: POINT_TYPE;
    valueColor?: string;
    icon?: StatusIcon;
    updateName: (name: string) => void;
    render(): any;
}
