import { Annotations } from '../types';
import { ViewPort } from '../../../../utils/dataTypes';
export declare type RenderAnnotationsOptions = {
    container: SVGElement;
    resolution: number;
    annotations: Annotations;
    viewPort: ViewPort;
    size: {
        width: number;
        height: number;
    };
};
export declare const renderAnnotations: ({ container, resolution, annotations, viewPort, size }: RenderAnnotationsOptions) => void;
