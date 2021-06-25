import { ViewPort } from '../../../utils/dataTypes';

/**
 * Get Pixel Density in terms of the clip space
 *
 * Returns the ratio of model space to pixel space in each dimension.
 * i.e. how many pixels does 10 minutes represent on a given `container`?
 */

export const pixelDensity = ({
  viewPort: { end, start, yMax, yMin },
  toClipSpace,
  size,
}: {
  viewPort: ViewPort;
  toClipSpace: (time: number) => number;
  size: { width: number; height: number };
}) => {
  const { width, height } = size;

  // We must translate our viewport to be in terms of the coordinate system which matches
  // that of the data being passed in - since we want to know how many pixels
  // are represented within the webGL context. i.e. clip space pixel density.
  const x = Math.abs((toClipSpace(end.getTime()) - toClipSpace(start.getTime())) / width);
  const y = Math.abs((yMax - yMin) / height);

  return { x, y };
};
