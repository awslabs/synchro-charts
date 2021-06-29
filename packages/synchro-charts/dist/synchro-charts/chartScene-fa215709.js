import { B as BufferAttribute, I as InstancedBufferAttribute, a as InstancedBufferGeometry, R as RawShaderMaterial, D as DoubleSide, b as InstancedMesh, S as Scene } from './three.module-af3affdd.js';
import { a as isNumberDataStream } from './predicates-ced25765.js';
import { g as getBreachedThreshold } from './utils-11cae6c8.js';
import { v as vertices, g as getCSSColorByString, n as numDataPoints, c as clipSpaceConversion, a as constructChartScene, b as needsNewClipSpace } from './clipSpaceConversion-16977037.js';
import { g as getDistanceFromDuration } from './getDistanceFromDuration-5c7da5d2.js';

/* eslint-disable max-len */
const barVert = `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float width;
attribute vec2 bar;
attribute vec2 position;
attribute vec3 color;
varying vec3 vColor;

void main() {
  // Negative width here because we want to render the bars' width to the left side starting from its x position.
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * -width + bar.x, position.y * bar.y, 0.0, 1.0);
  vColor = color;
}
`;

const barFrag = `
precision highp float;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`;

/**
 * Display Constants
 *
 * Adjust these to scale the margins provided within the bar chart.
 * This represent which fraction of the 'width' of a given bar group a margin.
 */
const MARGIN_FACTOR = 1 / 6;
const getBarMargin = (toClipSpace, resolution) => getDistanceFromDuration(toClipSpace, resolution * MARGIN_FACTOR);
/**
 * Get the bar width
 *
 * Returns the clipSpace width which each bar should be.
 * It is assumed that each bar within a group will have the same width.
 */
const getBarWidth = ({ toClipSpace, resolution, numDataStreams, }) => {
    return (getDistanceFromDuration(toClipSpace, resolution) - getBarMargin(toClipSpace, resolution)) / numDataStreams;
};

// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)
const numBars = (streamVertexSets) => {
    return streamVertexSets.reduce((totalBars, streamVertexSet) => totalBars + streamVertexSet.length, 0);
};
const getUniformWidth = (dataStreams, toClipSpace) => {
    if (dataStreams.length === 0) {
        return 0;
    }
    const { resolution } = dataStreams[0];
    return getBarWidth({
        toClipSpace,
        numDataStreams: dataStreams.length,
        resolution,
    });
};
const updateMesh = ({ dataStreams, mesh, toClipSpace, thresholds, thresholdOptions, }) => {
    const streamVertexSets = dataStreams.filter(isNumberDataStream).map(stream => vertices(stream, stream.resolution));
    // Set the number of instances of the bar are to be rendered.
    // eslint-disable-next-line no-param-reassign
    mesh.count = numBars(streamVertexSets);
    const { geometry } = mesh;
    const { color, bar } = geometry.attributes;
    let positionIndex = 0;
    let colorIndex = 0;
    streamVertexSets.forEach((streamVertexSet, setIndex) => {
        streamVertexSet.forEach(currVertex => {
            const [currX, currY, r, g, b] = currVertex;
            /**
             * Subtracting setIndex * getUniformWidth(dataStreams, toClipSpace) because with each new
             * data stream, we want to render it side by side on the left side.
             */
            bar.array[positionIndex] = toClipSpace(currX) - setIndex * getUniformWidth(dataStreams, toClipSpace);
            bar.array[positionIndex + 1] = currY;
            const breachedThreshold = getBreachedThreshold(currY, thresholds);
            if (breachedThreshold == null || !thresholdOptions.showColor) {
                // Set bar color (r, g, b)
                color.array[colorIndex] = r;
                color.array[colorIndex + 1] = g;
                color.array[colorIndex + 2] = b;
            }
            else {
                const [rr, gg, bb] = getCSSColorByString(breachedThreshold.color);
                // Set bar color (r, g, b)
                color.array[colorIndex] = rr;
                color.array[colorIndex + 1] = gg;
                color.array[colorIndex + 2] = bb;
            }
            // Increment Indexes by the associated stride of the buffer
            colorIndex += NUM_COLOR_COMPONENTS;
            positionIndex += NUM_POSITION_COMPONENTS;
        });
    });
    bar.needsUpdate = true;
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
    geometry.setAttribute('bar', new InstancedBufferAttribute(new Float32Array(bufferSize * NUM_POSITION_COMPONENTS), NUM_POSITION_COMPONENTS, false));
    geometry.setAttribute('color', new InstancedBufferAttribute(new Uint8Array(bufferSize * NUM_COLOR_COMPONENTS), NUM_COLOR_COMPONENTS, true));
};
const barMesh = ({ dataStreams, toClipSpace, bufferFactor, minBufferSize, thresholdOptions, thresholds, }) => {
    const instGeo = new InstancedBufferGeometry();
    const bufferSize = Math.max(minBufferSize, numDataPoints(dataStreams) * bufferFactor);
    // Create and populate geometry
    initializeGeometry(instGeo, bufferSize);
    /**
     * Create Bar Mesh
     *
     * The representation of the bars on a bar chart.
     *
     * Utilizes an instance of a single unit square, which then gets
     * stretched and transposed across the canvas.
     */
    const barChartMaterial = new RawShaderMaterial({
        vertexShader: barVert,
        fragmentShader: barFrag,
        side: DoubleSide,
        transparent: false,
        uniforms: {
            width: {
                value: getUniformWidth(dataStreams, toClipSpace),
            },
        },
    });
    const mesh = new InstancedMesh(instGeo, barChartMaterial, bufferSize);
    updateMesh({ dataStreams, mesh, toClipSpace, thresholds, thresholdOptions });
    // Prevent bounding sphere from being called
    mesh.frustumCulled = false;
    return mesh;
};
const updateBarMesh = ({ bars, dataStreams, toClipSpace, hasDataChanged, thresholdOptions, thresholds, }) => {
    if (hasDataChanged) {
        // eslint-disable-next-line no-param-reassign
        bars.material.uniforms.width.value = getUniformWidth(dataStreams, toClipSpace);
        updateMesh({ dataStreams, mesh: bars, toClipSpace, thresholds, thresholdOptions });
    }
};

const maxDataPointsRendered = (bars) => bars.geometry.attributes.bar.array.length / NUM_POSITION_COMPONENTS;
const chartScene = ({ dataStreams, container, viewPort, bufferFactor, minBufferSize, onUpdate, thresholdOptions, thresholds, }) => {
    const scene = new Scene();
    const toClipSpace = clipSpaceConversion(viewPort);
    scene.add(barMesh({ dataStreams, toClipSpace, bufferFactor, minBufferSize, thresholdOptions, thresholds }));
    return constructChartScene({ scene, viewPort, container, toClipSpace, onUpdate });
};
const updateChartScene = ({ scene, dataStreams, hasDataChanged, minBufferSize, bufferFactor, viewPort, container, onUpdate, chartSize, thresholdOptions, thresholds, hasAnnotationChanged, }) => {
    const bars = scene.scene.children[0];
    // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
    // chart scene, we must fully recreate the chart scene. This is a costly operation.
    const isDataOverflowingBuffer = maxDataPointsRendered(bars) < numDataPoints(dataStreams);
    if (isDataOverflowingBuffer || needsNewClipSpace(viewPort, scene.toClipSpace) || hasAnnotationChanged) {
        return chartScene({
            onUpdate,
            dataStreams,
            container,
            viewPort,
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

export { chartScene as c, updateChartScene as u };
