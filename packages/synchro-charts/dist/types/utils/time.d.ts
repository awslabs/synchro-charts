export declare const SECOND_IN_MS = 1000;
export declare const MINUTE_IN_MS: number;
export declare const HOUR_IN_MS: number;
export declare const DAY_IN_MS: number;
export declare const MONTH_IN_MS: number;
export declare const YEAR_IN_MS: number;
export declare const SHORT_TIME = "hh:mm a";
export declare const FULL_DATE = "yyy-MM-dd hh:mm:ss a";
/**
 * ConvertMS is a helper function that will take in milliseconds and convert it to the highest detonator
 * and does not return the "remainder"
 *
 * It is important to note that the object returning does not represent equivalence!
 *
 * For Example:
 * convert(MINUTE_IN_MS) will return:
 * {
 *   day: 0,
 *   hour: 0
 *   minute: 1,
 *   seconds: 0,
 * }
 *
 * IT DOES NOT RETURN:
 *
 * {
 *   day: 0,
 *   hour: 0,
 *   minute: 1,
 *   seconds: 60, <--- does not return the "equivalence"
 * }
 */
export declare const convertMS: (milliseconds: number) => {
    day: number;
    hour: number;
    minute: number;
    seconds: number;
};
export declare const displayDate: (date: Date, resolution: number, { start, end }: {
    start: Date;
    end: Date;
}) => string;
