import { select, event, Selection, BaseType } from 'd3-selection';
import { drag } from 'd3-drag';
import throttle from 'lodash.throttle';
import { Annotation, AnnotationValue, YAnnotation } from '../types';
import { DataStream, ViewPort } from '../../../../utils/dataTypes';
import {
  ANNOTATION_GROUP_SELECTOR_EDITABLE,
  ANNOTATION_GROUP_SELECTOR,
  HANDLE_OFFSET_Y,
  ELEMENT_GROUP_SELECTOR,
  TEXT_VALUE_SELECTOR,
} from './YAnnotations/YAnnotations';
import { getY } from './YAnnotations/utils';
import { getValueText } from './utils';

export type DraggableAnnotationsOptions = {
  container: SVGElement;
  size: { width: number; height: number };
  onUpdate: (
    { start, end }: { start: Date; end: Date },
    hasDataChanged: boolean,
    hasSizeChanged: boolean,
    hasAnnotationChanged: boolean
  ) => void;
  activeViewPort: () => ViewPort;
  emitUpdatedWidgetConfiguration: (dataStreams?: DataStream[]) => void;
  startStopDragging: (dragState: boolean) => void;
  yAnnotations: YAnnotation[];
  resolution: number;
  dragHandle: Selection<any, any, any, any>;
};

/**
 * Calculate new threshold value based on where the cursor is dragged
 * Returns the new threshold value and whether the viewport needs to be adjusted
 */
const calculateNewThreshold = ({
  yPos,
  viewport,
  size,
}: {
  yPos: number;
  viewport: ViewPort;
  size: { height: number };
}): number => {
  const { height } = size;
  const { yMax, yMin } = viewport;
  const newVal = (height * yMax - yMax * yPos + yMin * yPos) / height;

  /** We truncate the newVal to 1/1000 of the axis scale to prevent unnecessary precision */
  const yAxisScale = (yMax - yMin) / 1000;
  const decimalDigits = Math.log(yAxisScale) / Math.log(10);

  if (decimalDigits >= 0) {
    return +newVal.toFixed(0);
  }
  return +newVal.toFixed(-decimalDigits);
};

const needAxisRescale = ({ annotationValue, viewport }: { annotationValue: number; viewport: ViewPort }): boolean => {
  const { yMax, yMin } = viewport;
  const lowerThreshold = yMin + 0.01 * (yMax - yMin);
  const upperThreshold = yMin + 0.99 * (yMax - yMin);
  return annotationValue < lowerThreshold || annotationValue > upperThreshold;
};

export const FOCUS_TRANSITION_TIME = 100; // milliseconds of the focus mode transition
const FOCUS_OPACITY = 0.32; // the opacity of the other handles that are not selected for dragging
const UPDATE_THROTTLE_MS = 90;

/**
 * Draggable Thresholds Feature
 */
export const attachDraggable = () => {
  let draggedAnnotationValue: number | undefined; // this is necessary to prevent race condition (new annotation value) from occurring during the drag process

  const internalUpdate = throttle(
    ([onUpdate, viewport]: [
      (
        { start, end }: { start: Date; end: Date },
        hasDataChanged: boolean,
        hasSizeChanged: boolean,
        hasAnnotationChanged: boolean
      ) => void,
      { start: Date; end: Date }
    ]) => {
      onUpdate(viewport, false, false, true);
    },
    UPDATE_THROTTLE_MS
  );

  const draggable = ({
    container,
    size,
    onUpdate,
    activeViewPort,
    emitUpdatedWidgetConfiguration,
    startStopDragging,
    dragHandle,
    resolution,
  }: DraggableAnnotationsOptions): void => {
    const { height } = size;

    const getGroupPosition = (draggedAnnotation: YAnnotation, viewport: ViewPort): string => {
      return `translate(0,${getY({ annotation: draggedAnnotation, height, viewport })})`;
    };

    const getHandlePosition = (draggedAnnotation: YAnnotation, viewport: ViewPort): number => {
      return getY({ annotation: draggedAnnotation, height, viewport }) + HANDLE_OFFSET_Y;
    };
    dragHandle.call(
      drag()
        .on('start', function dragStarted(yAnnotation: unknown) {
          const annotationDragged = yAnnotation as YAnnotation;
          if (!annotationDragged.isEditable) {
            return;
          }
          startStopDragging(true);
          draggedAnnotationValue = +annotationDragged.value;
          select(this).classed('active', true);

          select(container)
            .selectAll(`${ANNOTATION_GROUP_SELECTOR_EDITABLE},${ANNOTATION_GROUP_SELECTOR}`)
            .filter(annotation => annotation !== yAnnotation)
            .transition()
            .duration(FOCUS_TRANSITION_TIME)
            .attr('opacity', FOCUS_OPACITY);
        })
        .on('drag', function handleDragged(yAnnotation: unknown) {
          /** Drag Event */
          const annotationDragged = yAnnotation as YAnnotation;
          if (!annotationDragged.isEditable) {
            return;
          }
          let viewport = activeViewPort();

          const { y: yPos } = event as { y: number };
          const draggedValue = calculateNewThreshold({ yPos, viewport, size });
          annotationDragged.value = draggedValue;
          draggedAnnotationValue = draggedValue;

          // re-rendering of everything except threshold
          const axisRescale = needAxisRescale({ annotationValue: annotationDragged.value as number, viewport });
          if (axisRescale) {
            console.log('axis rescale');
            onUpdate(viewport, false, axisRescale, true);
            viewport = activeViewPort();
          } else {
            internalUpdate([onUpdate, viewport]);
          }

          const handle = select(this);

          handle.attr('y', getHandlePosition(annotationDragged, viewport));

          const elementGroup = select(container)
            .selectAll(`${ELEMENT_GROUP_SELECTOR}`)
            .filter(annotation => annotation === yAnnotation)
            .attr('transform', getGroupPosition(annotationDragged, viewport));

          elementGroup
            .select(TEXT_VALUE_SELECTOR)
            .text(getValueText({ annotation: annotationDragged, resolution, viewport, formatText: true }));
        })
        .on('end', function dragEnded(yAnnotation: unknown) {
          const annotationDragged = yAnnotation as YAnnotation;
          if (!annotationDragged.isEditable) {
            return;
          }
          annotationDragged.value = draggedAnnotationValue
            ? (draggedAnnotationValue as number)
            : annotationDragged.value;
          const viewport = activeViewPort();
          /** emit event updating annotation on mouse up */
          emitUpdatedWidgetConfiguration();
          const axisRescale = needAxisRescale({ annotationValue: annotationDragged.value as number, viewport });
          onUpdate(viewport, false, axisRescale, true);

          select(this).classed('active', false);

          startStopDragging(false);

          select(container)
            .selectAll(`${ANNOTATION_GROUP_SELECTOR_EDITABLE},${ANNOTATION_GROUP_SELECTOR}`)
            .transition()
            .duration(FOCUS_TRANSITION_TIME)
            .attr('opacity', 1);
        }) as any
    );
  };

  return draggable;
};
