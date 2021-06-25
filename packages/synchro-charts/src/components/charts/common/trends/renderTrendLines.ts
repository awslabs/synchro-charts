import { select } from 'd3-selection';
import { TREND_LINE_DASH_ARRAY, TREND_LINE_STROKE_WIDTH } from './trendConfig';
import { LinearRegressionResult, RenderTrendLinesOptions } from './types';
import { getTrendValue } from './trendAnalysis';
import { ViewPort } from '../../../../utils/dataTypes';
import { TREND_TYPE } from '../../../../utils/dataConstants';

const getLinearPathCommand = ({
  trendResult,
  size: { width, height },
  viewPort: { start, end, yMin, yMax },
}: {
  trendResult: LinearRegressionResult;
  size: { width: number; height: number };
  viewPort: ViewPort;
}) => {
  // convert y-value to pixel position for start and end points of path
  const startY = Math.round(height - ((getTrendValue(trendResult, start.getTime()) - yMin) * height) / (yMax - yMin));
  const endY = Math.round(height - ((getTrendValue(trendResult, end.getTime()) - yMin) * height) / (yMax - yMin));

  // create draw commands for SVG paths
  return `M 0 ${startY} L ${width} ${endY}`;
};

export const renderTrendLines = ({
  container,
  viewPort,
  size: { width, height },
  dataStreams,
  trendResults,
}: RenderTrendLinesOptions): void => {
  const linearPathCommands: { command: string; color: string }[] = [];

  trendResults.forEach(trendResult => {
    const dataStream = dataStreams.find(elt => elt.id === trendResult.dataStreamId);
    if (dataStream) {
      switch (trendResult.type) {
        case TREND_TYPE.LINEAR:
          linearPathCommands.push({
            color: trendResult.color || dataStream.color || 'black',
            command: getLinearPathCommand({
              trendResult,
              size: { width, height },
              viewPort,
            }),
          });
          break;
        default:
          /* eslint-disable-next-line no-console */
          console.error(`Unable to render trend line for trend type '${trendResult.type}'.`);
      }
    }
  });

  // select existing path elements
  const linearSelection = select(container)
    .selectAll('path.linear-regression')
    .data(linearPathCommands);

  // create
  linearSelection
    .enter()
    .append('path')
    .attr('class', 'linear-regression')
    .attr('stroke', data => data.color)
    .attr('stroke-dasharray', TREND_LINE_DASH_ARRAY)
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', TREND_LINE_STROKE_WIDTH)
    .attr('d', data => data.command);

  // update
  linearSelection.attr('stroke', data => data.color).attr('d', data => data.command);

  // clean up extra path elements
  linearSelection.exit().remove();
};
