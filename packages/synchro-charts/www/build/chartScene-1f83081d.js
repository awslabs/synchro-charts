import { B as BufferAttribute, I as InstancedBufferAttribute, a as InstancedBufferGeometry, R as RawShaderMaterial, D as DoubleSide, b as InstancedMesh, S as Scene } from './three.module-af3affdd.js';
import { a as isNumberDataStream } from './predicates-ced25765.js';
import { b as getNumberThresholds } from './utils-11cae6c8.js';
import { v as vertices, n as numDataPoints, c as clipSpaceConversion, a as constructChartScene, b as needsNewClipSpace } from './clipSpaceConversion-16977037.js';
import { M as MAX_THRESHOLD_BANDS, t as thresholdBands, P as POINT_MESH_INDEX, p as pointMesh, N as NUM_POSITION_COMPONENTS$1, u as updatePointMesh } from './pointMesh-b470027f.js';

const lineVert = (showColor) => `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float width;
uniform float xPixelDensity;
uniform float yPixelDensity;
attribute vec2 currPoint;
attribute vec2 nextPoint;
attribute vec2 position;
attribute vec3 segmentColor;
varying vec3 vColor;
${showColor ? 'varying float yPositionPx;' : ''}

// line shader using instanced lines
// https://wwwtyro.net/2019/11/18/instanced-lines.html for information on this approach
void main() {
  // Convert the points to pixel coordinates - otherwise out basis vectors won't be perpendicular when
  // rasterized to the screen.
  vec2 currPointPx = vec2(currPoint.x / xPixelDensity, currPoint.y / yPixelDensity);
  vec2 nextPointPx = vec2(nextPoint.x / xPixelDensity, nextPoint.y / yPixelDensity);

  // create the basis vectors of a coordinate space where the x axis is parallel with
  // the path between currPoint and nextPoint, and the y axis is perpendicular to the
  // path between currPoint and nextPoint
  vec2 xBasis = nextPointPx - currPointPx;
  vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));

  // project the instance segment along the basis vectors
  vec2 positionPx = currPointPx + xBasis * position.x + yBasis * width * position.y;

  // Convert from pixel coordinates back to model space
  vec2 positionModel = vec2(positionPx.x * xPixelDensity, positionPx.y * yPixelDensity);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(positionModel, 0.0, 1.0);
  vColor = segmentColor;
  ${showColor ? 'yPositionPx = positionPx.y;' : ''}
}
`;

const lineFrag = `
precision highp float;
varying vec3 vColor;

// Fills in triangles which make up a line segment, with the corresponding color
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`;

const lineColorationFrag = `
// This file is only being used when we have threshold bands
// that will break the line segments into different color
#define MAX_NUM_TOTAL_THRESHOLD_BAND ${MAX_THRESHOLD_BANDS}

precision highp float;
struct Band {
  float upper;
  float lower;
  vec3 color;
};

varying vec3 vColor;
varying float yPositionPx;
uniform float yPixelDensity;
uniform Band thresholdBands[MAX_NUM_TOTAL_THRESHOLD_BAND];

// Fills in triangles which make up a line segment, with the corresponding color
void main() {
  for(int i = 0; i < MAX_NUM_TOTAL_THRESHOLD_BAND; i++) {
    bool isRangeBreached = yPositionPx > thresholdBands[i].lower / yPixelDensity
      && yPositionPx < thresholdBands[i].upper / yPixelDensity;
    bool isEqualsThreshold = thresholdBands[i].lower == thresholdBands[i].upper;
    bool isEqualsThresholdBreached = yPositionPx == thresholdBands[i].upper;

    if (isRangeBreached || (isEqualsThreshold && isEqualsThresholdBreached)) {
       gl_FragColor = vec4(thresholdBands[i].color / 255.0, 1.0);
       break;
    } else {
       gl_FragColor = vec4(vColor, 1.0);
    }
  }
}
`;

/**
 * Line Chart Settings
 */
const STROKE_WIDTH = 1.5;
const POINT_RADIUS = 2;
const FIRST_POINT_RADIUS = POINT_RADIUS * 2;

/**
 * Get Pixel Density in terms of the clip space
 *
 * Returns the ratio of model space to pixel space in each dimension.
 * i.e. how many pixels does 10 minutes represent on a given `container`?
 */
