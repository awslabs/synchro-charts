import { Annotation, Annotations, AnnotationValue, Threshold } from '../types';
import { Primitive, ViewPort } from '../../../../utils/dataTypes';
/**
 * Returns only thresholds defined for number
 * @param thresholds
 */
export declare const getNumberThresholds: (thresholds: Threshold[]) => Threshold[];
/**
 * Returns only annotations defined for numbers
 * @param annotations
 */
export declare const getNumberAnnotations: (annotations: Annotations) => Annotations;
/**
 * Getters
 */
export declare const getColor: (annotation: Annotation<AnnotationValue>) => string;
export declare const getValueAndText: ({ annotation, resolution, viewPort, }: {
    annotation: Annotation<AnnotationValue>;
    resolution: number;
    viewPort: ViewPort;
}) => string;
export declare const getText: (annotation: Annotation<AnnotationValue>) => string;
export declare const getValueText: ({ annotation, resolution, viewPort, }: {
    annotation: Annotation<AnnotationValue>;
    resolution: number;
    viewPort: ViewPort;
}) => string;
export declare const isThresholdBreached: (value: Primitive, threshold: Threshold) => boolean;
/**
 * Given a list of thresholds, we sort the by the value of the threshold from least to greatest and
 * by the comparators order from least to greatest
 *
 * In the event of multiple thresholds with the same value, the threshold with the highest order will be the
 * one that takes precedence, and other rules colliding will be ignored.
 *
 * Below is an example of sorted threshold:
 *   2 2  2 2     5 5  5 5
 *  >= > <= <    >= > <= <
 */
export declare const sortThreshold: (thresholds: Threshold[]) => Threshold[];
/**
 * Gets the most relevant threshold which is considered breached by a given value.
 *
 * The most relevant threshold to a point is determined by the threshold value and its comparator.
 *
 * When there are two or more relevant thresholds to a point,
 *
 * 1) When the value is positive, then we will take the upper threshold, which is the greater one
 *
 * 2) When the value is negative, then we will take the lower threshold, which is the lesser one.
 */
export declare const getBreachedThreshold: (value: Primitive, thresholds: Threshold[]) => Threshold | undefined;
export declare const isThreshold: (t: Partial<Threshold<Primitive>>) => t is Threshold<Primitive>;
export declare const getThresholds: (annotations: Annotations | undefined) => Threshold[];
