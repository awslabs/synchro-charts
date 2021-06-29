import { YAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';
export declare const TEXT_SELECTOR = "text.y";
export declare const TEXT_VALUE_SELECTOR = "text.yValueText";
export declare const renderYAnnotationTexts: ({ container, yAnnotations, viewPort, resolution, size: { width, height }, }: {
    container: SVGElement;
    yAnnotations: YAnnotation[];
    viewPort: ViewPort;
    resolution: number;
    size: {
        width: number;
        height: number;
    };
}) => void;
export declare const removeYAnnotationTexts: ({ container }: {
    container: SVGElement;
}) => void;
