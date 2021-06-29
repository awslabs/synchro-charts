import { C as COMPARISON_OPERATOR } from './constants-4b21170a.js';
import { B as BufferAttribute, c as BufferGeometry, d as ShaderMaterial, P as Points } from './three.module-af3affdd.js';
import { a as isNumberDataStream } from './predicates-ced25765.js';
import { b as getNumberThresholds, s as sortThreshold, g as getBreachedThreshold } from './utils-11cae6c8.js';
import { g as getCSSColorByString, v as vertices, n as numDataPoints } from './clipSpaceConversion-16977037.js';

const pointVert = (showColor) => `
varying vec3 vColor;
${showColor ? 'varying float positionY;' : ''}
attribute vec3 pointColor;
uniform float pointDiameter;
uniform float devicePixelRatio;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, 0.0, 1.0);
  gl_PointSize = pointDiameter * devicePixelRatio;
  vColor = pointColor;
  ${showColor ? 'positionY = position.y;' : ''}
}
`;

const shaderFrag = `
varying vec3 vColor;

void main() {
  // calculate position such that the center is (0, 0) in a region of [-1, 1] x [-1, 1]
  vec2 pos = 2.0 * gl_PointCoord.xy - 1.0;
  // r = distance squared from the origin of the point being rendered
  float r = dot(pos, pos);
  if (r > 1.0) {
    discard;
  }
  float alpha = 1.0 - smoothstep(0.5, 1.0, sqrt(r));
  gl_FragColor = vec4(vColor, alpha);
}
`;

/**
 * Max of 12 threshold bands because we allow only up to 10 thresholds. Imaging a piece of paper being split into
 * 10 times. You will end up with 11 different pieces. Set it as 12 to over allocate.
 */
const MAX_THRESHOLD_BANDS = 12;
/**
 * First we sort the thresholds then reverse it. Reversing the sorted threshold allows us to create the band from
 * top to bottom.
 *
 * For each threshold that is not the first or the last, we check both upper and lower to see if a band is needed.
 *
 * Because we check against the previous threshold and the next threshold, a set is needed to prevent duplicates
 *
 * We know that all the threshold bands can only have unique upper, so we will be using that as the key in the Set.
 */
