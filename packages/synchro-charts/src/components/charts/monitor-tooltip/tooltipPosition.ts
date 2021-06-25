import { isNumber } from '../../../utils/predicates';
import { TooltipPoint } from './types';
import { Timestamp, ViewPort } from '../../../utils/dataTypes';

/**
 * The date we want to utilize as the 'date at which to display the tooltip cursor at'
 */
const utilizedTimestamp = ({
  isRaw,
  points,
  selectedTimestamp,
  viewPort,
}: {
  isRaw: boolean;
  points: TooltipPoint[];
  selectedTimestamp: Timestamp;
  viewPort: ViewPort;
}): Timestamp => {
  if (isRaw) {
    // always use the selected date when raw. this has the impact of having the tooltip cursor always at where the cursor is
    return selectedTimestamp;
  }

  const pointDate = points[0].point && points[0].point.x;
  if (pointDate == null) {
    return selectedTimestamp;
  }

  if (pointDate < viewPort.start.getTime()) {
    // If the date is before the viewport, just use the start of the viewport. This has the effect of making a tooltip
    // appear flush at the left of the viewport when focusing on before-end-of-viewport positioned data.
    return viewPort.start.getTime();
  }

  return pointDate;
};

export const tooltipPosition = ({
  viewPort,
  size: { width, height },
  points,
  resolution,
  selectedTimestamp,
}: {
  viewPort: ViewPort;
  size: { width: number; height: number };
  points: TooltipPoint[];
  selectedTimestamp: Timestamp;
  resolution: number;
}): undefined | { x: number; y: number } => {
  if (points.length === 0) {
    return undefined;
  }

  const isRaw = resolution === 0;

  // represents the date which corresponds with the position to render the cursor at
  const timestamp = utilizedTimestamp({ isRaw, points, selectedTimestamp, viewPort });

  const viewPortDuration = viewPort.end.getTime() - viewPort.start.getTime();
  const datePositionRatio = (timestamp - viewPort.start.getTime()) / viewPortDuration;
  const pixelX = width * datePositionRatio;

  const modelY = Math.max(...points.map(({ point }) => (point ? point.y : undefined)).filter(isNumber));
  const pixelY = Math.max(0, height * (1 - (modelY - viewPort.yMin) / (viewPort.yMax - viewPort.yMin)));

  return { x: pixelX, y: pixelY };
};
