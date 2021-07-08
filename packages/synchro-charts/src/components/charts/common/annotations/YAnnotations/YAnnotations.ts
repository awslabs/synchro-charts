import { select } from 'd3-selection';
import { YAnnotation } from '../../types';
import { ANNOTATION_FONT_SIZE, ANNOTATION_STROKE_WIDTH } from '../constants';
import { getY } from './utils';
import { getText, getColor, getValueText, getLabelTextVisibility, getValueTextVisibility } from '../utils';
import { ViewPort } from '../../../../../utils/dataTypes';

const PADDING = 5;
const Y_ANNOTATION_TEXT_PADDING = 3;
const Y_ANNOTATION_TEXT_LEFT_PADDING = 8;

export const TEXT_SELECTOR = 'text.y-text';
export const TEXT_VALUE_SELECTOR = 'text.y-value-text';
export const ANNOTATION_GROUP_SELECTOR = 'g.y-annotation';
export const LINE_SELECTOR = 'line.y-line';

export const renderYAnnotations = ({
  container,
  yAnnotations,
  viewPort,
  resolution,
  size: { width, height },
}: {
  container: SVGElement;
  yAnnotations: YAnnotation[];
  viewPort: ViewPort;
  resolution: number;
  size: { width: number; height: number };
}) => {
  const getYPosition = (annotation: YAnnotation) =>
    getY({
      annotation,
      height,
      viewPort,
    });

  const getYAnnotationValueTextY = (a: YAnnotation): number => getYPosition(a) + Y_ANNOTATION_TEXT_PADDING;
  const getYAnnotationTextY = (a: YAnnotation): number => getYPosition(a) - PADDING;

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
    .text(annotation => getValueText({ annotation, resolution, viewPort }))
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

  /** Update Threshold Value Text */
  annotationSelection
    .select(TEXT_VALUE_SELECTOR)
    .attr('display', getValueTextVisibility)
    .attr('y', getYAnnotationValueTextY)
    .attr('x', width + Y_ANNOTATION_TEXT_LEFT_PADDING)
    .text(annotation => getValueText({ annotation, resolution, viewPort }))
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
