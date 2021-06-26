/* eslint-disable no-param-reassign */
import { BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three';
import { pointVert } from './point.vert';
import shaderFrag from './point.frag';
import colorationShaderFrag from './point-coloration.frag';
import { numDataPoints, vertices } from '../../sc-webgl-base-chart/utils';
import { WriteableBufferAttribute } from '../../../sc-webgl-context/types';
import { thresholdBands } from '../annotations/thresholdBands';
import { isNumberDataStream } from '../../../../utils/predicates';
import { DataStream, Primitive } from '../../../../utils/dataTypes';
import { Threshold, ThresholdOptions } from '../types';

export const POINT_MESH_INDEX = 0;
const POINT_DIAMETER = 6.25;
const RAW_POINT_DIAMETER = 4;

/**
 * Get the diameter of the points to display on the chart.
 *
 * We want to display points smaller for raw data since they may be displayed very densely
 */
const pointDiameter = <T extends Primitive>(dataStreams: DataStream<T>[]): number => {
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
export const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)

// TODO(btd): Need to account for other visualization types, such as bar chart and line chart.
export type PointBufferGeometry = BufferGeometry & {
  attributes: { position: WriteableBufferAttribute; pointColor: WriteableBufferAttribute };
};
type PointMaterial = ShaderMaterial & {
  uniforms: {
    pointDiameter: { value: number };
    devicePixelRatio: { value: number };
  };
};
export type PointMesh = Points & { geometry: PointBufferGeometry; material: PointMaterial };
/**
 * Update Geometry
 *
 * Updates the color, and position of the vertices sent down to the vertex shader.
 */
const updateGeometry = (
  geometry: PointBufferGeometry,
  dataStreams: DataStream<Primitive>[],
  toClipSpace: (time: number) => number
) => {
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

const initializeGeometry = (geometry: PointBufferGeometry, bufferSize: number) => {
  // TODO: Change to double precision
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(bufferSize * NUM_POSITION_COMPONENTS), NUM_POSITION_COMPONENTS)
  );
  geometry.setAttribute(
    'pointColor',
    new BufferAttribute(new Uint8Array(bufferSize * NUM_COLOR_COMPONENTS), NUM_COLOR_COMPONENTS, true)
  );
};

/**
 * Create Point Mesh
 */
export const pointMesh = ({
  toClipSpace,
  dataStreams,
  minBufferSize,
  bufferFactor,
  thresholdOptions,
  thresholds,
}: {
  toClipSpace: (time: number) => number;
  dataStreams: DataStream[];
  minBufferSize: number;
  bufferFactor: number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
}): PointMesh => {
  const bufferSize = Math.max(minBufferSize, numDataPoints(dataStreams) * bufferFactor);
  const geometry = new BufferGeometry() as PointBufferGeometry;
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
  const points = <PointMesh>new Points(geometry, material);
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
export const updatePointMesh = (
  dataStreams: DataStream[],
  points: PointMesh,
  toClipSpace: (time: number) => number,
  hasDataChanged: boolean = true
) => {
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
