import { M as MINUTE_IN_MS, D as DAY_IN_MS, S as SECOND_IN_MS, Y as YEAR_IN_MS } from './time-f374952b.js';
import { O as OrthographicCamera } from './three.module-af3affdd.js';
import { c as colorString } from './index-07d230d4.js';
import { v as v4_1 } from './v4-ea64cdd5.js';
import { a as getDataPoints } from './utils-11cae6c8.js';

const getCSSColorByString = (color) => {
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
const vertices = (stream, resolution) => {
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
const dispose = (scene) => {
    // https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
    scene.children.forEach(obj => {
        try {
            const mesh = obj;
            // Remove each mesh, and it's associated shader and geometry
            mesh.geometry.dispose();
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach(material => {
                material.dispose();
            });
        }
        catch (_a) {
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
const constructChartScene = ({ scene, container, viewPort, toClipSpace, onUpdate, }) => {
    // Create a camera pointed at our viewport - this determines which part of the mesh we see.
    const camera = new OrthographicCamera(toClipSpace(viewPort.start.getTime()), toClipSpace(viewPort.end.getTime()), viewPort.yMax, viewPort.yMin, NEAR, FAR);
    // Orthographic camera so the z position doesn't actually matter. i.e. depth is ignored.
    camera.position.z = 500;
    return {
        toClipSpace,
        scene,
        container,
        id: v4_1(),
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
        updateViewPort: ({ start, end }) => {
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
const numDataPoints = (dataStreams) => dataStreams.map(stream => getDataPoints(stream, stream.resolution).length).reduce((total, num) => total + num, 0);

/**
 * Clip Space Conversion Utilities
 *
 * Our 'model' space utilizes milliseconds to represent time. This level of granularity is important
 * since we do wish to be able to visually represent the time differences at that level of detail.
 *
 * However, there are 3.15e+10 milliseconds in a year. This is problematic because it means that we cannot represent
 * a years worth of data at the millisecond level granularity utilizing 32 bit floats.
 *
 * double precision is not supported by webGL - there are ways to represent double precision, however these
 * are unnecessarily complicated, double our memory foot print, and actually not necessary.
 *
 * Interesting article on doubles: http://blog.hvidtfeldts.net/index.php/2012/07/double-precision-in-opengl-and-webgl/
 *
 * ## Why Not Necessary To Utilize Doubles?
 *
 * While we need millisecond level precision, we do not need to be able to visually differentiate between milliseconds
 * while looking at even a weeks worth of data. Even if we did, you would not be able to discern a difference
 * due to resolution limitations. Even if you had a hypothetically perfect monitor that could discern a planks-constant
 * level of resolution, the eye would not be able to tell without advanced optical instrumentation!
 *
 * ## Solution
 *
 * We do two things to mitigate - based on the time duration of a given viewport, we will scale down the numbers and
 * truncate the decimals such that the distance from the end to the start of the viewport is representable by a floating point.
 *
 * However, this leaves one more problem - imagine after scaling our viewport in our clip space, we could have
 * our start be 1.20001e+8 to 1.20002e+8, we would have a distance of 1000, which is representable by a 32 bit float, however
 * each number within that range is still not representable by a 32 bit float. To account for this, we also must translate our clip
 * space by what we refer to as an anchor. Suppose we utilize 1.2*10^8 as an anchor, our clip space time range is now 1000 to 2000.
 * Success! We can now represent our time within webgl by a 32 bit float.
 *
 * ## Caveats
 *
 * Since the viewport is dynamic, we have to make sure that as our viewport moves around, we update our `clip space conversion`.
 * Translating, scaling-in, and scaling-out can all cause our `clip space conversion` to start outputting numbers which are not representable by 32 bit floats.
 * To solve this, we also must make sure we watch for viewport changes and adjust our conversion accordingly.
 */
/**
 * Granularity
 *
 * given a duration, return the granularity in milliseconds.
 * By granularity we mean the minimal time difference which is visually differentiated.
 */
const granularity = (durationMS) => {
    if (durationMS < 10 * MINUTE_IN_MS) {
        // single millisecond
        return 1;
    }
    if (durationMS < DAY_IN_MS) {
        return SECOND_IN_MS / 10;
    }
    if (durationMS < DAY_IN_MS * 7) {
        return SECOND_IN_MS;
    }
    if (durationMS < YEAR_IN_MS) {
        return MINUTE_IN_MS;
    }
    if (durationMS < 30 * YEAR_IN_MS) {
        return 30 * MINUTE_IN_MS;
    }
    return DAY_IN_MS;
};
/**
 * Clip Space Conversion
 *
 * Converts something from model space (millisecond representation of time) into our clip space.
 * The goal is to be able to represent the time from `start` to `end` with floating point precision (7 significant digits).
 */
const clipSpaceConversion = (viewPort) => {
    const durationMS = viewPort.end.getTime() - viewPort.start.getTime();
    const anchorMS = viewPort.start.getTime() - durationMS * 0.25;
    const granularityMS = granularity(durationMS);
    return t => Math.floor((t - anchorMS) / granularityMS);
};
const FLOAT_SIG_FIGS = 7;
const isDateOutOfBounds = (date, toClipSpace) => Math.abs(toClipSpace(date.getTime())) >= 10 ** FLOAT_SIG_FIGS;
// Minimum amount of distinct positions our clip spaces needs to represent.
const MIN_GRANULARITY = 3000;
/**
 * Needs New Clip Space
 *
 * There are two conditions which can occur which will require a new clip space.
 *
 * 1. The viewport when mapped to the clip space, contains numbers that aren't representable by floating point precision.
 * 2. The granularity within the viewport mapped to the clip space is too low - i.e. if the viewport maps to [0, 10],
 *    then we can only represent 11 distinct points.
 */
const needsNewClipSpace = (viewPort, toClipSpace) => {
    const isOutOfBounds = isDateOutOfBounds(viewPort.start, toClipSpace) || isDateOutOfBounds(viewPort.end, toClipSpace);
    const distanceMS = viewPort.end.getTime() - viewPort.start.getTime();
    const distanceClipSpace = toClipSpace(viewPort.end.getTime()) - toClipSpace(viewPort.start.getTime());
    const hasTooLowGranularity = distanceMS > distanceClipSpace && distanceClipSpace < MIN_GRANULARITY;
    return isOutOfBounds || hasTooLowGranularity;
};

export { constructChartScene as a, needsNewClipSpace as b, clipSpaceConversion as c, getCSSColorByString as g, numDataPoints as n, vertices as v };
