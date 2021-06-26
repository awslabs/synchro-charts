/* eslint-disable no-param-reassign */
// NOTE: The nature of updating buffers and uniforms requires parameter reassignment.
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Material,
  RawShaderMaterial,
} from 'three';

import { lineVert } from './line.vert';
import lineFrag from './line.frag';
import lineColorationFrag from './line-coloration.frag';
import { numDataPoints, vertices } from '../sc-webgl-base-chart/utils';
import { WriteableBufferAttribute, WriteableInstancedBufferAttribute } from '../../sc-webgl-context/types';
import { STROKE_WIDTH } from '../common';
import { pixelDensity } from '../common/pixelDensity';
import { thresholdBands } from '../common/annotations/thresholdBands';
import { isNumberDataStream } from '../../../utils/predicates';
import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { Threshold, ThresholdOptions } from '../common/types';

type LineBufferGeometry = BufferGeometry & {
  attributes: {
    position: WriteableBufferAttribute;
    currPoint: WriteableInstancedBufferAttribute;
    nextPoint: WriteableInstancedBufferAttribute;
    segmentColor: WriteableInstancedBufferAttribute;
  };
};
type LineChartLineMaterial = Material & {
  uniforms: {
    width: { value: number };
    xPixelDensity: { value: number };
    yPixelDensity: { value: number };
  };
};
export type LineChartLineMesh = InstancedMesh & { geometry: LineBufferGeometry; material: LineChartLineMaterial };

/**
 * Create Line Mesh`
 *
 * The representation of the lines between points on a chart.
 */

// Ensure that the line width is equal to the existing <sc-line-chart />'s line thickness
const LINE_WIDTH = STROKE_WIDTH;
export const LINE_MESH_INDEX = 1;

// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)

const numLineSegments = (streamVertexSets: number[][][]): number => {
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

const updateMesh = (dataStreams: DataStream[], mesh: LineChartLineMesh, toClipSpace: (time: number) => number) => {
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

const initializeGeometry = (geometry: LineBufferGeometry, bufferSize: number) => {
  /**
   * Create Attributes
   */
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(segmentInstanceGeometry.flat()), NUM_POSITION_COMPONENTS)
  );
  geometry.setAttribute(
    'currPoint',
    new InstancedBufferAttribute(new Float32Array(bufferSize * NUM_POSITION_COMPONENTS), NUM_POSITION_COMPONENTS, false)
  );
  geometry.setAttribute(
    'nextPoint',
    new InstancedBufferAttribute(new Float32Array(bufferSize * NUM_POSITION_COMPONENTS), NUM_POSITION_COMPONENTS, false)
  );
  geometry.setAttribute(
    'segmentColor',
    new InstancedBufferAttribute(new Uint8Array(bufferSize * NUM_COLOR_COMPONENTS), NUM_COLOR_COMPONENTS, true)
  );
};

export const lineMesh = ({
  viewPort,
  dataStreams,
  chartSize,
  minBufferSize,
  bufferFactor,
  toClipSpace,
  thresholdOptions,
  thresholds,
}: {
  chartSize: { width: number; height: number };
  dataStreams: DataStream[];
  viewPort: ViewPort;
  minBufferSize: number;
  bufferFactor: number;
  toClipSpace: (time: number) => number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
}): LineChartLineMesh => {
  const geometry = (new InstancedBufferGeometry() as unknown) as LineBufferGeometry;

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

  const mesh = <LineChartLineMesh>new InstancedMesh(geometry, lineMaterial, bufferSize);
  // Prevent bounding sphere from being called
  mesh.frustumCulled = false;

  updateMesh(dataStreams, mesh, toClipSpace);
  return mesh;
};

export const updateLineMesh = ({
  chartSize,
  toClipSpace,
  lines,
  dataStreams,
  viewPort,
  hasDataChanged,
}: {
  chartSize: { width: number; height: number };
  toClipSpace: (time: number) => number;
  lines: LineChartLineMesh;
  dataStreams: DataStream[];
  viewPort: ViewPort;
  hasDataChanged: boolean;
}) => {
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
