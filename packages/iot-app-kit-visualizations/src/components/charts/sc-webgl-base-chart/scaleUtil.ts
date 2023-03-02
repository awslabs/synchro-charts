import { scaleLinear, scaleLog, scaleTime } from 'd3-scale';
import { ZoomTransform } from 'd3-zoom';
import { MovementConfig, Scale, ScaleConfig } from '../common/types';
import { ScaleType } from '../common/constants';
import { SizeConfig, ViewPort } from '../../../utils/dataTypes';

export const transformScales = (
  transform: ZoomTransform,
  movementOptions: MovementConfig,
  { xScale, yScale }: { xScale: Scale; yScale: Scale }
) => ({
  xScale: movementOptions.enableXScroll ? transform.rescaleX(xScale) : xScale,
  yScale: movementOptions.enableYScroll ? transform.rescaleY(yScale) : yScale,
});

const getScale = (scaleType: ScaleType): Scale => {
  switch (scaleType) {
    case ScaleType.Log:
      return scaleLog();
    case ScaleType.Linear:
      return scaleLinear();
    case ScaleType.TimeSeries:
      return scaleTime();
    default:
      throw new Error(`scale type ${scaleType} is not valid.`);
  }
};

/**
 * Create Scales
 *
 * NOTE: `width` and `height` are defined as the
 * pixel dimensions of the charting area, thus the rectangle defined by
 * them will always be the range.
 */
export const createScales = ({
  viewport: { start, end, yMin, yMax },
  size: { width, height },
  scale: { xScaleType, yScaleType },
}: {
  viewport: ViewPort;
  size: SizeConfig;
  scale: ScaleConfig;
}): {
  xScale: Scale;
  yScale: Scale;
} => ({
  xScale: (getScale(xScaleType).domain([start, end]) as Scale).range([0, width]) as Scale,
  yScale: (getScale(yScaleType).domain([yMin, yMax]) as Scale).range([height, 0]) as Scale,
});
