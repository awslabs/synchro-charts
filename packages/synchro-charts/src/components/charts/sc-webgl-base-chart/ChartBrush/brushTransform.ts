import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import { MovementConfig, Scale } from '../../common/types';

// DERIVATION NOTES:
// transformations are defined as following:
// t(x) := x * k + t
// let `xMin` be defined as the pixel position of `xSelectedPixelMin` in the frame of reference of
// `xScaleOriginal`.
// Then by definition we want to find `k` and `t` such that
// t(xMin) = 0
// thus,
// xMin * k + t = 0
// therefore
// t = -1 * k * xMin
//
// Additionally, our scaling factor should map our original range to the new range,
// thus `k` is simply the ratio of the width of the ranges.

export const createBrushTransform = ({
  xScale,
  xSelectedPixelMax,
  xSelectedPixelMin,
  xScaleOriginal,
  movement,
}: {
  xScale: Scale;
  xScaleOriginal: Scale;
  xSelectedPixelMax: number;
  xSelectedPixelMin: number;
  movement: MovementConfig;
}): ZoomTransform => {
  // Determine k, our scaling factor
  const timeSpan =
    (xScale.invert(xSelectedPixelMax) as Date).getTime() - (xScale.invert(xSelectedPixelMin) as Date).getTime();
  const prevTimeSpan = (xScaleOriginal.domain()[1] as Date).getTime() - (xScaleOriginal.domain()[0] as Date).getTime();
  const k = Math.max(Math.min(prevTimeSpan / timeSpan, movement.zoomMax), movement.zoomMin);
  // Determine t, our translation x-offset
  // NOTE: converting to an absolute date and then map that date to the frame of reference of the original scale.
  // See derivation notes above for more detail.
  const xMin = xScaleOriginal(xScale.invert(xSelectedPixelMin));
  const t = -1 * k * xMin;
  return zoomIdentity.translate(t, 0).scale(k); // NOTE: Only supporting x brushing for now.
};
