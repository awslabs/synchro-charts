import { M as MINUTE_IN_MS } from './time-f374952b.js';
import { B as BufferAttribute, I as InstancedBufferAttribute, a as InstancedBufferGeometry, R as RawShaderMaterial, D as DoubleSide, b as InstancedMesh, S as Scene } from './three.module-af3affdd.js';
import { g as getBreachedThreshold } from './utils-11cae6c8.js';
import { v as vertices, g as getCSSColorByString, n as numDataPoints, c as clipSpaceConversion, a as constructChartScene, b as needsNewClipSpace } from './clipSpaceConversion-16977037.js';
import { g as getDistanceFromDuration } from './getDistanceFromDuration-5c7da5d2.js';

/* eslint-disable max-len */
const statusVert = `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec4 status;
attribute vec2 position;
attribute vec3 color;
varying vec3 vColor;

void main() {
  float width = status.z;
  float height = status.w;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * width + status.x, position.y * height + status.y, 0.0, 1.0);
  vColor = color;
}
`;

const statusFrag = `
precision highp float;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`;

/**
 * Display Constants
 *
 * Adjust these to scale the margins provided within the status chart.
 * This represent which fraction of the 'width' of a given status group a margin.
 */
const HEIGHT = 1;
// a small fudge factor due to the anti aliasing applied on the edges of the visualization.
// the ideal solution would be to fix the shader to give a crisp line.
const MARGIN_FUDGE_FACTOR = 0.5;
// must match css variable --timeline-row-margin-top, with a small fudge factor removed
const STATUS_MARGIN_TOP_PX = 34 - MARGIN_FUDGE_FACTOR;
// This determines the maximum width in terms of duration, for a single raw point of data within the status chart.
const MAX_RAW_RESOLUTION_DURATION = MINUTE_IN_MS;
const DEFAULT_STATUS_BAR_COLOR = [165, 165, 165]; // (r, g, b) from 0 to 255

// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_STATUS_COMPONENTS = 4; // (x, y, width, height)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)
const numStatuses = (streamVertexSets) => streamVertexSets.reduce((totalStatuses, streamVertexSet) => {
    const streamStatuses = Math.max(streamVertexSet.length, 0);
    return totalStatuses + streamStatuses;
}, 0);
/**
 * Returns clip space width of the bar
 */
