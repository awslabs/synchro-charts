import { Scene } from 'three';

import { HeatmapBucketMesh, bucketMesh, updateBucketMesh, NUM_POSITION_COMPONENTS } from './heatmapMesh';
import { ChartSceneCreator, ChartSceneUpdater } from '../sc-webgl-base-chart/types';
import { constructChartScene, numDataPoints } from '../sc-webgl-base-chart/utils';
import { clipSpaceConversion, needsNewClipSpace } from '../sc-webgl-base-chart/clipSpaceConversion';

const maxDataPointsRendered = (buckets: HeatmapBucketMesh): number =>
  buckets.geometry.attributes.bucket.array.length / NUM_POSITION_COMPONENTS;

export const chartScene: ChartSceneCreator = ({
  dataStreams,
  container,
  viewport,
  bufferFactor,
  minBufferSize,
  onUpdate,
  thresholdOptions,
  thresholds,
}) => {
  const scene = new Scene();
  const toClipSpace = clipSpaceConversion(viewport);
  scene.add(
    bucketMesh({ dataStreams, toClipSpace, bufferFactor, minBufferSize, viewport })
  );
  return constructChartScene({ scene, viewport, container, toClipSpace, onUpdate });
};

export const updateChartScene: ChartSceneUpdater = ({
  scene,
  dataStreams,
  hasDataChanged,
  minBufferSize,
  bufferFactor,
  viewport,
  container,
  onUpdate,
  chartSize,
  thresholdOptions,
  thresholds,
  hasAnnotationChanged,
}) => {
  const buckets = (scene.scene.children[0] as unknown) as HeatmapBucketMesh;

  // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
  // chart scene, we must fully recreate the chart scene. This is a costly operation.
  const isDataOverflowingBuffer = maxDataPointsRendered(buckets) < numDataPoints(dataStreams);

  if (isDataOverflowingBuffer || needsNewClipSpace(viewport, scene.toClipSpace) || hasAnnotationChanged) {
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
    viewport,
  });
  return scene;
};
