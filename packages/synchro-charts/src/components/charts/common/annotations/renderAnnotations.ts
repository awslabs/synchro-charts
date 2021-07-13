import { Annotation, Annotations, AnnotationValue, XAnnotation, YAnnotation } from '../types';
import { renderXAnnotations, removeXAnnotations } from './XAnnotations/XAnnotations';
import { renderYAnnotations, removeYAnnotations } from './YAnnotations/YAnnotations';
import { ViewPort } from '../../../../utils/dataTypes';
import { draggable } from './draggableAnnotations';

export type RenderAnnotationsOptions = {
  container: SVGElement;
  resolution: number;
  annotations: Annotations;
  viewPort: ViewPort;
  size: { width: number; height: number };
  onUpdate: Function;
  activeViewPort: Function;
  isDraggable?: boolean;
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

export const renderAnnotations = ({
  container,
  resolution,
  annotations,
  viewPort,
  size,
  onUpdate,
  activeViewPort,
  isDraggable,
}: RenderAnnotationsOptions) => {
  if (typeof annotations === 'object' && typeof annotations.show === 'boolean' && !annotations.show) {
    removeXAnnotations({ container });
    removeYAnnotations({ container });
    return;
  }

  // get annotations which have a value that lays within the viewport.
  const xAnnotations: XAnnotation[] = annotations.x == null ? [] : annotations.x.filter(withinViewport(viewPort));
  const yAnnotations: YAnnotation[] = annotations.y == null ? [] : annotations.y.filter(withinViewport(viewPort));

  /**
   * X Annotations
   */
  renderXAnnotations({
    container,
    xAnnotations,
    viewPort,
    resolution,
    size,
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

  if (isDraggable) {
    draggable({
      container,
      viewPort,
      size,
      onUpdate,
      activeViewPort,
    });
  }
};
