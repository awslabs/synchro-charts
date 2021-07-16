import { Scene } from 'three';
import {
  PointMesh,
  NUM_POSITION_COMPONENTS,
  POINT_MESH_INDEX,
  pointMesh,
  updatePointMesh,
} from '../common/meshes/pointMesh';
import { ChartSceneCreator, ChartSceneUpdater } from '../sc-webgl-base-chart/types';
import { constructChartScene, numDataPoints } from '../sc-webgl-base-chart/utils';
import { needsNewClipSpace, clipSpaceConversion } from '../sc-webgl-base-chart/clipSpaceConversion';
import { getNumberThresholds } from '../common/annotations/utils';

export const chartScene: ChartSceneCreator = ({
  dataStreams,
  container,
  viewport,
  minBufferSize,
  bufferFactor,
  onUpdate,
  thresholdOptions,
  thresholds,
}) => {
  const scene = new Scene();
  const toClipSpace = clipSpaceConversion(viewport);

  const numberThresholds = getNumberThresholds(thresholds);

  // Create and add meshes to the chart scene
  const meshList: PointMesh[] = [];
  meshList[POINT_MESH_INDEX] = pointMesh({
    dataStreams,
    minBufferSize,
    bufferFactor,
    toClipSpace,
    thresholdOptions,
    thresholds: numberThresholds,
  });

  meshList.forEach(mesh => scene.add(mesh));

  return constructChartScene({ scene, viewport, container, toClipSpace, onUpdate });
};

const maxDataPointsRendered = (points: PointMesh): number =>
  points.geometry.attributes.position.array.length / NUM_POSITION_COMPONENTS;

export const updateChartScene: ChartSceneUpdater = ({
  scene,
  dataStreams,
  chartSize,
  container,
  viewport,
  hasDataChanged,
  bufferFactor,
  minBufferSize,
  onUpdate,
  thresholdOptions,
  thresholds,
  hasAnnotationChanged,
}) => {
  const points = (scene.scene.children[POINT_MESH_INDEX] as unknown) as PointMesh;

  // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
  // chart scene, we must fully recreate the chart scene. This is a costly operation.
  const isDataOverflowingBuffer = maxDataPointsRendered(points) < numDataPoints(dataStreams);

  if (isDataOverflowingBuffer || needsNewClipSpace(viewport, scene.toClipSpace) || hasAnnotationChanged) {
    return chartScene({
      dataStreams,
      chartSize,
      container,
      viewport,
      minBufferSize,
      bufferFactor,
      onUpdate,
      thresholdOptions,
      thresholds,
    });
  }

  if (hasDataChanged) {
    updatePointMesh(dataStreams, points, scene.toClipSpace);
  }

  // Return existing scene.
  return scene;
};
