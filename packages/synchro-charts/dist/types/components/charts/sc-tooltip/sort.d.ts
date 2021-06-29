import { DataPoint, Primitive } from '../../../utils/dataTypes';
/**
 * Sorts points in order of their points values.
 * Places objects with no point at the end of the list.
 */
export declare const sortTooltipPoints: (attr: (point: DataPoint<Primitive>) => number | string) => (a: {
    point?: DataPoint<Primitive>;
}, b: {
    point?: DataPoint<Primitive>;
}) => number;
