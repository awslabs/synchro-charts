import { Scene } from 'three';

import { BucketChartBucketMesh, bucketMesh, updateBucketMesh, NUM_POSITION_COMPONENTS } from './heatmapMesh';
import { ChartSceneCreator, ChartSceneUpdater } from '../sc-webgl-base-chart/types';
import { constructChartScene, numDataPoints } from '../sc-webgl-base-chart/utils';
import { clipSpaceConversion, needsNewClipSpace } from '../sc-webgl-base-chart/clipSpaceConversion';

const maxDataPointsRendered = (buckets: BucketChartBucketMesh): number =>
  buckets.geometry.attributes.bucket.array.length / NUM_POSITION_COMPONENTS;

export const chartScene: ChartSceneCreator = ({
  dataStreams,
  container,
  viewPort,
  bufferFactor,
  minBufferSize,
  onUpdate,
  thresholdOptions,
  thresholds,
}) => {
  const scene = new Scene();
  const toClipSpace = clipSpaceConversion(viewPort);
  scene.add(bucketMesh({ dataStreams, toClipSpace, bufferFactor, minBufferSize, thresholdOptions, thresholds }));
  return constructChartScene({ scene, viewPort, container, toClipSpace, onUpdate });
};

export const updateChartScene: ChartSceneUpdater = ({
  scene,
  dataStreams,
  hasDataChanged,
  minBufferSize,
  bufferFactor,
  viewPort,
  container,
  onUpdate,
  chartSize,
  thresholdOptions,
  thresholds,
  hasAnnotationChanged,
}) => {
  const buckets = (scene.scene.children[0] as unknown) as BucketChartBucketMesh;

  // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
  // chart scene, we must fully recreate the chart scene. This is a costly operation.
  const isDataOverflowingBuffer = maxDataPointsRendered(buckets) < numDataPoints(dataStreams);

  if (isDataOverflowingBuffer || needsNewClipSpace(viewPort, scene.toClipSpace) || hasAnnotationChanged) {
    return chartScene({
      onUpdate,
      dataStreams,
      container,
      viewPort,
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
    thresholdOptions,
    thresholds,
  });
  return scene;
};