const thresholdBands = (thresholds) => {
    if (thresholds.length === 0) {
        return [];
    }
    const numberThresholds = getNumberThresholds(thresholds);
    const sortedThresholds = sortThreshold(numberThresholds).reverse();
    const bands = [];
    const thresholdBandsSet = new Set();
    sortedThresholds.forEach((threshold, index) => {
        const thresholdValue = threshold.value;
        if (sortedThresholds[index].comparisonOperator === COMPARISON_OPERATOR.EQUAL) {
            const [r, g, b] = getCSSColorByString(sortedThresholds[index].color);
            bands.push({
                upper: thresholdValue,
                lower: thresholdValue,
                color: [r, g, b],
            });
            return;
        }
        /**
         * When looking at the first threshold, we want to find a mid point between the MAX SAFE INTEGER and the first
         * threshold value to determine if the first threshold is an upper bound threshold.
         */
        if (index === 0) {
            const midPoint = (Number.MAX_SAFE_INTEGER + thresholdValue) / 2;
            const breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
            if (breachedThreshold != null) {
                const [r, g, b] = getCSSColorByString(breachedThreshold.color);
                bands.push({
                    upper: Number.MAX_SAFE_INTEGER,
                    lower: thresholdValue,
                    color: [r, g, b],
                });
            }
            return;
        }
        /**
         * When looking at the thresholds that is not the first or the last, we want to compare it with the one before
         * to make sure if there is an upper band or not.
         */
        const prevThreshold = sortedThresholds[index - 1];
        const prevThresholdValue = prevThreshold.value;
        let midPoint = (prevThresholdValue + thresholdValue) / 2;
        let breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
        if (breachedThreshold != null) {
            if (!thresholdBandsSet.has(prevThreshold.value)) {
                const [r, g, b] = getCSSColorByString(breachedThreshold.color);
                if (prevThreshold.comparisonOperator === COMPARISON_OPERATOR.EQUAL &&
                    prevThreshold.value === sortedThresholds[index].value) {
                    bands.push({
                        upper: prevThresholdValue,
                        lower: thresholdValue,
                        color: [r, g, b],
                    });
                }
                else {
                    bands.push({
                        upper: prevThresholdValue,
                        lower: thresholdValue,
                        color: [r, g, b],
                    });
                }
                thresholdBandsSet.add(prevThreshold.value);
            }
        }
        /**
         * When looking at the last threshold, we want to find the mid point between it and the Min Safe Int
         * to see if there is a lower band that needs to be create.
         */
        if (index === sortedThresholds.length - 1) {
            midPoint = (thresholdValue + Number.MIN_SAFE_INTEGER) / 2;
            breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
            if (breachedThreshold != null && !thresholdBandsSet.has(thresholdValue)) {
                const [r, g, b] = getCSSColorByString(breachedThreshold.color);
                bands.push({
                    lower: Number.MIN_SAFE_INTEGER,
                    upper: thresholdValue,
                    color: [r, g, b],
                });
            }
            return;
        }
        /**
         * When looking at a threshold that is not first or last, we want to compare it with the next one to see if
         * a lower band is needed.
         */
        const nexThreshold = sortedThresholds[index + 1];
        const nexThresholdValue = nexThreshold.value;
        midPoint = (thresholdValue + nexThresholdValue) / 2;
        breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
        if (breachedThreshold != null && !thresholdBandsSet.has(thresholdValue)) {
            const [r, g, b] = getCSSColorByString(breachedThreshold.color);
            bands.push({
                upper: thresholdValue,
                lower: nexThresholdValue,
                color: [r, g, b],
            });
            thresholdBandsSet.add(threshold.value);
        }
    });
    /**
     * Because we need to have a set amount of buffer in Frag, which is 12. If the array length is not 12,
     * we need to fill in the rest with proper threshold bands. It should be duplicates of the last threshold band
     *
     * This function also takes into account when there is only 1 threshold with lower bound.
     */
    let lastThresholdBand = bands[bands.length - 1];
    while (bands.length < MAX_THRESHOLD_BANDS) {
        const threshold = sortedThresholds[sortedThresholds.length - 1];
        const thresholdValue = threshold.value;
        const midPoint = Number.MIN_SAFE_INTEGER + thresholdValue / 2;
        const breachedThreshold = getBreachedThreshold(midPoint, sortedThresholds);
        if (breachedThreshold == null) {
            bands.push(lastThresholdBand);
        }
        else {
            const [r, g, b] = getCSSColorByString(breachedThreshold.color);
            lastThresholdBand = {
                lower: Number.MIN_SAFE_INTEGER,
                upper: thresholdValue,
                color: [r, g, b],
            };
            bands.push(lastThresholdBand);
        }
    }
    return bands;
};

const colorationShaderFrag = `
#define MAX_NUM_TOTAL_THRESHOLD_BAND ${MAX_THRESHOLD_BANDS}

struct Band {
  float upper;
  float lower;
  vec3 color;
};

varying vec3 vColor;
varying float positionY;

uniform Band thresholdBands[MAX_NUM_TOTAL_THRESHOLD_BAND];
uniform float yPixelDensity;

void main() {
  // calculate position such that the center is (0, 0) in a region of [-1, 1] x [-1, 1]
  vec2 pos = 2.0 * gl_PointCoord.xy - 1.0;
  // r = distance squared from the origin of the point being rendered
  float r = dot(pos, pos);
  if (r > 1.0) {
    discard;
  }
  float alpha = 1.0 - smoothstep(0.5, 1.0, sqrt(r));

  for(int i = 0; i < MAX_NUM_TOTAL_THRESHOLD_BAND; i++) {
    bool isRangeBreached = positionY >= thresholdBands[i].lower && positionY <= thresholdBands[i].upper;
    bool isEqualsThreshold = thresholdBands[i].lower == thresholdBands[i].upper;
    bool isEqualsThresholdBreached = positionY == thresholdBands[i].upper;

    if (isRangeBreached || (isEqualsThreshold && isEqualsThresholdBreached)) {
       gl_FragColor = vec4(thresholdBands[i].color /255.0, alpha);
       break;
    } else {
       gl_FragColor = vec4(vColor, alpha);
    }
  }
}
`;

