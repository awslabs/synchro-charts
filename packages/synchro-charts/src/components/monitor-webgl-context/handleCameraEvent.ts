import { CameraEvent, ChartScene } from './types';

/**
 * Handle Camera Event
 *
 * Updates the `ChartScene`'s camera position based on the `CameraEvent`
 * Applies a y position change to the selected scene, and applies a x position change to all registered scenes.
 */
export const handleCameraEvent = ({ dx, dy, sceneId }: CameraEvent, scenes: ChartScene[]) => {
  // Get the scene which had the event acted upon
  const selectedScene = scenes.find(({ id }) => id === sceneId);
  if (selectedScene) {
    // Update Cameras
    selectedScene.camera.position.y += dy;
    selectedScene.camera.updateProjectionMatrix();
    // All cameras are synced on the x-axis, thus if there is a change in the x-position, apply it to all cameras
    if (dx !== 0) {
      scenes.forEach(scene => {
        // eslint-disable-next-line no-param-reassign
        scene.camera.position.x -= dx;
        scene.camera.updateProjectionMatrix();
      });
    }
  } else {
    throw new Error(`invalid chart scene ${sceneId} requested - no such chart scene present. This should never occur.`);
  }
};