const pixelDensity = ({ viewPort: { end, start, yMax, yMin }, toClipSpace, size, }) => {
    const { width, height } = size;
    // We must translate our viewport to be in terms of the coordinate system which matches
    // that of the data being passed in - since we want to know how many pixels
    // are represented within the webGL context. i.e. clip space pixel density.
    const x = Math.abs((toClipSpace(end.getTime()) - toClipSpace(start.getTime())) / width);
    const y = Math.abs((yMax - yMin) / height);
    return { x, y };
};

/* eslint-disable no-param-reassign */
/**
 * Create Line Mesh`
 *
 * The representation of the lines between points on a chart.
 */
// Ensure that the line width is equal to the existing <sc-line-chart />'s line thickness
const LINE_WIDTH = STROKE_WIDTH;
const LINE_MESH_INDEX = 1;
// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)
const numLineSegments = (streamVertexSets) => {
    const segments = streamVertexSets.reduce((totalSegments, streamVertexSet) => {
        // For every point added within a stream, a new segment is drawn,
        // While there is no visible line segment for the first point added in a stream,
        // it draws a 'degenerate' segment which is rendered as nothing.
        // This is purely an implementation detail of the shader, but we must take it into account
        // when determining the number of 'instances' to be drawn by the instance mesh.
        // ex1. o--o--o--o  [4 points, 3 visible segments, 1 degenerate segment]
        // ex2. o           [1 point, 0 visible segments]
        const streamSegments = Math.max(streamVertexSet.length, 0);
        return totalSegments + streamSegments;
    }, 0);
    return segments;
};
const updateMesh = (dataStreams, mesh, toClipSpace) => {
    const streamVertexSets = dataStreams.filter(isNumberDataStream).map(stream => vertices(stream, stream.resolution));
    // Set the number of instances of the line segment that are to be rendered.
    mesh.count = numLineSegments(streamVertexSets);
    const { geometry } = mesh;
    /**
     * Fill Buffers with data
     */
    const { currPoint, nextPoint, segmentColor } = geometry.attributes;
    let positionIndex = 0;
    let colorIndex = 0;
    streamVertexSets.forEach(streamVertexSet => {
        streamVertexSet.forEach((currVertex, vertexNum) => {
            const isLastVertex = vertexNum === streamVertexSet.length - 1;
            const nextVertex = !isLastVertex ? streamVertexSet[vertexNum + 1] : currVertex;
            const [currX, currY, r, g, b] = currVertex;
            const [nextX, nextY] = nextVertex;
            // NOTE: WebGL takes a buffer of values and then converts those to vectors or the correct dimensionality
            // Set Current Position (currX, currY)
            currPoint.array[positionIndex] = toClipSpace(currX);
            currPoint.array[positionIndex + 1] = currY;
            // Set Next Position (nextX, nextY)
            nextPoint.array[positionIndex] = toClipSpace(nextX);
            nextPoint.array[positionIndex + 1] = nextY;
            // Set Line Segment Color (r, g, b)
            segmentColor.array[colorIndex] = r;
            segmentColor.array[colorIndex + 1] = g;
            segmentColor.array[colorIndex + 2] = b;
            // Increment Indexes by the associated stride of the buffer
            colorIndex += NUM_COLOR_COMPONENTS;
            positionIndex += NUM_POSITION_COMPONENTS;
        });
    });
    currPoint.needsUpdate = true;
    nextPoint.needsUpdate = true;
    segmentColor.needsUpdate = true;
};
/**
 * Segment Instance Geometry is a square made up of two triangles,
 * as shown in the 'perfect' diagram shown below:
 * (0, 0.5)----(1, 0.5)
 *    |  \         |
 *    |     \      |
 *    |         \  |
 * (0, -0.5)---(1, -0.5)
 */
