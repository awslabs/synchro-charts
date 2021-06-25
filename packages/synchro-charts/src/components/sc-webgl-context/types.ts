import { BufferAttribute, InstancedBufferAttribute, OrthographicCamera, Scene } from 'three';

// TypedArrays are mutable, but typescript made the choice
// to mark them as readonly due to standard usecases only required read.
// https://github.com/Microsoft/TypeScript/issues/9652
export interface MutableArrayLike<T> {
  readonly length: number;
  [n: number]: T;
}

export interface WriteableBufferAttribute extends BufferAttribute {
  array: MutableArrayLike<number>;
}

export interface WriteableInstancedBufferAttribute extends InstancedBufferAttribute {
  array: MutableArrayLike<number>;
}

export interface ViewPortManager {
  id: string;
  viewPortGroup?: string;
  // Hook which is called with viewport is updated
  updateViewPort: (viewPortUpdate: { start: Date; end: Date }) => void;
  // Disposes of all all scene, it's geometries, and any materials that are specific to the scene.
  // Dispose should be called whenever a chart scene is no longer used, otherwise the application
  // will leak memory
  dispose: () => void;
}

export interface ChartScene extends ViewPortManager {
  scene: Scene;
  // Element which is used to determine the exact rectangle to render the associated scene to.
  container: HTMLElement;
  camera: OrthographicCamera;
  // Converts milliseconds to clip space (WebGL Coordinate space),
  toClipSpace: (time: number) => number;
}

/**
 * Represents a camera event. Emitted to alter the view port of
 * one or more camera such as panning.
 *
 * TODO(btd): Expand on the camera event system - most
 *  likely we will want to move to a higher level abstraction,
 *  i.e. have a 'pan', 'brush', 'scale', event
 */
export type CameraEvent = {
  // Change in milliseconds
  dx: number;
  // Change in y value (i.e. not pixels)
  dy: number;
  // Change in scale, i.e. 2 => the range of y values and x values displayed in a view port (of constants size) halves
  scale: number;
  // Scene which camera event originates from.
  sceneId: string;
};
