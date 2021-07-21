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
import { numDataPoints } from '../sc-webgl-base-chart/utils';
import { getBucketWidth, getSequential, getBucketColor } from './displayLogic';
import { HeatValueMap, calcHeatValues, getResolution } from './heatmapUtil';
import { BUCKET_COUNT, VERT_MARGIN_FACTOR } from './heatmapConstants';
import { DataStream, Primitive, ViewPort } from '../../../utils/dataTypes';
import { SECOND_IN_MS } from '../../../utils/time';

type BucketBufferGeometry = BufferGeometry & {
  attributes: {
    position: WriteableBufferAttribute;
    bucket: WriteableInstancedBufferAttribute;
    color: WriteableInstancedBufferAttribute;
    bucketHeight: WriteableInstancedBufferAttribute;
  };
};
type HeatmapMaterial = Material & {
  uniforms: {
    width: { value: number };
    devicePixelRatio: { value: number };
    bucketHeight: { value: number };
  };
};

export type HeatmapBucketMesh = InstancedMesh & { geometry: BucketBufferGeometry; material: HeatmapMaterial };

// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
export const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)

export const COLOR_PALETTE = getSequential();

// Each timestamp can have 10 buckets
const numBuckets = (heatValue: HeatValueMap): number => {
  return BUCKET_COUNT * Object.keys(heatValue).length;
};

const getUniformWidth = <T extends Primitive>(
  dataStreams: DataStream<T>[],
  toClipSpace: (time: number) => number,
  resolution: number
): number => {
  if (dataStreams.length === 0) {
    return 0;
  }

  return getBucketWidth({
    toClipSpace,
    resolution,
  });
};

const updateMesh = ({
  dataStreams,
  mesh,
  toClipSpace,
  viewport,
}: {
  dataStreams: DataStream[];
  mesh: HeatmapBucketMesh;
  toClipSpace: (time: number) => number;
  viewport: ViewPort;
}) => {
  // Set the number of instances of the bar are to be rendered.
  const { geometry } = mesh;
  const { color, bucket } = geometry.attributes;
  let positionIndex = 0;
  let colorIndex = 0;

  const resolution = getResolution(viewport);

  const heatValues =
    dataStreams.length !== 0
      ? calcHeatValues({ oldHeatValue: {}, dataStreams, resolution, viewport, bucketCount: BUCKET_COUNT })
      : {};

  // eslint-disable-next-line no-param-reassign
  mesh.count = numBuckets(heatValues);

  Object.keys(heatValues).forEach((xAxisBucketStart: string) => {
    Object.keys(heatValues[xAxisBucketStart]).forEach((bucketIndex: string) => {
      bucket.array[positionIndex] = toClipSpace(+xAxisBucketStart);
      bucket.array[positionIndex + 1] = +bucketIndex * (viewport.yMax / BUCKET_COUNT);

      const [r, g, b] = getBucketColor(
        COLOR_PALETTE,
        heatValues[xAxisBucketStart][bucketIndex].totalCount,
        (resolution / SECOND_IN_MS) * dataStreams.length
      );
      color.array[colorIndex] = r;
      color.array[colorIndex + 1] = g;
      color.array[colorIndex + 2] = b;

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
  viewport,
}: {
  dataStreams: DataStream[];
  toClipSpace: (time: number) => number;
  bufferFactor: number;
  minBufferSize: number;
  viewport: ViewPort;
}) => {
  const instGeo = (new InstancedBufferGeometry() as unknown) as BucketBufferGeometry;
  const bufferSize = Math.max(minBufferSize, numDataPoints(dataStreams) * bufferFactor);
  const resolution = getResolution(viewport);

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
        value: getUniformWidth(dataStreams, toClipSpace, resolution),
      },
      bucketHeight: {
        value: viewport.yMax / BUCKET_COUNT - (viewport.yMax / BUCKET_COUNT) * VERT_MARGIN_FACTOR,
      },
    },
  });

  const mesh = <HeatmapBucketMesh>new InstancedMesh(instGeo, bucketChartMaterial, bufferSize);
  updateMesh({ dataStreams, mesh, toClipSpace, viewport });

  // Prevent bounding sphere from being called
  mesh.frustumCulled = false;

  return mesh;
};

export const updateBucketMesh = ({
  buckets,
  dataStreams,
  toClipSpace,
  hasDataChanged,
  viewport,
}: {
  buckets: HeatmapBucketMesh;
  dataStreams: DataStream[];
  toClipSpace: (time: number) => number;
  hasDataChanged: boolean;
  viewport: ViewPort;
}) => {
  if (hasDataChanged) {
    const resolution = getResolution(viewport);
    // eslint-disable-next-line no-param-reassign
    buckets.material.uniforms.width.value = getUniformWidth(dataStreams, toClipSpace, resolution);
    // eslint-disable-next-line no-param-reassign
    buckets.material.uniforms.bucketHeight.value = viewport.yMax / BUCKET_COUNT - (viewport.yMax / BUCKET_COUNT) * VERT_MARGIN_FACTOR;
    updateMesh({ dataStreams, mesh: buckets, toClipSpace, viewport });
  }
};
