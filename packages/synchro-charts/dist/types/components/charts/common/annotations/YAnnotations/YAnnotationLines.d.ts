import { YAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';
export declare const LINE_SELECTOR = "line.y";
export declare const renderYAnnotationLines: ({ container, yAnnotations, viewPort, size: { width, height }, }: {
    container: SVGElement;
    yAnnotations: YAnnotation[];
    viewPort: ViewPort;
    size: {
        width: number;
        height: number;
    };
}) => void;
export declare const removeYAnnotationLines: ({ container }: {
    container: SVGElement;
}) => void;
