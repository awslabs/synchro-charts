import { Threshold } from '../../charts/common/types';
import { DataPoint, DataStream, Primitive, MessageOverrides, MinimalViewPortConfig } from '../../../utils/dataTypes';
export declare class ScKpiBase {
    breachedThreshold?: Threshold;
    alarmStream?: DataStream;
    alarmPoint?: DataPoint<Primitive>;
    propertyStream?: DataStream;
    propertyPoint?: DataPoint<Primitive>;
    messageOverrides: MessageOverrides;
    viewPort: MinimalViewPortConfig;
    trendStream: DataStream | undefined;
    isEditing: boolean;
    isEnabled: boolean;
    miniVersion: boolean;
    onChangeLabel: ({ streamId, name }: {
        streamId: string;
        name: string;
    }) => void;
    isLoading?: boolean;
    isRefreshing?: boolean;
    valueColor?: string;
    getValues: () => {
        latestPoint?: DataPoint<Primitive> | undefined;
        previousPoint?: DataPoint<Primitive> | undefined;
    };
    /**
     * Update Name
     *
     * Given a change in the 'title' of the widget, fire off the correct data stream name change.
     */
    updateName: (name: string) => void;
    fontColor: (latestPoint?: DataPoint<Primitive> | undefined) => string;
    fontSize: () => number;
    iconSize: () => number;
    render(): any;
}
