import { select } from 'd3-selection';
import { YAnnotation } from '../../types';
import { ANNOTATION_FONT_SIZE, ANNOTATION_STROKE_WIDTH } from '../constants';
import { getY } from './utils';
import { getText, getColor, getValueText, getLabelTextVisibility, getValueTextVisibility } from '../utils';
import { ViewPort } from '../../../../../utils/dataTypes';

const PADDING = 5;
export const TEXT_SELECTOR = 'text.y';
export const TEXT_VALUE_SELECTOR = 'text.yValueText';
export const THRESHOLD_GROUP_SELECTOR = 'g.yThreshold';
export const LINE_SELECTOR = 'line.y';

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

  const yAnnotationValueTextPadding = 3;
  const yAnnotationValueTextLeftPadding = 8;

  const getYAnnotationValueTextY = (a: YAnnotation): number => getYPosition(a) + yAnnotationValueTextPadding;
  const getYAnnotationTextY = (a: YAnnotation): number => getYPosition(a) - PADDING;

  const annotationSelection = select(container)
    .selectAll(THRESHOLD_GROUP_SELECTOR)
    .data(yAnnotations);

  /** Add group for all elements */
  const annotationGroup = annotationSelection
    .enter()
    .append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'yThreshold');

  /** Create Line */
  annotationGroup
    .append('line')
    .attr('class', 'y')
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
    .attr('class', 'yValueText')
    .attr('x', width + yAnnotationValueTextLeftPadding)
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
    .attr('class', 'y')
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
    .attr('x', width + yAnnotationValueTextLeftPadding)
    .text(annotation => getValueText({ annotation, resolution, viewPort }))
    .style('fill', getColor);

  /** Update Label Text */
  annotationSelection
    .select(TEXT_SELECTOR)
    .attr('display', getLabelTextVisibility)
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
    .selectAll(THRESHOLD_GROUP_SELECTOR)
    .remove();
};
