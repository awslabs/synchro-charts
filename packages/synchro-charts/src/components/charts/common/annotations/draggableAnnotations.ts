import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import { YAnnotation } from '../types';
import { ViewPort } from '../../../../utils/dataTypes';
import { DRAGGABLE_HANDLE_SELECTOR } from './YAnnotations/YAnnotations';

export type DraggableAnnotationsOptions = {
  container: SVGElement;
  viewPort: ViewPort;
  size: { height: number };
  onUpdate: Function;
  activeViewPort: Function;
};

/**
 * Calculate new threshold value based on where the cursor is dragged
 * @param yPos
 * @param viewPort
 * @param size
 */
const calculateNewThreshold = ({
  yPos,
  viewPort,
  size,
}: {
  yPos: number;
  viewPort: ViewPort;
  size: { height: number };
}): number => {
  const { height } = size;
  const { yMax, yMin } = viewPort;
  const newVal = (height * yMax - yMax * yPos + yMin * yPos) / height;

  /** We truncate the newVal to 1/2000 of the axis scale */
  const yAxisScale = (yMax - yMin) / 2000;
  const decimalDigits = Math.log(yAxisScale) / Math.log(10);
  if (decimalDigits >= 0) {
    return +newVal.toFixed(0);
  }
  return +newVal.toFixed(-decimalDigits);
};

/**
 * New Draggable Thresholds Feature
 * @param container
 * @param changeThreshold
 * @param viewPort
 * @param size
 */
export const draggable = ({
  container,
  viewPort,
  size,
  onUpdate,
  activeViewPort,
}: DraggableAnnotationsOptions): void => {
  const containerSelection = select(container);
  const thresholdGroup = containerSelection.selectAll(DRAGGABLE_HANDLE_SELECTOR);
  thresholdGroup.call(
    drag()
      .on('start', function dragStarted(d: unknown) {
        if ((d as YAnnotation).isEditable) {
          select(this)
            .raise()
            .classed('active', true);
        }
      })
      .on('drag', function handleDragged(d: unknown) {
        /** Drag Event */
        const annotationDragged = d as YAnnotation;
        if (annotationDragged.isEditable) {
          const { y: yPos } = event as { y: number };
          annotationDragged.value = calculateNewThreshold({ yPos, viewPort, size });
          onUpdate(activeViewPort(), false, false, true);
        }
      })
      .on('end', function dragEnded(d: unknown) {
        const annotationDragged = d as YAnnotation;
        if (annotationDragged.isEditable) {
          const { y: yPos } = event as { y: number };
          annotationDragged.value = calculateNewThreshold({ yPos, viewPort, size });
          onUpdate(activeViewPort(), false, false, true);
          select(this).classed('active', false);
        }
      }) as any
  );
};
