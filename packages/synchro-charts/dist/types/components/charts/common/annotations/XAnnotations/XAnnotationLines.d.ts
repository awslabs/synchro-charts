import { XAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';
export declare const LINE_SELECTOR = "line.x";
export declare const renderXAnnotationLines: ({ container, xAnnotations, viewPort, size: { width, height }, }: {
    container: SVGElement;
    xAnnotations: XAnnotation[];
    viewPort: ViewPort;
    size: {
        width: number;
        height: number;
    };
}) => void;
export declare const removeXAnnotationLines: ({ container }: {
    container: SVGElement;
}) => void;
