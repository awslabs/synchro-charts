import { DataPoint, DataStream, MessageOverrides } from '../../../utils/dataTypes';
import { Threshold } from '../../charts/common/types';
import { LabelsConfig } from '../../common/types';
import { StatusIcon } from '../../charts/common/constants';
export declare class ScStatusCell {
    messageOverrides: MessageOverrides;
    breachedThreshold?: Threshold;
    alarmStream?: DataStream;
    alarmPoint?: DataPoint;
    propertyStream?: DataStream;
    propertyPoint?: DataPoint;
    isEnabled: boolean;
    valueColor?: string;
    icon?: StatusIcon;
    labelsConfig: Required<LabelsConfig>;
    isEditing: boolean;
    onChangeLabel: ({ streamId, name }: {
        streamId: string;
        name: string;
    }) => void;
    /**
     * Update Name
     *
     * Given a change in the 'title' of the widget, fire off the correct data stream name change.
     */
    updateName: (name: string) => void;
    render(): any;
}
