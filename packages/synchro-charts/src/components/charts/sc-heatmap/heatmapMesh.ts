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

import bucketVert from './heatmap.vert';
import bucketFrag from './heatmap.frag';
import { WriteableBufferAttribute, WriteableInstancedBufferAttribute } from '../../sc-webgl-context/types';
import { numDataPoints, vertices, getCSSColorByString } from '../sc-webgl-base-chart/utils';
import { getBucketWidth } from './displayLogic';
import { getBreachedThreshold } from '../common/annotations/utils';
import { isNumberDataStream } from '../../../utils/predicates';
import { DataStream, Primitive } from '../../../utils/dataTypes';
import { Threshold, ThresholdOptions } from '../common/types';

type BucketBufferGeometry = BufferGeometry & {
  attributes: {
    position: WriteableBufferAttribute;
    bucket: WriteableInstancedBufferAttribute;
    color: WriteableInstancedBufferAttribute;
  };
};
type BucketChartLineMaterial = Material & {
  uniforms: {
    width: { value: number };
    devicePixelRatio: { value: number };
  };
};

export type BucketChartBucketMesh = InstancedMesh & { geometry: BucketBufferGeometry; material: BucketChartLineMaterial };

// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
export const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)

const numBuckets = (streamVertexSets: number[][][]): number => {
  return streamVertexSets.reduce((totalBuckets, streamVertexSet) => totalBuckets + streamVertexSet.length, 0);
};

const getUniformWidth = <T extends Primitive>(
  dataStreams: DataStream<T>[],
  toClipSpace: (time: number) => number
): number => {
  if (dataStreams.length === 0) {
    return 0;
  }
  const { resolution } = dataStreams[0];

  return getBucketWidth({
    toClipSpace,
    numDataStreams: dataStreams.length,
    resolution,
  });
};

const updateMesh = ({
  dataStreams,
  mesh,
  toClipSpace,
  thresholds,
  thresholdOptions,
}: {
  dataStreams: DataStream[];
  mesh: BucketChartBucketMesh;
  toClipSpace: (time: number) => number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
}) => {
  const streamVertexSets = dataStreams.filter(isNumberDataStream).map(stream => vertices(stream, stream.resolution));

  // Set the number of instances of the bar are to be rendered.
  // eslint-disable-next-line no-param-reassign
  mesh.count = numBuckets(streamVertexSets);

  const { geometry } = mesh;
  const { color, bucket } = geometry.attributes;
  let positionIndex = 0;
  let colorIndex = 0;

  streamVertexSets.forEach((streamVertexSet, setIndex) => {
    streamVertexSet.forEach(currVertex => {
      const [currX, currY, r, g, b] = currVertex;
      /**
       * Subtracting setIndex * getUniformWidth(dataStreams, toClipSpace) because with each new
       * data stream, we want to render it side by side on the left side.
       */
      bucket.array[positionIndex] = toClipSpace(currX) - setIndex * getUniformWidth(dataStreams, toClipSpace);
      bucket.array[positionIndex + 1] = currY;

      const breachedThreshold = getBreachedThreshold(currY, thresholds);

      if (breachedThreshold == null || !thresholdOptions.showColor) {
        // Set bar color (r, g, b)
        color.array[colorIndex] = r;
        color.array[colorIndex + 1] = g;
        color.array[colorIndex + 2] = b;
      } else {
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

  bucket.needsUpdate = true;
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
const initializeGeometry = (geometry: BucketBufferGeometry, bufferSize: number) => {
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(unitSquare), NUM_POSITION_COMPONENTS));
  geometry.setAttribute(
    'bucket',
    new InstancedBufferAttribute(new Float32Array(bufferSize * NUM_POSITION_COMPONENTS), NUM_POSITION_COMPONENTS, false)
  );
  geometry.setAttribute(
    'color',
    new InstancedBufferAttribute(new Uint8Array(bufferSize * NUM_COLOR_COMPONENTS), NUM_COLOR_COMPONENTS, true)
  );
};

export const bucketMesh = ({
  dataStreams,
  toClipSpace,
  bufferFactor,
  minBufferSize,
  thresholdOptions,
  thresholds,
}: {
  dataStreams: DataStream[];
  toClipSpace: (time: number) => number;
  bufferFactor: number;
  minBufferSize: number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
}) => {
  const instGeo = (new InstancedBufferGeometry() as unknown) as BucketBufferGeometry;
  const bufferSize = Math.max(minBufferSize, numDataPoints(dataStreams) * bufferFactor);

  // Create and populate geometry
  initializeGeometry(instGeo, bufferSize);

  /**
   * Create Bucket Mesh
   *
   * The representation of the buckets on a bucket chart.
   *
   * Utilizes an instance of a single unit square, which then gets
   * stretched and transposed across the canvas.
   */
  const bucketChartMaterial = new RawShaderMaterial({
    vertexShader: bucketVert,
    fragmentShader: bucketFrag,
    side: DoubleSide,
    transparent: false,
    uniforms: {
      width: {
        value: getUniformWidth(dataStreams, toClipSpace),
      },
    },
  });

  const mesh = <BucketChartBucketMesh>new InstancedMesh(instGeo, bucketChartMaterial, bufferSize);
  updateMesh({ dataStreams, mesh, toClipSpace, thresholds, thresholdOptions });

  // Prevent bounding sphere from being called
  mesh.frustumCulled = false;

  return mesh;
};

export const updateBucketMesh = ({
  buckets,
  dataStreams,
  toClipSpace,
  hasDataChanged,
  thresholdOptions,
  thresholds,
}: {
  buckets: BucketChartBucketMesh;
  dataStreams: DataStream[];
  toClipSpace: (time: number) => number;
  hasDataChanged: boolean;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
}) => {
  if (hasDataChanged) {
    // eslint-disable-next-line no-param-reassign
    buckets.material.uniforms.width.value = getUniformWidth(dataStreams, toClipSpace);
    updateMesh({ dataStreams, mesh: buckets, toClipSpace, thresholds, thresholdOptions });
  }
};