const segmentInstanceGeometry = [
    [0, -0.5],
    [1, -0.5],
    [1, 0.5],
    [0, -0.5],
    [1, 0.5],
    [0, 0.5],
];
const initializeGeometry = (geometry, bufferSize) => {
    /**
     * Create Attributes
     */
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(segmentInstanceGeometry.flat()), NUM_POSITION_COMPONENTS));
    geometry.setAttribute('currPoint', new InstancedBufferAttribute(new Float32Array(bufferSize * NUM_POSITION_COMPONENTS), NUM_POSITION_COMPONENTS, false));
    geometry.setAttribute('nextPoint', new InstancedBufferAttribute(new Float32Array(bufferSize * NUM_POSITION_COMPONENTS), NUM_POSITION_COMPONENTS, false));
    geometry.setAttribute('segmentColor', new InstancedBufferAttribute(new Uint8Array(bufferSize * NUM_COLOR_COMPONENTS), NUM_COLOR_COMPONENTS, true));
};
const lineMesh = ({ viewPort, dataStreams, chartSize, minBufferSize, bufferFactor, toClipSpace, thresholdOptions, thresholds, }) => {
    const geometry = new InstancedBufferGeometry();
    const bufferSize = Math.max(minBufferSize, numDataPoints(dataStreams) * bufferFactor);
    // Create and populate geometry
    initializeGeometry(geometry, bufferSize);
    // Construct shader
    const { x: xPixelDensity, y: yPixelDensity } = pixelDensity({ viewPort, toClipSpace, size: chartSize });
    const { showColor = true } = thresholdOptions;
    const lineMaterial = new RawShaderMaterial({
        vertexShader: lineVert(showColor && thresholds.length > 0),
        fragmentShader: !showColor || thresholds.length === 0 ? lineFrag : lineColorationFrag,
        side: DoubleSide,
        transparent: true,
        uniforms: {
            width: {
                value: LINE_WIDTH,
            },
            xPixelDensity: {
                value: xPixelDensity,
            },
            yPixelDensity: {
                value: yPixelDensity,
            },
            thresholdBands: {
                value: thresholdBands(thresholds),
            },
        },
    });
    const mesh = new InstancedMesh(geometry, lineMaterial, bufferSize);
    // Prevent bounding sphere from being called
    mesh.frustumCulled = false;
    updateMesh(dataStreams, mesh, toClipSpace);
    return mesh;
};
const updateLineMesh = ({ chartSize, toClipSpace, lines, dataStreams, viewPort, hasDataChanged, }) => {
    /**
     * Update Uniforms
     */
    const { x: xPixelDensity, y: yPixelDensity } = pixelDensity({ viewPort, toClipSpace, size: chartSize });
    lines.material.uniforms.xPixelDensity.value = xPixelDensity;
    lines.material.uniforms.yPixelDensity.value = yPixelDensity;
    /**
     * Update Data
     */
    if (hasDataChanged) {
        updateMesh(dataStreams, lines, toClipSpace);
    }
};

const chartScene = ({ dataStreams, chartSize, container, viewPort, minBufferSize, bufferFactor, onUpdate, thresholdOptions, thresholds, }) => {
    const scene = new Scene();
    const toClipSpace = clipSpaceConversion(viewPort);
    const numberThresholds = getNumberThresholds(thresholds);
    // Create and add meshes to the chart scene
    const meshList = [];
    meshList[LINE_MESH_INDEX] = lineMesh({
        toClipSpace,
        chartSize,
        dataStreams,
        viewPort,
        minBufferSize,
        bufferFactor,
        thresholdOptions,
        thresholds: numberThresholds,
    });
    meshList[POINT_MESH_INDEX] = pointMesh({
        dataStreams,
        minBufferSize,
        bufferFactor,
        toClipSpace,
        thresholdOptions,
        thresholds: numberThresholds,
    });
    meshList.forEach(mesh => scene.add(mesh));
    return constructChartScene({ scene, viewPort, container, toClipSpace, onUpdate });
};
const maxDataPointsRendered = (points) => points.geometry.attributes.position.array.length / NUM_POSITION_COMPONENTS$1;
const updateChartScene = ({ scene, dataStreams, chartSize, container, viewPort, hasDataChanged, bufferFactor, minBufferSize, onUpdate, thresholdOptions, hasAnnotationChanged, thresholds, }) => {
    const lines = scene.scene.children[LINE_MESH_INDEX];
    const points = scene.scene.children[POINT_MESH_INDEX];
    // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
    // chart scene, we must fully recreate the chart scene. This is a costly operation.
    const isDataOverflowingBuffer = maxDataPointsRendered(points) < numDataPoints(dataStreams);
    if (isDataOverflowingBuffer || needsNewClipSpace(viewPort, scene.toClipSpace) || hasAnnotationChanged) {
        return chartScene({
            dataStreams,
            chartSize,
            container,
            viewPort,
            minBufferSize,
            bufferFactor,
            onUpdate,
            thresholdOptions,
            thresholds,
        });
    }
    updateLineMesh({
        lines,
        dataStreams,
        chartSize,
        viewPort,
        hasDataChanged,
        toClipSpace: scene.toClipSpace,
    });
    updatePointMesh(dataStreams, points, scene.toClipSpace, hasDataChanged);
    // Return existing scene.
    return scene;
};

export { chartScene as c, updateChartScene as u };
