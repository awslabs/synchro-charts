import { ValueFn } from 'd3';
import { drag } from 'd3-drag';
import * as d3 from 'd3';
import { Annotations, YAnnotation } from '../types';
import { ViewPort } from '../../../../utils/dataTypes';
import { DRAGGABLE_HANDLE_SELECTOR, TEXT_VALUE_SELECTOR } from './YAnnotations/YAnnotations';
import { isThreshold } from './utils';

export type DraggableAnnotationsOptions = {
  container: SVGElement;
  viewPort: ViewPort;
  size: { height: number };
  annotations: Annotations;
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
 * Changes the threshold value and triggers onUpdate
 * @param oldThreshold
 * @param newThreshold
 * @param annotations
 * @param onUpdate
 * @param activeViewPort
 */
export const changeThreshold = (
  oldThreshold: number,
  newThreshold: number,
  annotations: Annotations,
  onUpdate: Function,
  activeViewPort: Function
): void => {
  if (annotations == null || annotations.y == null || annotations.y.length === 0) {
    return;
  }
  const currentThreshold: YAnnotation | undefined = annotations.y.find(threshold => threshold.value === oldThreshold);
  if (currentThreshold == null) {
    return;
  }
  currentThreshold.value = newThreshold;
  onUpdate(activeViewPort(), false, false, true);
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
  annotations,
  onUpdate,
  activeViewPort,
}: DraggableAnnotationsOptions): void => {
  const containerSelection = d3.select(container);

  const thresholdGroup = containerSelection.selectAll(DRAGGABLE_HANDLE_SELECTOR);

  let selectedValue: number = -1;
  let newValue: number = -1;

  // TODO - this way of selection will not work if we have duplicate thresholds with same values probably?
  // TODO - could possibly use datum passed in to change it automatically instead of having to rely on the changeThreshold function: EX:  handleDragged(d: YAnnotation, event: unknown)
  // debugger;
  thresholdGroup.call(drag()
      .on('start', function dragStarted() {
        console.log("drag started");
        d3.select(this)
          .raise()
          .classed('active', true);
      })
      .on('drag', function handleDragged(event: unknown) {
        /** Drag Event */
        console.log("dragging");
        const { y: yPos } = event as { y: number };


        newValue = calculateNewThreshold({ yPos, viewPort, size });
        const box = d3.select(this);

        const thresholdParentGroup = box.select(function getParentNode() {
          return this.parentNode;
        } as ValueFn<Element, any, any>);

        const textVal = thresholdParentGroup.selectAll(TEXT_VALUE_SELECTOR);
        selectedValue = +textVal.attr('id');

        // this changeThreshold function curently also takes care of re-rendering the lines and thresholds (the update call)
        changeThreshold(selectedValue, newValue, annotations, onUpdate, activeViewPort);
      })
      .on('end', function dragEnded() {
        console.log("drag ended");
        d3.select(this).classed('active', false);
        changeThreshold(selectedValue, newValue, annotations, onUpdate, activeViewPort);
        selectedValue = -1;
      }) as any
  );
};
