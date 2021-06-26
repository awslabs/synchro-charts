import { Scene } from 'three';

import { StatusChartStatusMesh, statusMesh, updateStatusMesh, NUM_STATUS_COMPONENTS } from './statusMesh';
import { ChartSceneCreator, ChartSceneUpdater } from '../sc-webgl-base-chart/types';
import { constructChartScene, numDataPoints } from '../sc-webgl-base-chart/utils';
import { clipSpaceConversion, needsNewClipSpace } from '../sc-webgl-base-chart/clipSpaceConversion';

const maxDataPointsRendered = (statuses: StatusChartStatusMesh): number =>
  statuses.geometry.attributes.status.array.length / NUM_STATUS_COMPONENTS;

export const chartScene: ChartSceneCreator = ({
  alarms,
  dataStreams,
  container,
  viewPort,
  bufferFactor,
  minBufferSize,
  onUpdate,
  thresholdOptions,
  thresholds,
  chartSize,
}) => {
  const scene = new Scene();
  const toClipSpace = clipSpaceConversion(viewPort);
  scene.add(
    statusMesh({
      alarms,
      dataStreams,
      toClipSpace,
      bufferFactor,
      minBufferSize,
      thresholdOptions,
      thresholds,
      chartSize,
    })
  );
  return constructChartScene({ scene, viewPort, container, toClipSpace, onUpdate });
};

export const updateChartScene: ChartSceneUpdater = ({
  scene,
  alarms,
  dataStreams,
  minBufferSize,
  bufferFactor,
  viewPort,
  container,
  onUpdate,
  chartSize,
  thresholdOptions,
  thresholds,
  hasDataChanged,
  hasAnnotationChanged,
  hasSizeChanged,
}) => {
  const statuses = (scene.scene.children[0] as unknown) as StatusChartStatusMesh;

  // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
  // chart scene, we must fully recreate the chart scene. This is a costly operation.
  const isDataOverflowingBuffer = maxDataPointsRendered(statuses) < numDataPoints(dataStreams);

  if (isDataOverflowingBuffer || needsNewClipSpace(viewPort, scene.toClipSpace)) {
    return chartScene({
      onUpdate,
      dataStreams,
      alarms,
      container,
      viewPort,
      minBufferSize,
      bufferFactor,
      chartSize,
      thresholdOptions,
      thresholds,
    });
  }

  updateStatusMesh({
    alarms,
    statuses,
    dataStreams,
    toClipSpace: scene.toClipSpace,
    thresholdOptions,
    thresholds,
    chartSize,
    hasDataChanged,
    hasAnnotationChanged,
    hasSizeChanged,
  });
  return scene;
};
