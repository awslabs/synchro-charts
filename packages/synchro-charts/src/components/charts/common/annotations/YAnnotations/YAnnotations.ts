import { select } from 'd3-selection';
import { YAnnotation } from '../../types';
import { ANNOTATION_FONT_SIZE, ANNOTATION_STROKE_WIDTH } from '../constants';
import { getY } from './utils';
import { getText, getColor, getValueText, getLabelTextVisibility, getValueTextVisibility } from '../utils';
import { ViewPort } from '../../../../../utils/dataTypes';

const PADDING = 5;
const Y_ANNOTATION_TEXT_PADDING = 3;
const Y_ANNOTATION_TEXT_LEFT_PADDING = 5;

const HANDLE_OFFSET_X = 1;
export const HANDLE_OFFSET_Y = -11;
export const HANDLE_WIDTH = 45;
export const SMALL_HANDLE_WIDTH = 18;
const HANDLE_HEIGHT = 20;

const DRAGGABLE_LINE_OFFSET_Y = -6;
const DRAGGABLE_LINE_OFFSET_X = 40;
const SMALL_DRAGGABLE_LINE_OFFSET_X = 13;
const DRAGGABLE_LINE_LENGTH = 10;
const DRAGGABLE_LINE_STROKE = 1;
const DRAGGABLE_LINE_SEPARATION = 2;

export const TEXT_SELECTOR = 'text.y-text';
export const TEXT_VALUE_SELECTOR = 'text.y-value-text';
export const ANNOTATION_GROUP_SELECTOR = 'g.y-annotation';
export const ANNOTATION_GROUP_SELECTOR_EDITABLE = 'g.y-annotation-editable';
export const LINE_SELECTOR = 'line.y-line';
export const DRAGGABLE_HANDLE_SELECTOR = 'rect.y-annotation';
export const DRAGGABLE_LINE_ONE_SELECTOR = 'line.y-handle-one';
export const DRAGGABLE_LINE_TWO_SELECTOR = 'line.y-handle-two';

export const ELEMENT_GROUP_SELECTOR = 'g.y-elements-group';

