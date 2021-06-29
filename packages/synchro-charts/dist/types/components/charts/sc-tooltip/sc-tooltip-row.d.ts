import { POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import { DataPoint } from '../../../utils/dataTypes';
import { StatusIcon } from '../common/constants';
export declare class ScTooltipRow {
    label: string;
    resolution: number | undefined;
    color: string;
    point: DataPoint | undefined;
    showDataStreamColor: boolean;
    pointType: POINT_TYPE;
    valueColor?: string;
    icon?: StatusIcon;
    render(): any;
}
