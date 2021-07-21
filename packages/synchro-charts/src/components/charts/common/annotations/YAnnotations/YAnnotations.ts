import { select } from 'd3-selection';
import { YAnnotation } from '../../types';
import { ANNOTATION_FONT_SIZE, ANNOTATION_STROKE_WIDTH } from '../constants';
import { getY } from './utils';
import { getText, getColor, getValueText, getLabelTextVisibility, getValueTextVisibility } from '../utils';
import { ViewPort } from '../../../../../utils/dataTypes';

const PADDING = 5;
const Y_ANNOTATION_TEXT_PADDING = 3;
const Y_ANNOTATION_TEXT_LEFT_PADDING = 4;

const HANDLE_OFFSET_X = 1;
export const HANDLE_OFFSET_Y = -11;
export const HANDLE_WIDTH = 45;
export const SMALL_HANDLE_WIDTH = 18;
const HANDLE_HEIGHT = 20;

const DRAGGABLE_LINE_OFFSET_Y = 5;
const DRAGGABLE_LINE_OFFSET_X = 40;
const SMALL_DRAGGABLE_LINE_OFFSET_X = 13;
const DRAGGABLE_LINE_LENGTH = 10;
const DRAGGABLE_LINE_STROKE = 1;
const DRAGGABLE_LINE_SEPARATION = 2;

export const TEXT_SELECTOR = 'text.y-text';
export const TEXT_VALUE_SELECTOR = 'text.y-value-text';
export const ANNOTATION_GROUP_SELECTOR = 'g.y-annotation';
export const LINE_SELECTOR = 'line.y-line';
export const DRAGGABLE_HANDLE_SELECTOR = 'rect.y-annotation';
export const DRAGGABLE_LINE_ONE_SELECTOR = 'line.y-handle-one';
export const DRAGGABLE_LINE_TWO_SELECTOR = 'line.y-handle-two';

