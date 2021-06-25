import { select } from 'd3-selection';
import { XAnnotation } from '../../types';
import { getColor } from '../utils';
import { ANNOTATION_FONT_SIZE, ANNOTATION_STROKE_WIDTH } from '../constants';
import { getX } from './utils';
import { ViewPort } from '../../../../../utils/dataTypes';

export const LINE_SELECTOR = 'line.x';

export const renderXAnnotationLines = ({
  container,
  xAnnotations,
  viewPort,
  size: { width, height },
}: {
  container: SVGElement;
  xAnnotations: XAnnotation[];
  viewPort: ViewPort;
  size: { width: number; height: number };
}) => {
  /**
   * X Annotations Lines
   */
  const xSelection = select(container)
    .selectAll(LINE_SELECTOR)
    .data(xAnnotations);

  /** Create */
  xSelection
    .enter()
    .append('line')
    .attr('class', 'x')
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('x1', annotation => getX({ annotation, width, viewPort }))
    .attr('x2', annotation => getX({ annotation, width, viewPort }))
    .attr('y1', 0)
    .attr('y2', height)
    .style('stroke', getColor)
    .style('stroke-width', ANNOTATION_STROKE_WIDTH);

  /** Update */
  xSelection
    .attr('x1', annotation => getX({ annotation, width, viewPort }))
    .attr('x2', annotation => getX({ annotation, width, viewPort }))
    .attr('y2', height)
    .attr('stroke', getColor);

  /** Delete */
  xSelection.exit().remove();
};

export const removeXAnnotationLines = ({ container }: { container: SVGElement }) => {
  /**
   * X Annotations Lines
   */
  select(container)
    .selectAll(LINE_SELECTOR)
    .remove();
};
