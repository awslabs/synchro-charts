import { Primitive } from '../../../../utils/dataTypes';
import { StatusIcon } from '../../common/constants';
export declare class ScStatusTimelineOverlayRow {
    label: string;
    isEditing: boolean;
    onNameChange: (name: string) => void;
    valueColor?: string;
    detailedLabel?: string;
    value?: Primitive;
    icon?: StatusIcon;
    unit?: string;
    render(): any[];
}
