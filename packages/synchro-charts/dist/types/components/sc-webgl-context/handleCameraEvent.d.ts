import { CameraEvent, ChartScene } from './types';
/**
 * Handle Camera Event
 *
 * Updates the `ChartScene`'s camera position based on the `CameraEvent`
 * Applies a y position change to the selected scene, and applies a x position change to all registered scenes.
 */
export declare const handleCameraEvent: ({ dx, dy, sceneId }: CameraEvent, scenes: ChartScene[]) => void;
