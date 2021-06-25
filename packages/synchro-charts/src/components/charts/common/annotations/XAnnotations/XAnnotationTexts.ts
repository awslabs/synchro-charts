import { select } from 'd3-selection';
import { XAnnotation } from '../../types';
import { getValueAndText, getColor } from '../utils';
import { ANNOTATION_FONT_SIZE } from '../constants';
import { getX } from './utils';
import { ViewPort } from '../../../../../utils/dataTypes';

export const TEXT_SELECTOR = 'text.x';

export const renderXAnnotationTexts = ({
  container,
  xAnnotations,
  viewPort,
  resolution,
  width,
}: {
  container: SVGElement;
  xAnnotations: XAnnotation[];
  viewPort: ViewPort;
  resolution: number;
  width: number;
}) => {
  const xTextSelection = select(container)
    .selectAll(TEXT_SELECTOR)
    // x annotations with text to display
    .data(xAnnotations.filter(annotation => getValueAndText({ annotation, resolution, viewPort }) !== ''));

  const getXAnnotationTextX = (a: XAnnotation): number => -getX({ annotation: a, width, viewPort });

  const padding = 5;
  /** Create */
  xTextSelection
    .enter()
    .append('text')
    .text(annotation => getValueAndText({ annotation, resolution, viewPort }))
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('class', 'x')
    .attr('y', getXAnnotationTextX)
    .attr('x', 0)
    .style('pointer-events', 'none')
    .style('user-select', 'none')
    .style('transform', `rotate(90deg) translateY(${-padding}px)`)
    .style('fill', getColor);

  /** Update */
  xTextSelection
    .text(annotation => getValueAndText({ annotation, resolution, viewPort }))
    .attr('y', getXAnnotationTextX)
    .style('fill', getColor);

  /** Delete */
  xTextSelection.exit().remove();
};

export const removeXAnnotationTexts = ({ container }: { container: SVGElement }) => {
  select(container)
    .selectAll(TEXT_SELECTOR)
    .remove();
};
