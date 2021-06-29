import { XAnnotation } from '../../types';
import { ViewPort } from '../../../../../utils/dataTypes';
export declare const TEXT_SELECTOR = "text.x";
export declare const renderXAnnotationTexts: ({ container, xAnnotations, viewPort, resolution, width, }: {
    container: SVGElement;
    xAnnotations: XAnnotation[];
    viewPort: ViewPort;
    resolution: number;
    width: number;
}) => void;
export declare const removeXAnnotationTexts: ({ container }: {
    container: SVGElement;
}) => void;