const getWidth = ({ nextX, currX, toClipSpace, alarms, }) => {
    const expires = alarms ? alarms.expires : undefined;
    if (expires != null) {
        // If we have a staleness, render the bar until it either:
        //  - collides with the next point's x value
        //  - extends to the duration of the staleness
        const maxWidth = getDistanceFromDuration(toClipSpace, expires);
        if (nextX == null) {
            return maxWidth;
        }
        return Math.min(getDistanceFromDuration(toClipSpace, nextX - currX), maxWidth);
    }
    // If we have a point that comes after this point, extend till that point
    if (nextX != null) {
        return getDistanceFromDuration(toClipSpace, nextX - currX);
    }
    // Extend bar 'til present time
    return getDistanceFromDuration(toClipSpace, Date.now() - currX);
};
const updateMesh = ({ dataStreams, mesh, toClipSpace, thresholds, thresholdOptions, chartSize, alarms, }) => {
    const streamVertexSets = dataStreams.map(stream => vertices(stream, stream.resolution));
    // Set the number of instances of the status are to be rendered.
    // eslint-disable-next-line no-param-reassign
    mesh.count = numStatuses(streamVertexSets);
    const { geometry } = mesh;
    const { color, status } = geometry.attributes;
    let statusIndex = 0;
    let colorIndex = 0;
    /** Layout */
    const rowHeight = HEIGHT / dataStreams.length;
    const margin = STATUS_MARGIN_TOP_PX / chartSize.height;
    const vizHeight = rowHeight - margin;
    streamVertexSets.forEach((streamVertexSet, setIndex) => {
        streamVertexSet.forEach((currVertex, v) => {
            const nextVertex = streamVertexSet[v + 1];
            const [nextX = undefined] = nextVertex || [];
            const [currX, currY] = currVertex;
            /**
             * Color Buffer Construction
             */
            const breachedThreshold = getBreachedThreshold(currY, thresholds);
            if (breachedThreshold == null || !thresholdOptions.showColor) {
                const [r, g, b] = DEFAULT_STATUS_BAR_COLOR;
                // Set status color to default gray (r, g, b)
                color.array[colorIndex] = r;
                color.array[colorIndex + 1] = g;
                color.array[colorIndex + 2] = b;
            }
            else {
                const [rr, gg, bb] = getCSSColorByString(breachedThreshold.color);
                // Set breached threshold color (r, g, b)
                color.array[colorIndex] = rr;
                color.array[colorIndex + 1] = gg;
                color.array[colorIndex + 2] = bb;
            }
            // Increment Indexes by the associated stride of the buffer
            colorIndex += NUM_COLOR_COMPONENTS;
            /**
             * Position Buffer Construction
             *
             * The 'y range' varies from 0 to 1 (HEIGHT). We need to convert pixels over to clip space
             */
            // status x
            status.array[statusIndex] = toClipSpace(currX);
            // status y
            status.array[statusIndex + 1] = HEIGHT - rowHeight * (setIndex + 1);
            // status width
            status.array[statusIndex + 2] = getWidth({ currX, nextX, toClipSpace, alarms });
            // status height
            status.array[statusIndex + 3] = vizHeight;
            // Increment Indexes by the associated stride of the buffer
            statusIndex += NUM_STATUS_COMPONENTS;
        });
    });
    status.needsUpdate = true;
    color.needsUpdate = true;
};
// https://wwwtyro.net/2019/11/18/instanced-lines.html
// 2d vertices composing of two triangles which make up a square
// (0, 1) - - - (1, 1)
//   |  \         |
//   |     \      |
//   |        \   |
// (0, 0) - - - (1, 0)
const unitSquare = [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1];
const initializeGeometry = (geometry, bufferSize) => {
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(unitSquare), NUM_POSITION_COMPONENTS));
    geometry.setAttribute('status', new InstancedBufferAttribute(new Float32Array(bufferSize * NUM_STATUS_COMPONENTS), NUM_STATUS_COMPONENTS, false));
    geometry.setAttribute('color', new InstancedBufferAttribute(new Uint8Array(bufferSize * NUM_COLOR_COMPONENTS), NUM_COLOR_COMPONENTS, true));
};
const statusMesh = ({ alarms, dataStreams, toClipSpace, bufferFactor, minBufferSize, thresholdOptions, thresholds, chartSize, }) => {
    const instGeo = new InstancedBufferGeometry();
    const bufferSize = Math.max(minBufferSize, numDataPoints(dataStreams) * bufferFactor);
    // Create and populate geometry
    initializeGeometry(instGeo, bufferSize);
    /**
     * Create Status Mesh
     *
     * The representation of the statuses on a status chart.
     *
     * Utilizes an instance of a single unit square, which then gets
     * stretched and transposed across the canvas.
     */
    const statusChartMaterial = new RawShaderMaterial({
        vertexShader: statusVert,
        fragmentShader: statusFrag,
        side: DoubleSide,
        transparent: false,
    });
    const mesh = new InstancedMesh(instGeo, statusChartMaterial, bufferSize);
    updateMesh({
        dataStreams,
        mesh,
        toClipSpace,
        thresholds,
        thresholdOptions,
        chartSize,
        alarms,
    });
    // Prevent bounding sphere from being called
    mesh.frustumCulled = false;
    return mesh;
};
const updateStatusMesh = ({ alarms, statuses, dataStreams, toClipSpace, thresholdOptions, thresholds, chartSize, hasDataChanged, hasAnnotationChanged, hasSizeChanged, }) => {
    if (hasDataChanged || hasAnnotationChanged || hasSizeChanged) {
        updateMesh({
            dataStreams,
            mesh: statuses,
            toClipSpace,
            thresholds,
            thresholdOptions,
            chartSize,
            alarms,
        });
    }
};

const maxDataPointsRendered = (statuses) => statuses.geometry.attributes.status.array.length / NUM_STATUS_COMPONENTS;
const chartScene = ({ alarms, dataStreams, container, viewPort, bufferFactor, minBufferSize, onUpdate, thresholdOptions, thresholds, chartSize, }) => {
    const scene = new Scene();
    const toClipSpace = clipSpaceConversion(viewPort);
    scene.add(statusMesh({
        alarms,
        dataStreams,
        toClipSpace,
        bufferFactor,
        minBufferSize,
        thresholdOptions,
        thresholds,
        chartSize,
    }));
    return constructChartScene({ scene, viewPort, container, toClipSpace, onUpdate });
};
const updateChartScene = ({ scene, alarms, dataStreams, minBufferSize, bufferFactor, viewPort, container, onUpdate, chartSize, thresholdOptions, thresholds, hasDataChanged, hasAnnotationChanged, hasSizeChanged, }) => {
    const statuses = scene.scene.children[0];
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

export { HEIGHT as H, STATUS_MARGIN_TOP_PX as S, chartScene as c, updateChartScene as u };
