import { Primitive } from './dataTypes';
/**
 * Rounds a number to a pre-determined precision
 *
 * i.e. round(100000.1234) => 100000.1234
 *      round(100000.12345678) => 100000.1234
 *      round(.02345678) => 0.02346
 */
export declare const round: (num: number) => number;
/**
 * Checks if value can be used as a number
 */
export declare const isNumeric: (value: Primitive) => boolean;
