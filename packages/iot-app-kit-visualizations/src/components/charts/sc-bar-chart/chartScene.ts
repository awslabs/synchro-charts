import { Scene } from 'three';

import { BarChartBarMesh, barMesh, updateBarMesh, NUM_POSITION_COMPONENTS } from './barMesh';
import { ChartSceneCreator, ChartSceneUpdater } from '../sc-webgl-base-chart/types';
import { constructChartScene, numDataPoints } from '../sc-webgl-base-chart/utils';
import { clipSpaceConversion, needsNewClipSpace } from '../sc-webgl-base-chart/clipSpaceConversion';

const maxDataPointsRendered = (bars: BarChartBarMesh): number =>
  bars.geometry.attributes.bar.array.length / NUM_POSITION_COMPONENTS;

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
  scene.add(barMesh({ dataStreams, toClipSpace, bufferFactor, minBufferSize, thresholdOptions, thresholds }));
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
  const bars = (scene.scene.children[0] as unknown) as BarChartBarMesh;

  // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
  // chart scene, we must fully recreate the chart scene. This is a costly operation.
  const isDataOverflowingBuffer = maxDataPointsRendered(bars) < numDataPoints(dataStreams);

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

  updateBarMesh({
    bars,
    dataStreams,
    toClipSpace: scene.toClipSpace,
    hasDataChanged,
    thresholdOptions,
    thresholds,
  });
  return scene;
};
