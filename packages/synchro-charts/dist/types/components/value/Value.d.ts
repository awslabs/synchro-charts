import { Primitive } from '../../utils/dataTypes';
/**
 * Display value of a data point, supports all data types
 */
export declare const Value: ({ isEnabled, value, unit }: {
    isEnabled?: boolean | undefined;
    value?: string | number | undefined;
    unit?: string | undefined;
}) => any[] | "-";
