import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import throttle from 'lodash.throttle';
import { YAnnotation } from '../types';
import { DataStream, ViewPort } from '../../../../utils/dataTypes';
import {
  DRAGGABLE_HANDLE_SELECTOR,
  ANNOTATION_GROUP_SELECTOR_EDITABLE,
  ANNOTATION_GROUP_SELECTOR,
  renderYAnnotationsEditable,
} from './YAnnotations/YAnnotations';

export type DraggableAnnotationsOptions = {
  container: SVGElement;
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
  startStopDragging: (dragState: boolean) => void;
  yAnnotations: YAnnotation[];
  resolution: number;
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
  const lowerThreshold = yMin + 0.25 * (yMax - yMin);
  const upperThreshold = yMin + 0.75 * (yMax - yMin);
  return annotationValue < lowerThreshold || annotationValue > upperThreshold;
};

export const FOCUS_TRANSITION_TIME = 100; // milliseconds of the focus mode transition
const FOCUS_OPACITY = 0.32; // the opacity of the other handles that are not selected for dragging
const UPDATE_THROTTLE_MS = 80;

/**
 * Draggable Thresholds Feature
 */
export const attachDraggable = () => {
  let draggedAnnotationValue: number | undefined; // this is necessary to prevent race condition (new annotation value) from occurring during the drag process

  const internalUpdate = throttle(
    ([onUpdate, viewport, activeViewPort, axisRescale]: [
      (
        { start, end }: { start: Date; end: Date },
        hasDataChanged: boolean,
        hasSizeChanged: boolean,
        hasAnnotationChanged: boolean
      ) => void,
      { start: Date; end: Date },
      () => ViewPort,
      boolean
    ]) => {
      onUpdate(axisRescale ? activeViewPort() : viewport, false, axisRescale, true);
    },
    UPDATE_THROTTLE_MS
  );

  const draggable = ({
    container,
    viewport,
    size,
    onUpdate,
    activeViewPort,
    emitUpdatedWidgetConfiguration,
    startStopDragging,
    yAnnotations,
    resolution,
  }: DraggableAnnotationsOptions): void => {
    const containerSelection = select(container);
    const thresholdGroup = containerSelection.selectAll(DRAGGABLE_HANDLE_SELECTOR);
    thresholdGroup.call(
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

          const { y: yPos } = event as { y: number };
          const draggedValue = calculateNewThreshold({ yPos, viewport, size });
          annotationDragged.value = draggedValue;
          draggedAnnotationValue = draggedValue;

          renderYAnnotationsEditable({
            container,
            yAnnotations,
            viewport,
            resolution,
            size,
          });

          const axisRescale = needAxisRescale({ annotationValue: annotationDragged.value as number, viewport });

          internalUpdate([onUpdate, viewport, activeViewPort, axisRescale]);
        })
        .on('end', function dragEnded(yAnnotation: unknown) {
          const annotationDragged = yAnnotation as YAnnotation;
          if (!annotationDragged.isEditable) {
            return;
          }
          annotationDragged.value = draggedAnnotationValue
            ? (draggedAnnotationValue as number)
            : annotationDragged.value;
          /** emit event updating annotation on mouse up */
          emitUpdatedWidgetConfiguration();
          const axisRescale = needAxisRescale({ annotationValue: annotationDragged.value as number, viewport });
          onUpdate(axisRescale ? activeViewPort() : viewport, false, axisRescale, true);

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
