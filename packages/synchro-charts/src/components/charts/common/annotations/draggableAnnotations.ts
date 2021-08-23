import { select, event, Selection } from 'd3-selection';
import { drag } from 'd3-drag';
import throttle from 'lodash.throttle';
import { Annotation, YAnnotation } from '../types';
import { DataStream, ViewPort } from '../../../../utils/dataTypes';
import {
  ANNOTATION_GROUP_SELECTOR_EDITABLE,
  ANNOTATION_GROUP_SELECTOR,
  HANDLE_OFFSET_Y,
  ELEMENT_GROUP_SELECTOR,
  TEXT_VALUE_SELECTOR,
  DRAGGABLE_HANDLE_SELECTOR,
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

  return +newVal.toFixed(decimalDigits >= 0 ? 0 : -decimalDigits);
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
 * Given a annotation container, it will mask by change the opacity of all Y annotation that is not
 * the currentDraggedAnnotation
 */
const maskNonDraggedAnnotations = ({
  on,
  container,
  currentDraggedAnnotation,
}: {
  on: boolean;
  container: SVGElement;
  currentDraggedAnnotation: unknown;
}): void => {
  select(container)
    .selectAll(`${ANNOTATION_GROUP_SELECTOR_EDITABLE},${ANNOTATION_GROUP_SELECTOR}`)
    .filter(annotation => annotation !== currentDraggedAnnotation)
    .transition()
    .duration(FOCUS_TRANSITION_TIME)
    .attr('opacity', on ? FOCUS_OPACITY : 1);
};

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

    const getGroupPosition = (annotation: YAnnotation, viewport: ViewPort): string => {
      return `translate(0,${getY({ annotation, height, viewport })})`;
    };

    const getHandlePosition = (annotation: YAnnotation, viewport: ViewPort): number => {
      return getY({ annotation, height, viewport }) + HANDLE_OFFSET_Y;
    };
    dragHandle.call(
      drag()
        .on('start', function dragStarted(yAnnotation) {
          const annotationDragged = yAnnotation as YAnnotation;
          if (!annotationDragged.isEditable) {
            return;
          }
          startStopDragging(true);
          draggedAnnotationValue = +annotationDragged.value;
          select(this).classed('active', true);

          maskNonDraggedAnnotations({
            container,
            on: true,
            currentDraggedAnnotation: yAnnotation,
          });
        })
        .on('drag', function handleDragged(yAnnotation) {
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

          // re-rendering of everything except annotation movement
          const axisRescale = needAxisRescale({ annotationValue: annotationDragged.value as number, viewport });
          if (axisRescale) {
            // prevent the user from dragging off the page
            onUpdate(viewport, false, axisRescale, true);
            viewport = activeViewPort();
          } else {
            internalUpdate([onUpdate, viewport]);
          }

          // Update draggable annotation element groups
          select(container)
            .selectAll(ANNOTATION_GROUP_SELECTOR_EDITABLE)
            .selectAll(ELEMENT_GROUP_SELECTOR)
            .attr('transform', annotation => getGroupPosition(annotation as YAnnotation, viewport));

          // Update draggable annotation handles
          select(container)
            .selectAll(DRAGGABLE_HANDLE_SELECTOR)
            .attr('y', annotation => getHandlePosition(annotation as YAnnotation, viewport));

          // Update all annotation text values
          select(container)
            .selectAll(`${ANNOTATION_GROUP_SELECTOR_EDITABLE},${ANNOTATION_GROUP_SELECTOR}`)
            .select(TEXT_VALUE_SELECTOR)
            .text(annotation =>
              getValueText({ annotation: annotation as Annotation<number>, resolution, viewport, formatText: true })
            );

          // Update non-draggable annotation groups
          select(container)
            .selectAll(ANNOTATION_GROUP_SELECTOR)
            .attr('transform', annotation => getGroupPosition(annotation as YAnnotation, viewport));
        })
        .on('end', function dragEnded(yAnnotation) {
          const annotationDragged = yAnnotation as YAnnotation;
          if (!annotationDragged.isEditable) {
            return;
          }
          annotationDragged.value = draggedAnnotationValue != null ? draggedAnnotationValue : annotationDragged.value;
          const viewport = activeViewPort();
          /** emit event updating annotation on mouse up */
          emitUpdatedWidgetConfiguration();
          const axisRescale = needAxisRescale({ annotationValue: annotationDragged.value as number, viewport });
          onUpdate(viewport, false, axisRescale, true);

          select(this).classed('active', false);

          startStopDragging(false);

          maskNonDraggedAnnotations({
            container,
            on: false,
            currentDraggedAnnotation: yAnnotation,
          });
        }) as any
    );
  };

  return draggable;
};
