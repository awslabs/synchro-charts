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
import { numDataPoints, vertices } from '../sc-webgl-base-chart/utils';
import { getBucketWidth, getSequential, getBucketColor } from './displayLogic';
import { HeatValueMap, calcHeatValues } from './heatmapUtil';
import { getBreachedThreshold } from '../common/annotations/utils';
import { isNumberDataStream } from '../../../utils/predicates';
import { DataStream, Primitive, ViewPort } from '../../../utils/dataTypes';
import { MONTH_IN_MS, DAY_IN_MS, SECOND_IN_MS, HOUR_IN_MS, MINUTE_IN_MS } from '../../../utils/time';
import { Threshold, ThresholdOptions } from '../common/types';
import { DataType } from '../../../utils/dataConstants';

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
    bucketHeight: {value: number};
  };
};

export type HeatmapBucketMesh = InstancedMesh & { geometry: BucketBufferGeometry; material: HeatmapMaterial };

// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
export const NUM_POSITION_COMPONENTS = 2; // (x, y)
const NUM_COLOR_COMPONENTS = 3; // (r, g, b)

export const BUCKET_COUNT = 10;
export const colorPalette = getSequential();

const numBuckets = (streamVertexSets: number[][][]): number => {
  return 10 * streamVertexSets.reduce((totalBuckets, streamVertexSet) => totalBuckets + streamVertexSet.length, 0);
};

export const getResolution = (
  viewport: ViewPort,
): number => {
  const duration = viewport.duration ?? viewport.end.getTime() - viewport.start.getTime();
  if (duration > 5 * DAY_IN_MS) {
    return DAY_IN_MS;
  } else if (duration > 3 * HOUR_IN_MS) {
    return HOUR_IN_MS;
  } else if (duration > 3 * MINUTE_IN_MS) {
    return MINUTE_IN_MS;
  } else {
    return SECOND_IN_MS;
  }
};

const getUniformWidth = <T extends Primitive>(
  dataStreams: DataStream<T>[],
  toClipSpace: (time: number) => number,
  resolution: number,
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
  thresholds,
  thresholdOptions,
  viewport,
}: {
  dataStreams: DataStream[];
  mesh: HeatmapBucketMesh;
  toClipSpace: (time: number) => number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
  viewport: ViewPort
}) => {
  const streamVertexSets = dataStreams.filter(isNumberDataStream).map(stream => vertices(stream, stream.resolution));

  // Set the number of instances of the bar are to be rendered.
  // eslint-disable-next-line no-param-reassign
  mesh.count = numBuckets(streamVertexSets);

  const { geometry } = mesh;
  const { color, bucket } = geometry.attributes;
  let positionIndex = 0;
  let colorIndex = 0;

  const resolution = getResolution(viewport);

  let heatValues: HeatValueMap = {};
  if (dataStreams.length !== 0) {
    heatValues = calcHeatValues({
      oldHeatValue: {},
      dataStreams,
      resolution,
      viewport,
    });
  }

  for (let xAxisBucketStart in heatValues) {
    let buckets = heatValues[xAxisBucketStart];
    for (let bucketIndex in buckets) {
      bucket.array[positionIndex] = toClipSpace(+xAxisBucketStart);
      bucket.array[positionIndex + 1] = +bucketIndex * (viewport.yMax / BUCKET_COUNT);

      const bucketColor = getBucketColor(colorPalette, buckets[bucketIndex].totalCount, resolution / 1000 * streamVertexSets.length);
      color.array[colorIndex] = bucketColor[0];
      color.array[colorIndex + 1] = bucketColor[1];
      color.array[colorIndex + 2] = bucketColor[2];

      colorIndex += NUM_COLOR_COMPONENTS;
      positionIndex += NUM_POSITION_COMPONENTS;
    }
  }
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
  viewport,
}: {
  dataStreams: DataStream[];
  toClipSpace: (time: number) => number;
  bufferFactor: number;
  minBufferSize: number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
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
        value: viewport.yMax / 10 - 2,
      }
    },
  });

  const mesh = <HeatmapBucketMesh>new InstancedMesh(instGeo, bucketChartMaterial, bufferSize);
  updateMesh({ dataStreams, mesh, toClipSpace, thresholds, thresholdOptions, viewport });

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
  viewport,
}: {
  buckets: HeatmapBucketMesh;
  dataStreams: DataStream[];
  toClipSpace: (time: number) => number;
  hasDataChanged: boolean;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
  viewport: ViewPort;
}) => {
  if (hasDataChanged) {
    const resolution = getResolution(viewport);
    // eslint-disable-next-line no-param-reassign
    buckets.material.uniforms.width.value = getUniformWidth(dataStreams, toClipSpace, resolution);
    buckets.material.uniforms.bucketHeight.value = viewport.yMax / 10 - 2;
    updateMesh({ dataStreams, mesh: buckets, toClipSpace, thresholds, thresholdOptions, viewport });
  }
};
