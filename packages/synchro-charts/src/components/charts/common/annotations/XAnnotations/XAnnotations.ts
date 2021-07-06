import { select } from 'd3-selection';
import { XAnnotation } from '../../types';
import { getValueAndText, getColor, getValueAndTextVisibility } from '../utils';
import { ANNOTATION_FONT_SIZE, ANNOTATION_STROKE_WIDTH } from '../constants';
import { getX } from './utils';
import { ViewPort } from '../../../../../utils/dataTypes';

export const TEXT_SELECTOR = 'text.x-text';
export const ANNOTATION_GROUP_SELECTOR = 'g.x-annotation';
export const LINE_SELECTOR = 'line.x-line';

export const renderXAnnotations = ({
  container,
  xAnnotations,
  viewPort,
  resolution,
  size: { width, height },
}: {
  container: SVGElement;
  xAnnotations: XAnnotation[];
  viewPort: ViewPort;
  resolution: number;
  size: { width: number; height: number };
}) => {
  const annotationSelection = select(container)
    .selectAll(ANNOTATION_GROUP_SELECTOR)
    .data(xAnnotations);

  const getXAnnotationTextX = (a: XAnnotation): number => -getX({ annotation: a, width, viewPort });

  const padding = 5;

  /** Add group for all elements */
  const annotationGroup = annotationSelection
    .enter()
    .append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'x-annotation');

  /** Create Line */
  annotationGroup
    .append('line')
    .attr('class', 'x-line')
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('x1', annotation => getX({ annotation, width, viewPort }))
    .attr('x2', annotation => getX({ annotation, width, viewPort }))
    .attr('y1', 0)
    .attr('y2', height)
    .style('stroke', getColor)
    .style('stroke-width', ANNOTATION_STROKE_WIDTH);

  /** Create X Text */
  annotationGroup
    .append('text')
    .text(annotation => getValueAndText({ annotation, resolution, viewPort }))
    .attr('display', getValueAndTextVisibility)
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('class', 'x-text')
    .attr('y', getXAnnotationTextX)
    .attr('x', 0)
    .style('pointer-events', 'none')
    .style('user-select', 'none')
    .style('transform', `rotate(90deg) translateY(${-padding}px)`)
    .style('fill', getColor);

  /** Update Line */
  annotationSelection
    .select(LINE_SELECTOR)
    .attr('x1', annotation => getX({ annotation, width, viewPort }))
    .attr('x2', annotation => getX({ annotation, width, viewPort }))
    .attr('y2', height)
    .attr('stroke', getColor);

  /** Update Text */
  annotationSelection
    .select(TEXT_SELECTOR)
    .attr('display', getValueAndTextVisibility)
    .text(annotation => getValueAndText({ annotation, resolution, viewPort }))
    .attr('y', getXAnnotationTextX)
    .style('fill', getColor);

  /** Delete */
  annotationSelection.exit().remove();
};

export const removeXAnnotations = ({ container }: { container: SVGElement }) => {
  select(container)
    .selectAll(ANNOTATION_GROUP_SELECTOR)
    .remove();
};
