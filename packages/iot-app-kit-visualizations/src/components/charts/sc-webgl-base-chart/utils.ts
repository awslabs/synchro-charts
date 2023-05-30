import { Mesh, OrthographicCamera, Scene } from 'three';
import uuid from 'uuid/v4';
import { ChartScene } from '../../sc-webgl-context/types';
import { DataStream, Primitive, ViewPort } from '../../../utils/dataTypes';
import { getCSSColorByString } from '../common/getCSSColorByString';

/**
 * Create Vertices
 *
 * Converts the `DataStream`s model to 2 dimensional vertices in a format consumable by WebGL.
 * Format is as follows,
 * `[[point_1_x, point_1_y, point_1_color_red, point_1_color_blue, point_1_color_green], ...]`
 */
export const vertices = <T extends Primitive>(stream: DataStream<T>): [number, T, number, number, number][] => {
  const [r, g, b] = getCSSColorByString(stream.color || 'black');
  return stream.data.map(p => [p.x, p.y, r, g, b]);
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
};

/**
 * Construct Chart Scene
 *
 * Takes a threejs scene and some chart configuration, and constructs the corresponding chart scene.
 */
export const constructChartScene = ({
  scene,
  container,
  viewport,
  toClipSpace,
  onUpdate,
}: {
  scene: Scene;
  container: HTMLElement;
  viewport: ViewPort;
  toClipSpace: (time: number) => number;
  onUpdate?: ({ start, end }: { start: Date; end: Date }) => void;
}): ChartScene => {
  // Create a camera pointed at our viewport - this determines which part of the mesh we see.
  const camera = new OrthographicCamera(
    toClipSpace(viewport.start.getTime()),
    toClipSpace(viewport.end.getTime()),
    viewport.yMax,
    viewport.yMin,
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
     * A Unique identifier for the grouping of viewports which this chart syncs with.
     *
     * Whenever any of the viewports are altered within a viewport group, all of the charts
     * within the view port group will have their viewport start and end dates synced.
     *
     * A lack of a viewportGroup means that the chart is not synced with any of charts.
     */
    viewportGroup: viewport.group,

    updateViewPort: ({
      start,
      end,
      ...rest
    }: {
      start: Date;
      end: Date;
      duration?: number | undefined;
      shouldBlockSetViewport?: boolean;
    }) => {
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
        onUpdate({ start, end, ...rest });
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
  dataStreams.map(stream => stream.data.length).reduce((total, num) => total + num, 0);