export const renderYAnnotations = ({
  container,
  yAnnotations,
  viewport,
  resolution,
  size: { width, height },
}: {
  container: SVGElement;
  yAnnotations: YAnnotation[];
  viewport: ViewPort;
  resolution: number;
  size: { width: number; height: number };
}) => {
  const getYPosition = (annotation: YAnnotation) =>
    getY({
      annotation,
      height,
      viewport,
    });

  const getYAnnotationValueTextY = (yAnnotation: YAnnotation): number =>
    getYPosition(yAnnotation) + Y_ANNOTATION_TEXT_PADDING;
  const getYAnnotationTextY = (yAnnotation: YAnnotation): number => getYPosition(yAnnotation) - PADDING;
  const getYAnnotationHandleY = (yAnnotation: YAnnotation): number => getYPosition(yAnnotation) + HANDLE_OFFSET_Y;
  const getYAnnotationDraggableLineY1 = (yAnnotation: YAnnotation): number =>
    getYPosition(yAnnotation) + HANDLE_OFFSET_Y + DRAGGABLE_LINE_OFFSET_Y;
  const getYAnnotationDraggableLineY2 = (yAnnotation: YAnnotation): number =>
    getYPosition(yAnnotation) + HANDLE_OFFSET_Y + DRAGGABLE_LINE_OFFSET_Y + DRAGGABLE_LINE_LENGTH;

  const YAnnotationDragHandleVisibility = (yAnnotation: YAnnotation): string =>
    yAnnotation.isEditable ? 'inline' : 'none';
  const YAnnotationDragHandlePointerActions = (yAnnotation: YAnnotation): string =>
    yAnnotation.isEditable ? 'auto' : 'none';

  const getYHandleWidth = (yAnnotation: YAnnotation): number =>
    getValueTextVisibility(yAnnotation) === 'inline' ? HANDLE_WIDTH : SMALL_HANDLE_WIDTH;
  const getDraggableLineTwoX = (yAnnotation: YAnnotation): number =>
    getValueTextVisibility(yAnnotation) === 'inline'
      ? width + DRAGGABLE_LINE_OFFSET_X + DRAGGABLE_LINE_SEPARATION
      : width + SMALL_DRAGGABLE_LINE_OFFSET_X + DRAGGABLE_LINE_SEPARATION;
  const getDraggableLineOneX = (yAnnotation: YAnnotation): number =>
    getValueTextVisibility(yAnnotation) === 'inline'
      ? width + DRAGGABLE_LINE_OFFSET_X
      : width + SMALL_DRAGGABLE_LINE_OFFSET_X;

  const annotationSelection = select(container)
    .selectAll(ANNOTATION_GROUP_SELECTOR)
    .data(yAnnotations);

  /** Add group for all elements */
  const annotationGroup = annotationSelection
    .enter()
    .append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'y-annotation');

  /** Create Line */
  annotationGroup
    .append('line')
    .attr('class', 'y-line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', getYPosition)
    .attr('y2', getYPosition)
    .style('stroke', getColor)
    .style('stroke-width', ANNOTATION_STROKE_WIDTH);

  /** Create Value Text */
  annotationGroup
    .append('text')
    .attr('display', getValueTextVisibility)
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('class', 'y-value-text')
    .attr('x', width + Y_ANNOTATION_TEXT_LEFT_PADDING)
    .attr('text-anchor', 'start')
    .attr('y', getYAnnotationValueTextY)
    .text(annotation => getValueText({ annotation, resolution, viewport, formattedText: true }))
    .style('user-select', 'none')
    .style('pointer-events', 'none')
    .style('fill', getColor);

  /** Create Label Text */
  annotationGroup
    .append('text')
    .attr('display', getLabelTextVisibility)
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('class', 'y-text')
    .attr('x', width - PADDING)
    .attr('text-anchor', 'end')
    .attr('y', getYAnnotationTextY)
    .text(getText)
    .style('user-select', 'none')
    .style('pointer-events', 'none')
    .style('fill', getColor);

  // TODO add getVisibility for the draggable handles depending on if the annotation is editable
  // TODO should the draggable handle be visible if the value text is not visible?

  /** Create Draggable Annotation Handle */
  annotationGroup
    .append('rect')
    .attr('display', YAnnotationDragHandleVisibility)
    .attr('class', 'y-annotation')
    .attr('width', getYHandleWidth)
    .attr('height', HANDLE_HEIGHT)
    .attr('x', width + HANDLE_OFFSET_X)
    .attr('y', getYAnnotationHandleY)
    .style('stroke', getColor)
    .style('stroke-width', ANNOTATION_STROKE_WIDTH)
    .style('fill-opacity', 0)
    .style('pointer-events', YAnnotationDragHandlePointerActions);

  /** Create lines for draggable annotation handle */
  annotationGroup
    .append('line')
    .attr('display', YAnnotationDragHandleVisibility)
    .attr('class', 'y-handle-one')
    .attr('x1', getDraggableLineOneX)
    .attr('x2', getDraggableLineOneX)
    .attr('y1', getYAnnotationDraggableLineY1)
    .attr('y2', getYAnnotationDraggableLineY2)
    .style('stroke', 'gray')
    .style('stroke-width', DRAGGABLE_LINE_STROKE);

  annotationGroup
    .append('line')
    .attr('display', YAnnotationDragHandleVisibility)
    .attr('class', 'y-handle-two')
    .attr('x1', getDraggableLineTwoX)
    .attr('x2', getDraggableLineTwoX)
    .attr('y1', getYAnnotationDraggableLineY1)
    .attr('y2', getYAnnotationDraggableLineY2)
    .style('stroke', 'gray')
    .style('stroke-width', DRAGGABLE_LINE_STROKE);

  /** Update Threshold Value Text */
  annotationSelection
    .select(TEXT_VALUE_SELECTOR)
    .attr('display', getValueTextVisibility)
    .attr('y', getYAnnotationValueTextY)
    .attr('x', width + Y_ANNOTATION_TEXT_LEFT_PADDING)
    .text(annotation => getValueText({ annotation, resolution, viewport, formattedText: true }))
    .style('fill', getColor);

  /** Update Label Text */
  annotationSelection
    .select(TEXT_SELECTOR)
    .attr('display', getLabelTextVisibility)
    .attr('x', width - PADDING)
    .attr('y', getYAnnotationTextY)
    .text(getText)
    .style('fill', getColor);

  /** Update Threshold Line */
  annotationSelection
    .select(LINE_SELECTOR)
    .attr('x2', width)
    .attr('y1', getYPosition)
    .attr('y2', getYPosition)
    .style('stroke', getColor);

  /** Update Draggable Handle */
  annotationSelection
    .select(DRAGGABLE_HANDLE_SELECTOR)
    .attr('display', YAnnotationDragHandleVisibility)
    .attr('y', getYAnnotationHandleY)
    .attr('x', width + HANDLE_OFFSET_X)
    .attr('width', getYHandleWidth)
    .style('stroke', getColor)
    .style('pointer-events', YAnnotationDragHandlePointerActions);

  /** Update Handle Lines */
  annotationSelection
    .select(DRAGGABLE_LINE_ONE_SELECTOR)
    .attr('display', YAnnotationDragHandleVisibility)
    .attr('x1', getDraggableLineOneX)
    .attr('x2', getDraggableLineOneX)
    .attr('y1', getYAnnotationDraggableLineY1)
    .attr('y2', getYAnnotationDraggableLineY2);

  annotationSelection
    .select(DRAGGABLE_LINE_TWO_SELECTOR)
    .attr('display', YAnnotationDragHandleVisibility)
    .attr('x1', getDraggableLineTwoX)
    .attr('x2', getDraggableLineTwoX)
    .attr('y1', getYAnnotationDraggableLineY1)
    .attr('y2', getYAnnotationDraggableLineY2);

  /** Exit */
  annotationSelection.exit().remove();
};

export const removeYAnnotations = ({ container }: { container: SVGElement }) => {
  /**
   * Y Annotation Threshold Groups
   */
  select(container)
    .selectAll(ANNOTATION_GROUP_SELECTOR)
    .remove();
};
