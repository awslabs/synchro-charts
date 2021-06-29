export declare type Interval = [number, number];
export declare type IntervalStructure<T> = {
    intervals: Interval[];
    items: T[][];
};
/**
 * If compareFn(a, b) returns less than 0, sort a to an index lower than b (i.e. a comes first).
 * If compareFn(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behavior, thus, not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
 * If compareFn(a, b) returns greater than 0, sort b to an index lower than a (i.e. b comes first).
 */
declare type CompareFn<T> = (a: T, b: T) => number;
export declare const isContained: <T>(structure: IntervalStructure<T>, interval: Interval) => boolean;
export declare const intersect: (aIntervals: Interval[], bIntervals: Interval[]) => Interval[];
export declare const subtractIntervals: (interval: Interval, intervals: Interval[]) => Interval[];
/**
 * Merges together to lists of items given a way to compare items.
 *
 * Returns back a single list of items, sorted by `compare`, with no duplicates.
 *
 * `aItems` and `bItems` are assumed to be sorted by `compare`.
 *
 * If `aItems` and `bItems` have overlap, always take the items specified in `aItems`
 */
export declare const mergeItems: <T>(aItems: T[], bItems: T[], compare: CompareFn<T>) => T[];
export declare const addInterval: <T>(intervalStructure: IntervalStructure<T>, interval: Interval, items: T[], compare: CompareFn<T>) => IntervalStructure<T>;
export {};
