/**
 *
 * Get Distance from Duration
 *
 * Return distance between `milliseconds` on a given `xScale`, assuming `xScale` is linear.
 * If `xScale` is not linear, the distance between two points can depend on the exact value of time,
 * rather than just the time between. Non-linear `xScale` requires the width to be computed for every point rather
 * than just once.
 *
 * Since a non-linear xAxis is an un-common use case we won't support that for now.
 */
const getDistanceFromDuration = (toClipSpace, milliseconds) => Math.abs(toClipSpace(new Date(milliseconds).getTime()) - toClipSpace(new Date(0).getTime()));

export { getDistanceFromDuration as g };
