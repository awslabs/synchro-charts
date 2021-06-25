import colorString from 'color-string';
import { Mesh, OrthographicCamera, Scene } from 'three';
import uuid from 'uuid/v4';
import { ChartScene } from '../../monitor-webgl-context/types';
import { getDataPoints } from '../../../utils/getDataPoints';
import { DataStream, Primitive, Resolution, ViewPort } from '../../../utils/dataTypes';

export const getCSSColorByString = (color: string) => {
  const cssColor = colorString.get(color);
  if (cssColor == null) {
    // eslint-disable-next-line no-console
    console.error(`provided an invalid color string, '${color}'`);
  }
  return cssColor == null ? [0, 0, 0] : cssColor.value;
};

/**
 * Create Vertices
 *
 * Converts the `DataStream`s model to 2 dimensional vertices in a format consumable by WebGL.
 * Format is as follows,
 * `[[point_1_x, point_1_y, point_1_color_red, point_1_color_blue, point_1_color_green], ...]`
 */
export const vertices = <T extends Primitive>(
  stream: DataStream<T>,
  resolution: Resolution
): [number, T, number, number, number][] => {
  const [r, g, b] = getCSSColorByString(stream.color || 'black');
  return getDataPoints(stream, resolution).map(p => [p.x, p.y, r, g, b]);
};

// The max and minimum z value an entity may have and still be present.
// Currently we don't utilize depth so these clipping panes will have no effect on the data.
const NEAR = 0.1;
const FAR = 1000;

/**
 * Dispose of scene
 *
 * Disposes of the scene and recursively removes and disposes of all meshes within the scene
 */
const dispose = (scene: Scene) => {
  // https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
  scene.children.forEach(obj => {
    try {
      const mesh = obj as Mesh;

      // Remove each mesh, and it's associated shader and geometry
      mesh.geometry.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach(material => {
        material.dispose();
      });
    } catch {
      // NOTE: This error should never occur
      throw new Error(`
        scene currently does not support objects of type ${obj.constructor.name}
        and does not know how to dispose of it.
      `);
    }
  });

  scene.dispose();
};

/**
 * Construct Chart Scene
 *
 * Takes a threejs scene and some chart configuration, and constructs the corresponding chart scene.
 */
export const constructChartScene = ({
  scene,
  container,
  viewPort,
  toClipSpace,
  onUpdate,
}: {
  scene: Scene;
  container: HTMLElement;
  viewPort: ViewPort;
  toClipSpace: (time: number) => number;
  onUpdate?: ({ start, end }: { start: Date; end: Date }) => void;
}): ChartScene => {
  // Create a camera pointed at our viewport - this determines which part of the mesh we see.
  const camera = new OrthographicCamera(
    toClipSpace(viewPort.start.getTime()),
    toClipSpace(viewPort.end.getTime()),
    viewPort.yMax,
    viewPort.yMin,
    NEAR,
    FAR
  );
  // Orthographic camera so the z position doesn't actually matter. i.e. depth is ignored.
  camera.position.z = 500;

  return {
    toClipSpace,
    scene,
    container,
    id: uuid(),
    camera,
    dispose: () => dispose(scene),

    /**
     * A Unique identifier for the grouping of viewPorts which this chart syncs with.
     *
     * Whenever any of the viewports are altered within a viewport group, all of the charts
     * within the view port group will have their viewport start and end dates synced.
     *
     * A lack of a viewPortGroup means that the chart is not synced with any of charts.
     */
    viewPortGroup: viewPort.group,

    updateViewPort: ({ start, end }: { start: Date; end: Date }) => {
      /**
       * Update threejs cameras position.
       * This will cause the shaders to have an updated uniform, utilized
       * to project the data visualizations to the correct position.
       */
      // eslint-disable-next-line no-param-reassign
      camera.left = toClipSpace(start.getTime());
      // eslint-disable-next-line no-param-reassign
      camera.right = toClipSpace(end.getTime());
      camera.updateProjectionMatrix();

      /**
       * Call optional lifecycle method. This lifecycle method can be used
       * for non-webGL based features, i.e. thresholds, axis, etc.
       */
      if (onUpdate) {
        onUpdate({ start, end });
      }
    },
  };
};

/**
 * Get Number of Data Points
 *
 * Total data points across all data streams
 */
export const numDataPoints = <T extends Primitive>(dataStreams: DataStream<T>[]): number =>
  dataStreams.map(stream => getDataPoints(stream, stream.resolution).length).reduce((total, num) => total + num, 0);
