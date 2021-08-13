import { Annotation, Annotations, AnnotationValue, XAnnotation, YAnnotation } from '../types';
import { renderXAnnotations, removeXAnnotations } from './XAnnotations/XAnnotations';
import { renderYAnnotations, removeYAnnotations, renderYAnnotationsEditable } from './YAnnotations/YAnnotations';
import { DataStream, ViewPort } from '../../../../utils/dataTypes';
import { DraggableAnnotationsOptions } from './draggableAnnotations';

export type RenderAnnotationsOptions = {
  container: SVGElement;
  resolution: number;
  annotations: Annotations;
  viewport: ViewPort;
  size: { width: number; height: number };
  onUpdate: (
    { start, end }: { start: Date; end: Date },
    hasDataChanged: boolean,
    hasSizeChanged: boolean,
    hasAnnotationChanged: boolean
  ) => void;
  activeViewPort: () => ViewPort;
  emitUpdatedWidgetConfiguration: (dataStreams?: DataStream[]) => void;
  draggable: (draggableOptions: DraggableAnnotationsOptions) => void;
  startStopDragging: (dragState: boolean) => void;
};

type AnnotationPredicate = (annotation: Annotation<AnnotationValue>) => boolean;

const withinViewport = (viewport: ViewPort): AnnotationPredicate => {
  return ({ value }: Annotation<AnnotationValue>) => {
    if (typeof value === 'number') {
      return viewport.yMin <= value && viewport.yMax >= value;
    }
    return viewport.start <= value && viewport.end >= value;
  };
};

export const renderAnnotations = ({
  container,
  resolution,
  annotations,
  viewport,
  size,
  onUpdate,
  activeViewPort,
  emitUpdatedWidgetConfiguration,
  draggable,
  startStopDragging,
}: RenderAnnotationsOptions) => {
  if (typeof annotations === 'object' && typeof annotations.show === 'boolean' && !annotations.show) {
    removeXAnnotations({ container });
    removeYAnnotations({ container });
    return;
  }

  // get annotations which have a value that lays within the viewport.
  const xAnnotations: XAnnotation[] = annotations.x == null ? [] : annotations.x.filter(withinViewport(viewport));
  const yAnnotations: YAnnotation[] = annotations.y == null ? [] : annotations.y.filter(withinViewport(viewport));

  // we only support gradients if all annotations have an id (in order to associate an id with its proper gradient)
  const enableThresholdGradient =
    (annotations.displayThresholdGradient ? annotations.displayThresholdGradient : false) &&
    yAnnotations.every(yAnnotation => yAnnotation.id !== undefined);

  /**
   * X Annotations
   */
  renderXAnnotations({
    container,
    xAnnotations,
    viewport,
    resolution,
    size,
  });

  /**
   * Y Annotations
   */
  renderYAnnotations({
    container,
    yAnnotations,
    viewport,
    resolution,
    size,
    renderThresholdGradient: enableThresholdGradient,
  });

  /**
   * Y Annotations Editable (Draggable)
   */
  renderYAnnotationsEditable({
    container,
    yAnnotations,
    viewport,
    resolution,
    size,
    renderThresholdGradient: enableThresholdGradient,
  });

  draggable({
    container,
    viewport,
    size,
    onUpdate,
    activeViewPort,
    emitUpdatedWidgetConfiguration,
    startStopDragging,
  });
};
