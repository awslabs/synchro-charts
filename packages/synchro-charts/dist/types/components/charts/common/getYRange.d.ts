import { DataPoint } from '../../../utils/dataTypes';
import { YAnnotation } from './types';
export declare type YRange = {
    yMin: number;
    yMax: number;
};
export declare const DEFAULT_Y_RANGE: YRange;
export declare const getYRange: ({ points, yAnnotations, startFromZero, }: {
    points: DataPoint[];
    yAnnotations: YAnnotation[];
    startFromZero: boolean;
}) => YRange;
export declare const currentYRange: () => ({ points, yAnnotations, startFromZero, }: {
    points: DataPoint[];
    yAnnotations: YAnnotation[];
    startFromZero: boolean;
}) => YRange;
