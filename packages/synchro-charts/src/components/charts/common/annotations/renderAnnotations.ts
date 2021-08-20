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
  inDragState: () => boolean;
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

let dragHandler; // need to hold onto the dragHandle selector to dispose of it properly to prevent memory leak

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
  inDragState,
}: RenderAnnotationsOptions) => {
  if (typeof annotations === 'object' && typeof annotations.show === 'boolean' && !annotations.show) {
    removeXAnnotations({ container });
    removeYAnnotations({ container });
    return;
  }

  // get annotations which have a value that lays within the viewport.
  const xAnnotations: XAnnotation[] = annotations.x == null ? [] : annotations.x.filter(withinViewport(viewport));
  const yAnnotations: YAnnotation[] = annotations.y == null ? [] : annotations.y.filter(withinViewport(viewport));

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
  });

  if (!inDragState()) {
    // do not re-render editable annotations in drag state
    /**
     * Y Annotations Editable (Draggable)
     */
    dragHandler = renderYAnnotationsEditable({
      container,
      yAnnotations,
      viewport,
      resolution,
      size,
    });

    // prevents more event listeners from being attached when we drag
    draggable({
      container,
      size,
      onUpdate,
      activeViewPort,
      emitUpdatedWidgetConfiguration,
      startStopDragging,
      resolution,
      dragHandle: dragHandler,
    });
  }
};
