import { select } from 'd3-selection';
import { YAnnotation } from '../../types';
import { ANNOTATION_FONT_SIZE } from '../constants';
import { getY } from './utils';
import { getText, getColor, getValueText } from '../utils';
import { ViewPort } from '../../../../../utils/dataTypes';

const PADDING = 5;
export const TEXT_SELECTOR = 'text.y';
export const TEXT_VALUE_SELECTOR = 'text.yValueText';

export const renderYAnnotationTexts = ({
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

  /**
   * Y Annotations Text
   */
  const getYAnnotationTextY = (a: YAnnotation): number => getYPosition(a) - PADDING;
  const yTextSelection = select(container)
    .selectAll(TEXT_SELECTOR)
    // x annotations with text to display
    .data(yAnnotations.filter(annotation => getText(annotation) !== ''));

  /** Create */
  yTextSelection
    .enter()
    .append('text')
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('class', 'y')
    .attr('x', width - PADDING)
    .attr('text-anchor', 'end')
    .attr('y', getYAnnotationTextY)
    .text(getText)
    .style('user-select', 'none')
    .style('pointer-events', 'none')
    .style('fill', getColor);

  /** Update */
  yTextSelection
    .attr('y', getYAnnotationTextY)
    .text(getText)
    .style('fill', getColor);

  yTextSelection.exit().remove();

  /**
   * Y Annotations Value Text
   */
  const yAnnotationValueTextPadding = 3;
  const yAnnotationValueTextLeftPadding = 8;

  const getYAnnotationValueTextY = (a: YAnnotation): number => getYPosition(a) + yAnnotationValueTextPadding;
  const yValueTextSelection = select(container)
    .selectAll(TEXT_VALUE_SELECTOR)
    // x annotations with text to display
    .data(yAnnotations.filter(annotation => getValueText({ annotation, resolution, viewPort }) !== ''));

  /** Create */
  yValueTextSelection
    .enter()
    .append('text')
    .attr('font-size', ANNOTATION_FONT_SIZE)
    .attr('class', 'yValueText')
    .attr('x', width + yAnnotationValueTextLeftPadding)
    .attr('text-anchor', 'start')
    .attr('y', getYAnnotationValueTextY)
    .text(annotation => getValueText({ annotation, resolution, viewPort }))
    .style('user-select', 'none')
    .style('pointer-events', 'none')
    .style('fill', getColor);

  /** Update */
  yValueTextSelection
    .attr('y', getYAnnotationValueTextY)
    .attr('x', width + yAnnotationValueTextLeftPadding)
    .text(annotation => getValueText({ annotation, resolution, viewPort }))
    .style('fill', getColor);

  yValueTextSelection.exit().remove();
};

export const removeYAnnotationTexts = ({ container }: { container: SVGElement }) => {
  /**
   * Y Annotations Text
   */
  select(container)
    .selectAll(TEXT_SELECTOR)
    .remove();

  /**
   * Y Annotations Value Text
   */
  select(container)
    .selectAll(TEXT_VALUE_SELECTOR)
    .remove();
};