export const renderYAnnotationsEditable = ({
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

  const getYAnnotationHandleY = (yAnnotation: YAnnotation): number => getYPosition(yAnnotation) + HANDLE_OFFSET_Y;

  const getGroupPosition = (yAnnotation: YAnnotation): string => {
    return `translate(0,${getYPosition(yAnnotation)})`;
  };

  const annotationSelectionEditable = select(container)
    .selectAll(ANNOTATION_GROUP_SELECTOR_EDITABLE)
    .data(yAnnotations.filter(annotation => annotation.isEditable));

  /** Add group for all elements */
  const annotationGroupEDITABLE = annotationSelectionEditable
    .enter()
    .append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'y-annotation-editable');

  /** Create Draggable Annotation Handle Rectangle */
  annotationGroupEDITABLE
    .append('rect')
    .attr('class', 'y-annotation')
    .attr('width', getYHandleWidth)
    .attr('height', HANDLE_HEIGHT)
    .attr('x', width + HANDLE_OFFSET_X)
    .attr('y', getYAnnotationHandleY)
    .style('pointer-events', 'auto')
    .style('stroke', getColor)
    .style('stroke-width', ANNOTATION_STROKE_WIDTH)
    .style('fill-opacity', 0);

  /** Update Draggable Annotation Handle Rectangle */
  annotationSelectionEditable
    .select(DRAGGABLE_HANDLE_SELECTOR)
    .attr('y', getYAnnotationHandleY)
    .attr('x', width + HANDLE_OFFSET_X)
    .attr('width', getYHandleWidth)
    .style('stroke', getColor);

  /** Create Sub Group for all elements except drag handle */
  const handleGroup = annotationGroupEDITABLE
    .append('g')
    .attr('transform', getGroupPosition)
    .attr('class', 'y-elements-group');

  /** Create Line */
  handleGroup
    .append('line')
    .attr('class', 'y-line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', 0)
    .attr('y2', 0)
    .style('stroke', getColor)
    .style('stroke-width', ANNOTATION_STROKE_WIDTH);

  /** Create Value Text */
  handleGroup
    .append('text')
    .attr('display', getValueTextVisibility)
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('class', 'y-value-text')
    .attr('x', width + Y_ANNOTATION_TEXT_LEFT_PADDING)
    .attr('text-anchor', 'start')
    .attr('y', Y_ANNOTATION_TEXT_PADDING)
    .text(annotation => getValueText({ annotation, resolution, viewport, formatText: true }))
    .style('user-select', 'none')
    .style('pointer-events', 'none')
    .style('fill', getColor);

  /** Create Label Text */
  handleGroup
    .append('text')
    .attr('display', getLabelTextVisibility)
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('class', 'y-text')
    .attr('x', width - PADDING)
    .attr('text-anchor', 'end')
    .attr('y', -PADDING)
    .text(getText)
    .style('user-select', 'none')
    .style('pointer-events', 'none')
    .style('fill', getColor);

  /** Create lines for draggable annotation handle */
  handleGroup
    .append('line')
    .attr('class', 'y-handle-one')
    .attr('x1', getDraggableLineOneX)
    .attr('x2', getDraggableLineOneX)
    .attr('y1', DRAGGABLE_LINE_OFFSET_Y)
    .attr('y2', DRAGGABLE_LINE_OFFSET_Y + DRAGGABLE_LINE_LENGTH)
    .style('stroke', 'gray')
    .style('stroke-width', DRAGGABLE_LINE_STROKE);

  handleGroup
    .append('line')
    .attr('class', 'y-handle-two')
    .attr('x1', getDraggableLineTwoX)
    .attr('x2', getDraggableLineTwoX)
    .attr('y1', DRAGGABLE_LINE_OFFSET_Y)
    .attr('y2', DRAGGABLE_LINE_OFFSET_Y + DRAGGABLE_LINE_LENGTH)
    .style('stroke', 'gray')
    .style('stroke-width', DRAGGABLE_LINE_STROKE);

  /** Update Subgroup Elements */
  annotationSelectionEditable.select(ELEMENT_GROUP_SELECTOR).attr('transform', getGroupPosition);

  /** Update Threshold Value Text */
  annotationSelectionEditable
    .select(TEXT_VALUE_SELECTOR)
    .attr('display', getValueTextVisibility)
    .attr('x', width + Y_ANNOTATION_TEXT_LEFT_PADDING)
    .text(annotation => getValueText({ annotation, resolution, viewport, formatText: true }))
    .style('fill', getColor);

  /** Update Label Text */
  annotationSelectionEditable
    .select(TEXT_SELECTOR)
    .attr('display', getLabelTextVisibility)
    .attr('x', width - PADDING)
    .text(getText)
    .style('fill', getColor);

  /** Update Threshold Line */
  annotationSelectionEditable
    .select(LINE_SELECTOR)
    .attr('x2', width)
    .style('stroke', getColor);

  /** Update Handle Lines */
  annotationSelectionEditable
    .select(DRAGGABLE_LINE_ONE_SELECTOR)
    .attr('x1', getDraggableLineOneX)
    .attr('x2', getDraggableLineOneX);

  annotationSelectionEditable
    .select(DRAGGABLE_LINE_TWO_SELECTOR)
    .attr('x1', getDraggableLineTwoX)
    .attr('x2', getDraggableLineTwoX);

  /** Exit */
  annotationSelectionEditable.exit().remove();
};

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

  const getGroupPosition = (yAnnotation: YAnnotation): string => {
    return `translate(0,${getYPosition(yAnnotation)})`;
  };

  /** Not Editable Annotations */
  const annotationSelectionNotEditable = select(container)
    .selectAll(ANNOTATION_GROUP_SELECTOR)
    .data(yAnnotations.filter(annotation => !annotation.isEditable));

  /** Add group for all elements */
  const annotationGroup = annotationSelectionNotEditable
    .enter()
    .append('g')
    .attr('transform', getGroupPosition)
    .attr('class', 'y-annotation');

  /** Create Line */
  annotationGroup
    .append('line')
    .attr('class', 'y-line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', 0)
    .attr('y2', 0)
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
    .attr('y', Y_ANNOTATION_TEXT_PADDING)
    .text(annotation => getValueText({ annotation, resolution, viewport, formatText: true }))
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
    .attr('y', -PADDING)
    .text(getText)
    .style('user-select', 'none')
    .style('pointer-events', 'none')
    .style('fill', getColor);

  /** Update Group Position */
  annotationSelectionNotEditable.attr('transform', getGroupPosition);

  /** Update Threshold Value Text */
  annotationSelectionNotEditable
    .select(TEXT_VALUE_SELECTOR)
    .attr('display', getValueTextVisibility)
    .attr('x', width + Y_ANNOTATION_TEXT_LEFT_PADDING)
    .text(annotation => getValueText({ annotation, resolution, viewport, formatText: true }))
    .style('fill', getColor);

  /** Update Label Text */
  annotationSelectionNotEditable
    .select(TEXT_SELECTOR)
    .attr('display', getLabelTextVisibility)
    .attr('x', width - PADDING)
    .text(getText)
    .style('fill', getColor);

  /** Update Threshold Line */
  annotationSelectionNotEditable
    .select(LINE_SELECTOR)
    .attr('x2', width)
    .style('stroke', getColor);

  /** Exit */
  annotationSelectionNotEditable.exit().remove();
};

export const removeYAnnotations = ({ container }: { container: SVGElement }) => {
  /**
   * Y Annotation Threshold Groups
   */
  select(container)
    .selectAll(ANNOTATION_GROUP_SELECTOR)
    .remove();

  select(container)
    .selectAll(ANNOTATION_GROUP_SELECTOR_EDITABLE)
    .remove();
};
