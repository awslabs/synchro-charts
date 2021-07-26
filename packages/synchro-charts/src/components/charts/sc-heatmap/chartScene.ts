import { Scene } from 'three';

import { HeatmapBucketMesh, bucketMesh, updateBucketMesh, NUM_POSITION_COMPONENTS } from './heatmapMesh';
import { ChartSceneCreator, ChartSceneUpdater } from '../sc-webgl-base-chart/types';
import { constructChartScene } from '../sc-webgl-base-chart/utils';
import { clipSpaceConversion, needsNewClipSpace } from '../sc-webgl-base-chart/clipSpaceConversion';
import { calcHeatValues, getXBucketRange, HeatValueMap } from './heatmapUtil';
import { BUCKET_COUNT } from './heatmapConstants';

const maxBucketsRendered = (buckets: HeatmapBucketMesh): number =>
  buckets.geometry.attributes.bucket.array.length / NUM_POSITION_COMPONENTS;

const numBuckets = (heatValues: HeatValueMap): number => {
  let totalNumBuckets = 0;
  Object.keys(heatValues).forEach((xAxisBucketStart: string) => {
    totalNumBuckets += Object.keys(heatValues[xAxisBucketStart]).length;
  });
  return totalNumBuckets;
};

export const chartScene: ChartSceneCreator = ({
  dataStreams,
  container,
  viewport,
  bufferFactor,
  minBufferSize,
  onUpdate,
}) => {
  const scene = new Scene();
  const toClipSpace = clipSpaceConversion(viewport);
  const xBucketRange = getXBucketRange(viewport);
  const heatValues: HeatValueMap =
    dataStreams.length !== 0
      ? calcHeatValues({ oldHeatValue: {}, dataStreams, xBucketRange, viewport, bucketCount: BUCKET_COUNT })
      : {};
  scene.add(bucketMesh({ dataStreams, toClipSpace, bufferFactor, minBufferSize, viewport, heatValues }));
  return constructChartScene({ scene, viewport, container, toClipSpace, onUpdate });
};

export const updateChartScene: ChartSceneUpdater = ({
  scene,
  dataStreams,
  hasDataChanged,
  shouldRerender = false,
  minBufferSize,
  bufferFactor,
  viewport,
  container,
  onUpdate,
  chartSize,
  thresholdOptions,
  thresholds,
}) => {
  const buckets = (scene.scene.children[0] as unknown) as HeatmapBucketMesh;
  const xBucketRange = getXBucketRange(viewport);
  const heatValues: HeatValueMap =
    dataStreams.length !== 0
      ? calcHeatValues({ oldHeatValue: {}, dataStreams, xBucketRange, viewport, bucketCount: BUCKET_COUNT })
      : {};

  // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
  // chart scene, we must fully recreate the chart scene. This is a costly operation.
  const isDataOverflowingBuffer = maxBucketsRendered(buckets) < numBuckets(heatValues);

  if (isDataOverflowingBuffer || needsNewClipSpace(viewport, scene.toClipSpace)) {
    return chartScene({
      onUpdate,
      dataStreams,
      container,
      viewport,
      minBufferSize,
      bufferFactor,
      chartSize,
      thresholdOptions,
      thresholds,
    });
  }

  updateBucketMesh({
    buckets,
    dataStreams,
    toClipSpace: scene.toClipSpace,
    hasDataChanged,
    shouldRerender,
    viewport,
    heatValues,
  });
  return scene;
};
