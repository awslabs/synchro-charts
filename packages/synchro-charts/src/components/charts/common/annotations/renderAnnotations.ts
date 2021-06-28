import { Annotation, Annotations, AnnotationValue, XAnnotation, YAnnotation } from '../types';
import { renderXAnnotationTexts, removeXAnnotationTexts } from './XAnnotations/XAnnotationTexts';
import { renderYAnnotations, removeYAnnotations } from './YAnnotations/YAnnotations';
import { renderXAnnotationLines, removeXAnnotationLines } from './XAnnotations/XAnnotationLines';
import { ViewPort } from '../../../../utils/dataTypes';

export type RenderAnnotationsOptions = {
  container: SVGElement;
  resolution: number;
  annotations: Annotations;
  viewPort: ViewPort;
  size: { width: number; height: number };
};

type AnnotationPredicate = (annotation: Annotation<AnnotationValue>) => boolean;

const withinViewport = (viewPort: ViewPort): AnnotationPredicate => {
  return ({ value }: Annotation<AnnotationValue>) => {
    if (typeof value === 'number') {
      return viewPort.yMin <= value && viewPort.yMax >= value;
    }
    return viewPort.start <= value && viewPort.end >= value;
  };
};

export const renderAnnotations = ({ container, resolution, annotations, viewPort, size }: RenderAnnotationsOptions) => {
  if (typeof annotations === 'object' && typeof annotations.show === 'boolean' && !annotations.show) {
    removeXAnnotationLines({ container });
    removeXAnnotationTexts({ container });
    removeYAnnotations({ container });
    return;
  }

  // get annotations which have a value that lays within the viewport.
  const xAnnotations: XAnnotation[] = annotations.x == null ? [] : annotations.x.filter(withinViewport(viewPort));
  const yAnnotations: YAnnotation[] = annotations.y == null ? [] : annotations.y.filter(withinViewport(viewPort));

  /**
   * X Annotations Text
   */
  renderXAnnotationTexts({
    container,
    xAnnotations,
    viewPort,
    resolution,
    width: size.width,
  });

  /**
   * Y Annotations
   */
  renderYAnnotations({
    container,
    yAnnotations,
    viewPort,
    resolution,
    size,
  });

  /**
   * X Annotations Lines
   */
  renderXAnnotationLines({
    container,
    xAnnotations,
    viewPort,
    size,
  });
};
