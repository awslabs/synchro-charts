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
import { Primitive, DataStream, AlarmsConfig } from '../../../utils/dataTypes';
import statusVert from './status.vert';
import statusFrag from './status.frag';
import { WriteableBufferAttribute, WriteableInstancedBufferAttribute } from '../../monitor-webgl-context/types';
import { numDataPoints, vertices, getCSSColorByString } from '../sc-webgl-base-chart/utils';
import { STATUS_MARGIN_TOP_PX, DEFAULT_STATUS_BAR_COLOR, HEIGHT } from './constants';
import { getBreachedThreshold } from '../common/annotations/utils';
import { getDistanceFromDuration } from '../common/getDistanceFromDuration';
import { Threshold, ThresholdOptions } from '../common/types';

type StatusBufferGeometry = BufferGeometry & {
  attributes: {
    position: WriteableBufferAttribute;
    status: WriteableInstancedBufferAttribute;
    color: WriteableInstancedBufferAttribute;
  };
};
type StatusChartLineMaterial = Material & {
  uniforms: {
    devicePixelRatio: { value: number };
  };
};

export type StatusChartStatusMesh = InstancedMesh & {
  geometry: StatusBufferGeometry;
  material: StatusChartLineMaterial;
};

// Used to set the default buffer size for a given chart - the larger this is set to, the more memory will be allocated
// up front per `ChartScene`.
export const NUM_POSITION_COMPONENTS = 2; // (x, y)
export const NUM_STATUS_COMPONENTS = 4; // (x, y, width, height)

const NUM_COLOR_COMPONENTS = 3; // (r, g, b)

const numStatuses = (streamVertexSets: Primitive[][][]): number =>
  streamVertexSets.reduce((totalStatuses, streamVertexSet) => {
    const streamStatuses = Math.max(streamVertexSet.length, 0);
    return totalStatuses + streamStatuses;
  }, 0);

/**
 * Returns clip space width of the bar
 */
const getWidth = ({
  nextX,
  currX,
  toClipSpace,
  alarms,
}: {
  nextX?: number;
  currX: number;
  toClipSpace: (p: number) => number;
  alarms?: AlarmsConfig;
}) => {
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

const updateMesh = ({
  dataStreams,
  mesh,
  toClipSpace,
  thresholds,
  thresholdOptions,
  chartSize,
  alarms,
}: {
  dataStreams: DataStream[];
  mesh: StatusChartStatusMesh;
  toClipSpace: (time: number) => number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
  chartSize: { width: number; height: number };
  alarms?: AlarmsConfig;
}) => {
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
      } else {
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
const initializeGeometry = (geometry: StatusBufferGeometry, bufferSize: number) => {
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(unitSquare), NUM_POSITION_COMPONENTS));
  geometry.setAttribute(
    'status',
    new InstancedBufferAttribute(new Float32Array(bufferSize * NUM_STATUS_COMPONENTS), NUM_STATUS_COMPONENTS, false)
  );
  geometry.setAttribute(
    'color',
    new InstancedBufferAttribute(new Uint8Array(bufferSize * NUM_COLOR_COMPONENTS), NUM_COLOR_COMPONENTS, true)
  );
};

export const statusMesh = ({
  alarms,
  dataStreams,
  toClipSpace,
  bufferFactor,
  minBufferSize,
  thresholdOptions,
  thresholds,
  chartSize,
}: {
  alarms?: AlarmsConfig;
  dataStreams: DataStream[];
  toClipSpace: (time: number) => number;
  bufferFactor: number;
  minBufferSize: number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
  chartSize: { width: number; height: number };
}) => {
  const instGeo = (new InstancedBufferGeometry() as unknown) as StatusBufferGeometry;
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

  const mesh = <StatusChartStatusMesh>new InstancedMesh(instGeo, statusChartMaterial, bufferSize);
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

export const updateStatusMesh = ({
  alarms,
  statuses,
  dataStreams,
  toClipSpace,
  thresholdOptions,
  thresholds,
  chartSize,
  hasDataChanged,
  hasAnnotationChanged,
  hasSizeChanged,
}: {
  alarms?: AlarmsConfig;
  statuses: StatusChartStatusMesh;
  dataStreams: DataStream[];
  toClipSpace: (time: number) => number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
  chartSize: { width: number; height: number };
  hasDataChanged: boolean;
  hasAnnotationChanged: boolean;
  hasSizeChanged: boolean;
}) => {
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
