import { select } from 'd3-selection';
import { YAnnotation } from '../../types';
import { getY } from './utils';
import { getColor } from '../utils';
import { ANNOTATION_STROKE_WIDTH } from '../constants';
import { ViewPort } from '../../../../../utils/dataTypes';

export const LINE_SELECTOR = 'line.y';

export const renderYAnnotationLines = ({
  container,
  yAnnotations,
  viewPort,
  size: { width, height },
}: {
  container: SVGElement;
  yAnnotations: YAnnotation[];
  viewPort: ViewPort;
  size: { width: number; height: number };
}) => {
  const getYPosition = (annotation: YAnnotation) =>
    getY({
      annotation,
      height,
      viewPort,
    });

  /**
   * Y Annotations Lines
   */
  const ySelection = select(container)
    .selectAll(LINE_SELECTOR)
    .data(yAnnotations);

  /** Create */
  ySelection
    .enter()
    .append('line')
    .attr('class', 'y')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', getYPosition)
    .attr('y2', getYPosition)
    .style('stroke', getColor)
    .style('stroke-width', ANNOTATION_STROKE_WIDTH);

  /** Update */
  ySelection
    .attr('x2', width)
    .attr('y1', getYPosition)
    .attr('y2', getYPosition)
    .style('stroke', getColor);

  /** Delete */
  ySelection.exit().remove();
};

export const removeYAnnotationLines = ({ container }: { container: SVGElement }) => {
  /**
   * X Annotations Lines
   */
  select(container)
    .selectAll(LINE_SELECTOR)
    .remove();
};