/* eslint-disable no-param-reassign */
const POINT_MESH_INDEX = 0;
const POINT_DIAMETER = 6.25;
const RAW_POINT_DIAMETER = 4;
/**
 * Get the diameter of the points to display on the chart.
 *
 * We want to display points smaller for raw data since they may be displayed very densely
 */
const pointDiameter = (dataStreams) => {
    const resolution = dataStreams[0] != null ? dataStreams[0].resolution : null;
    return resolution === 0 ? RAW_POINT_DIAMETER : POINT_DIAMETER;
};
/**
 * Create Point Mesh
 *
 * The representation of the points on a chart.
 */
// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)
/**
 * Update Geometry
 *
 * Updates the color, and position of the vertices sent down to the vertex shader.
 */
const updateGeometry = (geometry, dataStreams, toClipSpace) => {
    const streamVertexSets = dataStreams.filter(isNumberDataStream).map(stream => vertices(stream, stream.resolution));
    const allVertices = streamVertexSets.flat();
    const { position, pointColor } = geometry.attributes;
    /**
     * Fill Buffers with data
     */
    allVertices.forEach(([x, y, r, g, b], i) => {
        // Set Position
        position.array[i * NUM_POSITION_COMPONENTS] = toClipSpace(x);
        position.array[i * NUM_POSITION_COMPONENTS + 1] = y;
        // Set Normal Data Stream Color
        pointColor.array[i * NUM_COLOR_COMPONENTS] = r;
        pointColor.array[i * NUM_COLOR_COMPONENTS + 1] = g;
        pointColor.array[i * NUM_COLOR_COMPONENTS + 2] = b;
    });
    geometry.setDrawRange(0, allVertices.length);
    position.needsUpdate = true;
    pointColor.needsUpdate = true;
};
const initializeGeometry = (geometry, bufferSize) => {
    // TODO: Change to double precision
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(bufferSize * NUM_POSITION_COMPONENTS), NUM_POSITION_COMPONENTS));
    geometry.setAttribute('pointColor', new BufferAttribute(new Uint8Array(bufferSize * NUM_COLOR_COMPONENTS), NUM_COLOR_COMPONENTS, true));
};
/**
 * Create Point Mesh
 */
const pointMesh = ({ toClipSpace, dataStreams, minBufferSize, bufferFactor, thresholdOptions, thresholds, }) => {
    const bufferSize = Math.max(minBufferSize, numDataPoints(dataStreams) * bufferFactor);
    const geometry = new BufferGeometry();
    initializeGeometry(geometry, bufferSize);
    updateGeometry(geometry, dataStreams, toClipSpace);
    const { showColor = true } = thresholdOptions;
    const material = new ShaderMaterial({
        vertexShader: pointVert(showColor && thresholds.length > 0),
        fragmentShader: !showColor || thresholds.length === 0 ? shaderFrag : colorationShaderFrag,
        transparent: true,
        uniforms: {
            pointDiameter: {
                value: pointDiameter(dataStreams),
            },
            devicePixelRatio: {
                value: window.devicePixelRatio,
            },
            thresholdBands: {
                value: thresholdBands(thresholds),
            },
        },
    });
    const points = new Points(geometry, material);
    // Prevent computeBoundingSphere from being called
    points.frustumCulled = false;
    return points;
};
/**
 * Update Point Mesh
 *
 * Updates the point mesh to match the given data stream info and data streams.
 * Increases size of attribute buffers if necessary.
 */
const updatePointMesh = (dataStreams, points, toClipSpace, hasDataChanged = true) => {
    /**
     * Update Uniforms
     *
     * The uniforms are variables passed into the webgl Shaders.
     * Learn more about uniforms:
     * https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html#uniforms
     */
    points.material.uniforms.pointDiameter.value = pointDiameter(dataStreams);
    points.material.uniforms.devicePixelRatio.value = window.devicePixelRatio;
    if (hasDataChanged) {
        updateGeometry(points.geometry, dataStreams, toClipSpace);
    }
};

export { MAX_THRESHOLD_BANDS as M, NUM_POSITION_COMPONENTS as N, POINT_MESH_INDEX as P, pointMesh as p, thresholdBands as t, updatePointMesh as u };
