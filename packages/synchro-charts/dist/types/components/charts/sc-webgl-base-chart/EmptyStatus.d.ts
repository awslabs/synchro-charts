import { MessageOverrides } from '../../../utils/dataTypes';
/**
 * Provider messaging to clarify that the chart has no data/streams present
 */
export declare const EmptyStatus: ({ isLoading, hasNoDataPresent, hasNoDataStreamsPresent, messageOverrides, displaysNoDataPresentMsg, }: {
    isLoading: boolean;
    hasNoDataPresent: boolean;
    hasNoDataStreamsPresent: boolean;
    messageOverrides: MessageOverrides;
    displaysNoDataPresentMsg: boolean;
}) => any;
