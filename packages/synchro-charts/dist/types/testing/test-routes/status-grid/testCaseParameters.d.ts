import { Primitive } from '../../../utils/dataTypes';
export declare type SearchQueryParams = {
    showIcon?: boolean;
    isEnabled?: boolean;
    latestValue?: Primitive;
    threshold?: Primitive;
    numDataStreams?: number;
    showValue?: boolean;
    showName?: boolean;
    showUnit?: boolean;
    isEditing?: boolean;
};
/**
 * Construct a search query which embeds the test case parameters we wish to utilize.
 *
 * Use this to construct test route URLs for integration testing.
 */
export declare const constructSearchQuery: ({ latestValue, threshold, showIcon, isEnabled, numDataStreams, showValue, showName, showUnit, isEditing, }: SearchQueryParams) => string;
/**
 * Parse the URL Search Query to construct models to build a test case out of.
 */
export declare const testCaseParameters: () => {
    threshold: any;
    latestValue: string | number | null;
    numDataStreams: number;
    isEnabled: boolean;
    labelsConfig: {
        showName: boolean;
        showValue: boolean;
        showUnit: boolean;
    };
    isEditing: boolean;
};
