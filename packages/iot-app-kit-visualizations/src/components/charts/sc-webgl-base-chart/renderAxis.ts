import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { format } from 'd3-format';

import { getTickCount } from './ChartAxis/getTickCount';
import { TICK_PADDING, TICK_SIZE } from './ChartAxis/ChartAxis';
import { SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { ScaleType } from '../common/constants';
import { AnySelection, Axis } from '../common/types';

export interface AxisRendererProps {
  container: SVGElement;
  size: SizeConfig;
  viewport: ViewPort;
  axis?: Axis.Options;
}

const DEFAULT_AXIS_OPTIONS = {
  showX: true,
  showY: true,
};

/**
 *
 * Utils
 *
 */

const scales = (size: SizeConfig, viewport: ViewPort) => {
  const xScale = scaleTime()
    .domain([viewport.start.getTime(), viewport.end.getTime()])
    .range([0, size.width]);
  const yScale = scaleLinear()
    .domain([viewport.yMin, viewport.yMax])
    .range([size.height, 0]);
  return {
    xScale,
    yScale,
  };
};

const tickCount = (size: SizeConfig) =>
  getTickCount(
    { width: size.width, height: size.height },
    {
      xScaleSide: 'bottom',
      yScaleSide: 'left',
      yScaleType: ScaleType.Linear,
      xScaleType: ScaleType.Linear,
    }
  );

/**
 *
 * Axis Construction
 *
 */

const xAxisConstructor = (size: SizeConfig, viewport: ViewPort) => {
  const { xTickCount } = tickCount(size);
  const { xScale } = scales(size, viewport);
  return axisBottom(xScale)
    .ticks(xTickCount)
    .tickPadding(TICK_PADDING)
    .tickSize(TICK_SIZE);
};

const yAxisConstructor = (size: SizeConfig, viewport: ViewPort) => {
  const { yTickCount } = tickCount(size);
  const { yScale } = scales(size, viewport);

  // format: https://d3js.org/d3-format#locale_format
  return axisLeft(yScale)
    .ticks(yTickCount)
    .tickFormat(format('.4~s'))
    .tickSize(-size.width)
    .tickPadding(TICK_PADDING);
};

/** D3 call to construct the X Axis */
const xAxisCall = (size: SizeConfig, viewport: ViewPort) => (selection: AnySelection) =>
  selection
    .attr('transform', `translate(${size.marginLeft}, ${size.marginTop + size.height})`)
    .call(xAxisConstructor(size, viewport));

/** D3 call to construct the Y Axis */
const yAxisCall = (size: SizeConfig, viewport: ViewPort) => (selection: AnySelection) =>
  selection
    .attr('transform', `translate(${size.marginLeft}, ${size.marginTop})`)
    .call(yAxisConstructor(size, viewport));

export const renderAxis = () => {
  // Store axis element references to prevent re-querying DOM nodes on every render.
  let yAxis: AnySelection | null;
  let xAxisSeparator: AnySelection | null;
  let xAxis: AnySelection | null;

  const axisRenderer = ({ container, viewport, size, axis }: AxisRendererProps) => {
    const sel = select(container);

    const { showX, showY, labels } = {
      ...DEFAULT_AXIS_OPTIONS,
      ...axis,
    };

    if (!showX && xAxis && xAxisSeparator) {
      xAxis.remove();
      xAxis = null;
      xAxisSeparator.remove();
      xAxisSeparator = null;
    }

    if (!showY && yAxis) {
      yAxis.remove();
      yAxis = null;
    }

    if (showX && !xAxis) {
      // Adds the x axis separator between the chart and the y axis points
      sel
        .append('line')
        .attr('class', 'x-axis-separator')
        .attr('x1', size.marginLeft)
        .attr('y1', size.height + size.marginTop)
        .attr('x2', size.width + size.marginLeft)
        .attr('y2', size.height + size.marginTop);

      // Create X Axis
      sel
        .append('g')
        .attr('class', 'axis x-axis')
        .call(xAxisCall(size, viewport));

      // Note: We are assuming that axis within a component aren't destroyed and recreated.
      xAxis = select(container.querySelector('.x-axis') as SVGElement);
      xAxisSeparator = select(container.querySelector('.x-axis-separator') as SVGElement);

      if (!xAxis) {
        // This implies there's a issue in the utilization of this method. Should never occur.
        throw new Error('Failed to initialize the axis component');
      }
    }

    if (showY && !yAxis) {
      // Create Y Axis
      sel
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxisCall(size, viewport));

      // Note: We are assuming that axis within a component aren't destroyed and recreated.
      yAxis = select(container.querySelector('.y-axis') as SVGElement);

      if (!yAxis) {
        // This implies there's a issue in the utilization of this method. Should never occur.
        throw new Error('Failed to initialize the axis component');
      }
    }

    if (xAxis) {
      xAxis.call(xAxisCall(size, viewport));

      /** Update X Axis Separator */
      if (xAxisSeparator) {
        xAxisSeparator
          .attr('x1', size.marginLeft)
          .attr('y1', size.height + size.marginTop)
          .attr('x2', size.width + size.marginLeft)
          .attr('y2', size.height + size.marginTop);
      }
    }
    if (yAxis) {
      /** Update Y Axis */
      if (labels && labels.yAxis) {
        const newContent = labels.yAxis.content;
        const currentLabel = sel.select('.y-axis-label');
        if (currentLabel.empty() || newContent !== currentLabel.text()) {
          if (!currentLabel.empty()) {
            currentLabel.remove();
          }
          sel
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('transform', 'translate(10, 10)')
            .text(() => newContent);
        }
      }

      yAxis.call(yAxisCall(size, viewport));
    }
  };

  return axisRenderer;
};
