export declare const getAggregationFrequency: (dataResolution: number, aggregatedLevel: string) => string;
/**
 * Updated name value and it's associated data stream id
 *
 * Used to represent unpersisted editing state.
 */
export declare type NameValue = {
    id: string;
    name: string;
};
/**
 * Updates the `NameValue` it exists, otherwise creates a new `NameValue`.
 */
export declare const updateName: (names: NameValue[], name: string, id: string) => NameValue[];
