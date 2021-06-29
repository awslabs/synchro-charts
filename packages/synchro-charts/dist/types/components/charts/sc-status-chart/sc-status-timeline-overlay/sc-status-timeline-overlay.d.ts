import { EventEmitter } from '../../../../stencil-public-runtime';
import { DataStream, SizeConfig } from '../../../../utils/dataTypes';
import { WidgetConfigurationUpdate, Threshold } from '../../common/types';
import { NameValue } from '../../../sc-data-stream-name/helper';
export declare class ScStatusTimelineOverlay {
    size: SizeConfig;
    dataStreams: DataStream[];
    thresholds: Threshold[];
    date: Date;
    widgetId: string;
    isEditing: boolean;
    /** Widget data stream names */
    names: NameValue[];
    widgetUpdated: EventEmitter<WidgetConfigurationUpdate>;
    /**
     * On Widget Updated - Persist `DataStreamInfo`
     *
     * Emits an event which persists the current `NameValue[]` state into the
     * data stream info.
     */
    onWidgetUpdated(): void;
    onChangeLabel: ({ streamId, name }: {
        streamId: string;
        name: string;
    }) => void;
    render(): any;
}
