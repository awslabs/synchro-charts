import { AlarmsConfig, DataStream, ViewPort } from '../../../utils/dataTypes';
import { ChartScene } from '../../sc-webgl-context/types';
import { Threshold, ThresholdOptions } from '../common/types';

/**
 * Chart Scene Creator
 *
 * Creates a chart scene, which is the scene that threejs utilizes to render
 * the data visualization for a given webgl-based chart.
 */
export type ChartSceneCreator = (options: {
  dataStreams: DataStream[];
  alarms?: AlarmsConfig;
  container: HTMLElement;
  chartSize: { width: number; height: number };
  viewport: ViewPort;

  // The minimum number of points the buffer must be able to fit. The smaller this number is, the
  // less memory upfront is allocated to the buffers which improves performance.
  // The larger this number is, the less the frequency of buffer-resizing is required.
  // Resizing the buffer requires a full re-creation of the entire chart scene, which is an expensive operation.
  // it is best to err on the side of 'larger buffers, less re-creation of chart scenes'.
  minBufferSize: number;

  // The constant factor for how much larger the buffer is than the initial data set.
  // i.e. if the buffer factor is 10, and there are 1000 data points when the chart first initializes,
  // then the chart is guaranteed to have buffer which fits at the minimum of 1000 * 10 points
  bufferFactor: number;

  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];

  // Lifecycle method to be called every time there is any visual changes to be rendered, i.e. viewport changes, data changes, etc.
  onUpdate?: ({ start, end }: { start: Date; end: Date }) => void;
}) => ChartScene;

/**
 * Chart Scene Updater
 *
 * Updates the buffers, materials, and camera in the chart scene.
 */
export type ChartSceneUpdater = (options: {
  scene: ChartScene;
  dataStreams: DataStream[];
  alarms?: AlarmsConfig;
  container: HTMLElement;
  viewport: ViewPort;
  chartSize: { width: number; height: number };
  bufferFactor: number;
  minBufferSize: number;
  thresholdOptions: ThresholdOptions;
  thresholds: Threshold[];
  hasDataChanged: boolean;
  hasAnnotationChanged: boolean;
  hasSizeChanged: boolean;
  hasYRangeChanged?: boolean;
  hasXRangeChanged?: boolean;
  // Lifecycle method to be called every time there is any visual changes to be rendered, i.e. viewport changes, data changes, etc.
  onUpdate?: ({ start, end }: { start: Date; end: Date }) => void;
}) => ChartScene;
