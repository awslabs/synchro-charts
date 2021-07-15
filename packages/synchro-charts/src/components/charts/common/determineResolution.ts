import { MINUTE_IN_MS } from '../../../utils/time';
/**
 * Determines the resolution of data in terms of seconds.
 *
 * NOTE: In the future we could additionally utilize device profile information.
 * Additionally a threshold factor could be used to prevent flipping between resolutions if someone
 * hovers below and above the breakpoint in quick succession.
 */

const ZERO_RESOLUTION_THRESHOLD = MINUTE_IN_MS / 4;

export const determineResolution = ({
  supportedResolutions,
  viewportStartDate,
  viewportEndDate,
  maxPoints,
}: {
  // The valid resolutions in seconds that can be utilized
  supportedResolutions: number[];
  // The maximum amount of points allowed to be rendered (too many points -> bad performance)
  maxPoints: number;
  viewportStartDate?: Date;
  viewportEndDate?: Date;
}): number => {
  if (supportedResolutions.length === 0) {
    throw new Error('Must support at least one resolution of data');
  }
  if (!viewportEndDate || !viewportStartDate) {
    throw new Error('determine resolution does not yet support not passing in start and end date');
  }

  const timeSpan = viewportEndDate.getTime() - viewportStartDate.getTime();
  const minResolution = timeSpan / maxPoints;
  const sortedResolutions = supportedResolutions.sort((a, b) => a - b);

  // Zero represents raw data. Zero is the limit of the resolution function, since
  // we determine the min resolution by taking a ration of duration and max points.
  // We must pick a threshold, which when our minimum threshold is low enough,
  // we jump to zero. The higher this threshold, the larger time spans can visualize
  // raw data.
  if (sortedResolutions[0] === 0 && minResolution < ZERO_RESOLUTION_THRESHOLD) {
    return 0;
  }

  return sortedResolutions.find(r => r >= minResolution) || sortedResolutions[sortedResolutions.length - 1];
};
