import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import isEqual from 'lodash.isequal';
import throttle from 'lodash.throttle';
import clone from 'lodash.clonedeep';

import {
  AlarmsConfig,
  DataPoint,
  DataStream,
  MinimalViewPortConfig,
  SizeConfig,
  SizePositionConfig,
  ViewPort,
  ViewPortConfig,
  RequestDataFn,
  MessageOverrides,
} from '../../../utils/dataTypes';
import {
  Annotations,
  Axis,
  LegendConfig,
  WidgetConfigurationUpdate,
  Threshold,
  ThresholdOptions,
  Tooltip,
  Legend,
} from '../common/types';

import { webGLRenderer } from '../../sc-webgl-context/webglContext';
import { ChartScene } from '../../sc-webgl-context/types';
import { DEFAULT_CHART_CONFIG, DEFAULT_THRESHOLD_OPTIONS, DEFAULT_THRESHOLD_OPTIONS_OFF } from './chartDefaults';
import { ChartSceneCreator, ChartSceneUpdater } from './types';
import { LoadingStatus } from './LoadingStatus';
import { ErrorStatus } from './ErrorStatus';
import { ChartLegendContainer } from './ChartLegendContainer';
import { DataContainer } from './DataContainer';
import { renderAnnotations } from '../common/annotations/renderAnnotations';
import { getNumberAnnotations, isThreshold } from '../common/annotations/utils';
import { renderTrendLines } from '../common/trends/renderTrendLines';
import { Trend, TrendResult } from '../common/trends/types';
import { renderAxis } from './renderAxis';
import { parseDuration, SECOND_IN_MS } from '../../../utils/time';
import { getAllTrendResults } from '../common/trends/trendAnalysis';
import { getVisibleData } from '../common/dataFilters';
import { getYRange } from '../common/getYRange';
import { isNumeric } from '../../../utils/number';
import { isMinimalStaticViewport, isNumberDataStream } from '../../../utils/predicates';
import { EmptyStatus } from './EmptyStatus';
import { getDataPoints } from '../../../utils/getDataPoints';
import { StreamType } from '../../../utils/dataConstants';
import { LEGEND_POSITION } from '../common/constants';
import { getDataStreamForEventing } from '../common';
import { attachDraggable } from '../common/annotations/draggableAnnotations';

const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;

const LEGEND_HEIGHT = 100;
const DATE_RANGE_EMIT_EVENT_MS = 0.5 * SECOND_IN_MS;

const DEFAULT_SHOW_DATA_STREAM_COLOR = true;

@Component({
  tag: 'sc-webgl-base-chart',
  styleUrl: './sc-webgl-base-chart.css',
  shadow: false,
})
export class ScWebglBaseChart {
  @Element() el: HTMLElement;
  @Event()
  widgetUpdated: EventEmitter<WidgetConfigurationUpdate>;

  /**
   * On view port date range change, this component emits a `dateRangeChange` event.
   * This allows other data visualization components to sync to the same date range.
   */
  @Event() dateRangeChange: EventEmitter<[Date, Date, string | undefined]>;

  @Prop() dataStreams!: DataStream[];
  @Prop() updateChartScene!: ChartSceneUpdater;
  @Prop() createChartScene!: ChartSceneCreator;
  @Prop() viewport!: MinimalViewPortConfig;
  @Prop() gestures!: boolean;
  @Prop() size!: SizePositionConfig;
  @Prop() isEditing: boolean = false;
  @Prop() configId!: string;
  @Prop() bufferFactor!: number;
  @Prop() minBufferSize!: number;
  @Prop() legend: LegendConfig;
  @Prop() renderLegend: (props: Legend.Props) => HTMLElement = props => <sc-legend {...props} />;
  @Prop() annotations: Annotations = {};
  @Prop() trends: Trend[] = [];
  @Prop() supportString: boolean;
  @Prop() axis?: Axis.Options;
  @Prop() renderTooltip: (props: Tooltip.Props) => HTMLElement;
  @Prop() visualizesAlarms: boolean;
  @Prop() displaysError: boolean = true;
  @Prop() alarms?: AlarmsConfig;
  @Prop() shouldRerenderOnViewportChange?: ({ oldViewport, newViewport }) => boolean;

  /** if false, base chart will not display an empty state message when there is no data present. */
  @Prop() displaysNoDataPresentMsg?: boolean;

  /** Optionally provided callback to initiate a request for data. Used to ensure gestures emit events for request data. */
  @Prop() requestData?: RequestDataFn;

  /** Optionally hooks to integrate custom logic into the base chart */
  @Prop() onUpdateLifeCycle?: (viewport: ViewPortConfig) => void;

  @Prop() messageOverrides?: MessageOverrides;

  @Prop() yRangeStartFromZero: boolean = false;

  // Utilized to trigger a re-render once the data container is present to allow the
  // tooltip component to be properly rendered.
  @State() isMounted: boolean = false;

  /**
   * Active View Port Config
   */
  @State() yMin: number = this.viewport.yMin || 0;
  @State() yMax: number = this.viewport.yMax || 100;
  // NOTE: If a start and end date are not provided, that means we are in 'live' mode
  @State() start: Date = isMinimalStaticViewport(this.viewport)
    ? new Date(this.viewport.start)
    : new Date(Date.now() - parseDuration(this.viewport.duration));
  @State() end: Date = isMinimalStaticViewport(this.viewport) ? new Date(this.viewport.end) : new Date();

  @State() trendResults: TrendResult[] = [];

  private scene: ChartScene | null;
  private dataContainer: HTMLDivElement;
  private thresholdContainer: SVGElement;
  private trendContainer: SVGElement;
  private axisContainer: SVGElement;
  private axisRenderer = renderAxis();
  private draggable = attachDraggable();
  private isDragging = false;
  private internalAnnotations: Annotations;

  componentDidLoad() {
    this.setupChartScene();
    this.isMounted = true;
  }

  componentWillLoad() {
    if (!this.isDragging) {
      this.setInternalAnnotations();
    }
  }

  setInternalAnnotations() {
    // Internal annotations are mutated, so we clone it to prevent altering the inputs.
    this.internalAnnotations = clone(this.annotations);
  }

  startStopDragging = (dragState: boolean): void => {
    this.isDragging = dragState;
  };

  inDragState = (): boolean => {
    return this.isDragging;
  };

  getAxisContainer = (): SVGElement => {
    if (!this.axisContainer) {
      // Grab the svg within `<sc-webgl-axis />` component
      this.axisContainer = this.el.querySelector('svg.axis') as SVGElement;
    }

    return this.axisContainer;
  };

  /**
   * Emit the current widget configuration
   */
  emitUpdatedWidgetConfiguration = (dataStreams?: DataStream[]): void => {
    const configUpdate: WidgetConfigurationUpdate = {
      movement: undefined,
      scale: undefined,
      layout: undefined,
      legend: this.legend,
      annotations: this.internalAnnotations,
      axis: this.axis,
      widgetId: this.configId,
      dataStreams: dataStreams ? getDataStreamForEventing(dataStreams) : this.dataStreams,
    };
    this.widgetUpdated.emit(configUpdate);
  };

  /**
   * On Widget Updated - Persist `DataStreamInfo`
   *
   * Emits an event which persists the current `NameValue[]` state into the
   * data stream.
   */
  updateDataStreamName = ({ streamId, name }: { streamId: string; name: string }) => {
    const updatedDataStreams = this.dataStreams.map(dataStream => {
      return {
        ...dataStream,
        name: dataStream.id === streamId ? name : dataStream.name,
      };
    });
    this.emitUpdatedWidgetConfiguration(updatedDataStreams);
  };

  onDateRangeChange = throttle(
    ([start, end, from]: [Date, Date, string | undefined]) => {
      this.dateRangeChange.emit([start, end, from]);

      /**
       * Ensure that data is present for the requested range.
       */
      if (this.requestData) {
        setTimeout(() => {
          if (this.requestData) {
            // NOTE: This is fired in a separate tick to prevent it from being render blocking.
            this.requestData({ start, end });
          }
        }, 0);
      }
    },
    DATE_RANGE_EMIT_EVENT_MS,
    {
      leading: true,
      trailing: true,
    }
  );

  /**
   * Visualized Data Streams
   *
   * Returns the data streams we want to directly visualize
   * Depending on if visualizeAlarms is false, this will filter out alarm data.
   */
  visualizedDataStreams(): DataStream[] {
    if (this.visualizesAlarms) {
      return this.dataStreams;
    }

    return this.dataStreams.filter(({ streamType }) => streamType !== StreamType.ALARM);
  }

  @Watch('viewport')
  onViewPortChange(newViewPort: ViewPortConfig, oldViewPort: ViewPortConfig) {
    if (this.scene && !isEqual(newViewPort, oldViewPort)) {
      const hasYRangeChanged = newViewPort.yMin !== oldViewPort.yMin || newViewPort.yMax !== oldViewPort.yMax;

      if (hasYRangeChanged) {
        /** Update active viewport. */
        this.yMin = newViewPort.yMin;
        this.yMax = newViewPort.yMax;

        /** Apply Changes */
        this.applyYRangeChanges();
      }

      // All charts are correctly synced.
      const manuallyAppliedViewPortChange = newViewPort.lastUpdatedBy == null;
      if (manuallyAppliedViewPortChange) {
        /** Update active viewport */
        this.start = isMinimalStaticViewport(newViewPort)
          ? new Date(newViewPort.start)
          : new Date(Date.now() - parseDuration(newViewPort.duration));
        this.end = isMinimalStaticViewport(newViewPort) ? new Date(newViewPort.end) : new Date();

        /**
         * Updates viewport to the active viewport
         */
        this.scene.updateViewPort(this.activeViewPort());

        /** Re-render scene */
        // This is a necessary call to ensure that the view port group is correctly set.
        // If `updateViewPorts` is **not** called, `updateAndRegisterChartScene` in an edge case may
        // re-create the chart resources, and set the new viewport equal to the view port groups stale viewport.
        webGLRenderer.updateViewPorts({
          start: this.start,
          end: this.end,
          manager: this.scene,
          duration: this.activeViewPort().duration,
          preventPropagation: true,
        });
        this.updateAndRegisterChartScene({
          hasDataChanged: false,
          hasSizeChanged: false,
          hasAnnotationChanged: false,
          shouldRerender: false,
        });
      }
      if (
        this.shouldRerenderOnViewportChange &&
        this.shouldRerenderOnViewportChange({ oldViewport: oldViewPort, newViewport: newViewPort })
      ) {
        this.onUpdate({ start: this.start, end: this.end }, false, false, false, true);
      }
    }

    const { duration } = this.activeViewPort();
    if (this.scene != null && duration != null) {
      webGLRenderer.startTick({ manager: this.scene, duration, chartSize: this.chartSizeConfig() });
    }
  }

  @Watch('size')
  @Watch('legend')
  onSizeChange(newProp: SizeConfig | LegendConfig, oldProp: SizeConfig | LegendConfig) {
    // NOTE: Change of legend can effect sizing
    if (!isEqual(newProp, oldProp)) {
      this.onUpdate(this.activeViewPort(), false, true);
    }
    // Since internal clocks are depended on width, when we detect a width change, we want to re-start the timer.
    if (newProp.width != null && newProp.width !== oldProp.width) {
      const { duration } = this.activeViewPort();
      if (this.scene != null && duration != null) {
        webGLRenderer.stopTick({ manager: this.scene });
        webGLRenderer.startTick({ manager: this.scene, duration, chartSize: this.chartSizeConfig() });
      }
    }
  }

  @Watch('dataStreams')
  onDataStreamsChange() {
    // Avoiding a deep equality check due to the cost on a potentially large object.
    this.onUpdate(this.activeViewPort(), true);
  }

  @Watch('annotations')
  onAnnotationsChange(newProp: Annotations, oldProp: Annotations) {
    if (!isEqual(newProp, oldProp) && !this.isDragging) {
      this.setInternalAnnotations();
      this.onUpdate(this.activeViewPort(), false, false, true);
    }
  }

  @Watch('trends')
  onTrendsChange(newProp: Trend[], oldProp: Trend[]) {
    if (!isEqual(newProp, oldProp)) {
      this.onUpdate(this.activeViewPort(), false);
    }
  }

  @Watch('axis')
  onAxisChange(newProp: Axis.Options, oldProp: Axis.Options) {
    const viewport = this.activeViewPort();
    const size = this.chartSizeConfig();

    if (!isEqual(newProp, oldProp)) {
      this.axisRenderer({
        container: this.getAxisContainer(),
        viewport,
        size,
        axis: this.axis,
      });
    }
  }

  chartSizeConfig = (): SizeConfig => {
    const size = this.chartSize();
    const { marginTop, marginBottom, marginLeft, marginRight, height, width } = size;
    const chartHeight = height - marginBottom - marginTop;

    const isRightLegend = this.legend && this.legend.position === LEGEND_POSITION.RIGHT;
    const isBottomLegend = this.legend && this.legend.position === LEGEND_POSITION.BOTTOM;

    return {
      ...size,
      width: Math.max(
        width - marginLeft - marginRight - (isRightLegend ? (this.legend as LegendConfig).width : 0),
        MIN_WIDTH
      ),
      height: chartHeight - (isBottomLegend ? LEGEND_HEIGHT : 0),
    };
  };

  // NOTE: While `componentDidUnload` is deprecated, `disconnectedCallback` causes critical issues
  //       causing orphaned updates to occur, where no `scene` is present.
  componentDidUnload() {
    if (this.scene) {
      // necessary to make sure that the allocated memory is released, and nothing is incorrectly rendered.
      webGLRenderer.removeChartScene(this.scene.id);
    }
    this.scene = null;
  }

  /**
   * Get Active View Port
   *
   * Returns a view port with the current y range applied.
   * This can differ from the view port passed in, as
   * translations to the y range are only applied locally
   * as opposed to being applied via config changes from above.
   */
  activeViewPort = (): ViewPort => ({
    start: this.start,
    end: this.end,
    yMin: this.yMin,
    yMax: this.yMax,
    group: this.viewport.group,
    duration: !isMinimalStaticViewport(this.viewport) ? parseDuration(this.viewport.duration) : undefined,
  });

  handleCameraEvent = ({ start, end }: { start: Date; end: Date }) => {
    if (this.scene) {
      const oldViewport: ViewPort = { yMin: this.yMin, yMax: this.yMax, start, end };
      if (
        this.shouldRerenderOnViewportChange &&
        this.shouldRerenderOnViewportChange({ oldViewport, newViewport: this.activeViewPort() })
      ) {
        this.onUpdate({ start, end }, false, false, false, true);
      }
      // Update Camera
      webGLRenderer.updateViewPorts({ start, end, manager: this.scene });

      // Emit date range change to allow other non-webgl based components to sync the new date range
      this.onDateRangeChange([start, end, this.viewport.group]);
    }
  };

  /**
   * Updates the active view port y range.
   */
  updateYRange = () => {
    // Filter down the data streams to only contain data within the viewport
    const inViewPoints: DataPoint<number>[] = this.dataStreams
      .filter(isNumberDataStream)
      .map(stream =>
        getVisibleData(getDataPoints(stream, stream.resolution), { start: this.start, end: this.end }, false)
      )
      .flat();

    const yAnnotations =
      (this.internalAnnotations && Array.isArray(this.internalAnnotations.y) && this.internalAnnotations.y) || [];

    const { yMin, yMax } = getYRange({
      points: inViewPoints,
      yAnnotations: yAnnotations.filter(annotation => isNumeric(annotation.value)),
      startFromZero: this.yRangeStartFromZero,
    });

    const prevYMin = this.yMin;
    const prevYMax = this.yMax;

    /** Update active viewport. */
    this.yMin = this.viewport.yMin != null ? this.viewport.yMin : yMin;
    this.yMax = this.viewport.yMax != null ? this.viewport.yMax : yMax;

    const oldViewport: ViewPort = { yMin: prevYMin, yMax: prevYMax, start: this.start, end: this.end };
    if (
      this.shouldRerenderOnViewportChange &&
      this.shouldRerenderOnViewportChange({ oldViewport, newViewport: this.activeViewPort() })
    ) {
      this.onUpdate(this.activeViewPort(), false, false, false, true);
    }

    this.applyYRangeChanges();
  };

  /**
   * Apply Y Range Changes
   *
   * Updates the scene camera to point to the correct location
   */
  applyYRangeChanges = () => {
    if (this.scene) {
      /** Update threejs camera to have the updated viewport */
      this.scene.camera.top = this.yMax;
      this.scene.camera.bottom = this.yMin;
      // NOTE: This is required to make the changes to the camera take effect.
      // This updates the matricies which represent the cameras transformation.
      // This is done by setting a uniform for the shaders which are referenced to the
      // vertex shaders to translate and skew the coordinate space.
      this.scene.camera.updateProjectionMatrix();
    }
  };

  /**
   * Container Helpers
   *
   * Help provide an efficient way to have the correct mount point on the DOM.
   * We want to prevent the DOM from being re-queried for performance concerns.
   */

  getDataContainer = (): HTMLElement => {
    if (this.dataContainer == null) {
      this.dataContainer = this.el.querySelector('.data-container') as HTMLDivElement;
    }
    return this.dataContainer;
  };

  getThresholdContainer = (): SVGElement => {
    if (this.thresholdContainer == null) {
      this.thresholdContainer = this.el.querySelector('.threshold-container') as SVGElement;
    }
    return this.thresholdContainer;
  };

  getTrendContainer = (): SVGElement => {
    if (this.trendContainer == null) {
      this.trendContainer = this.el.querySelector('.trend-container') as SVGElement;
    }
    return this.trendContainer;
  };

  thresholds = (): Threshold[] =>
    this.internalAnnotations && this.internalAnnotations.y ? this.internalAnnotations.y.filter(isThreshold) : [];

  getThresholdOptions = (): ThresholdOptions => {
    // If user did not pass in any threshold options, we just use default
    if (this.internalAnnotations == null || this.internalAnnotations.thresholdOptions == null) {
      return DEFAULT_THRESHOLD_OPTIONS;
    }

    const { thresholdOptions } = this.internalAnnotations;
    // if threshold option is a type of bool, it means that we either turn on all defaults or
    // disable all defaults.
    if (typeof thresholdOptions === 'boolean') {
      return thresholdOptions ? DEFAULT_THRESHOLD_OPTIONS : DEFAULT_THRESHOLD_OPTIONS_OFF;
    }

    // If its a threshold object, then we just use the user's setting and override it with the default settings
    // that we have
    return {
      ...DEFAULT_THRESHOLD_OPTIONS,
      ...thresholdOptions,
    };
  };

  setupChartScene() {
    this.scene = this.createChartScene({
      viewport: this.activeViewPort(),
      chartSize: this.chartSizeConfig(),
      dataStreams: this.visualizedDataStreams(),
      alarms: this.alarms,
      container: this.getDataContainer(),
      minBufferSize: this.minBufferSize,
      bufferFactor: this.bufferFactor,
      onUpdate: this.onUpdate,
      thresholdOptions: this.getThresholdOptions(),
      thresholds: this.thresholds(),
    });

    const { duration } = this.activeViewPort();
    webGLRenderer.addChartScene({ manager: this.scene, duration, chartSize: this.chartSizeConfig() });
    this.setChartRenderingPosition();
    webGLRenderer.render(this.scene);
    this.onUpdate(this.activeViewPort());
  }

  /**
   * Lifecycle method
   *
   * Called every time the component mounts, or has it's data, viewport, or size changed.
   *
   * Provide no `hasDataChanged` to prevent a re-processing of the chart scenes.
   */
  onUpdate = (
    { start, end }: { start: Date; end: Date },
    hasDataChanged: boolean = false,
    hasSizeChanged: boolean = false,
    hasAnnotationChanged: boolean = false,
    shouldRerender: boolean = false
  ) => {
    /**
     * Failure Handling
     */

    if (!this.scene) {
      // This should never occur - if it does, it's not recoverable so we just bail.
      throw new Error('[SynchroCharts] Scene is not present but update is being called.');
    }
    if (!this.el.isConnected) {
      // Disconnected failure case:
      // This can occur in very 'stressed' performance situations where updates get called
      // and then a chart is disconnected. We can recover from this by removing itself
      // from the view port manager and bailing on the update.
      /* eslint-disable-next-line no-console */
      console.error(
        `[SynchroCharts] chart with associated scene id of ${this.scene.id} is disconnected,
         but still being called via the view port manager. removing from the view port manager.`
      );
      // necessary to make sure that the allocated memory is released, and nothing is incorrectly rendered.
      webGLRenderer.removeChartScene(this.scene.id);
      this.scene = null;
      return;
    }

    /**
     * Update Procedure
     */

    // Update Active Viewport
    this.start = start;
    this.end = end;

    if (!this.supportString && !shouldRerender) {
      this.updateYRange();
    }

    // Render chart scene
    this.updateAndRegisterChartScene({
      hasDataChanged,
      hasSizeChanged,
      hasAnnotationChanged,
      shouldRerender,
    });

    // settings to utilize in all feature updates.
    const viewport = this.activeViewPort();
    const size = this.chartSizeConfig();

    if (this.onUpdateLifeCycle) {
      // Call all passed in updates - custom features
      this.onUpdateLifeCycle(this.activeViewPort());
    }

    /**
     *
     * Features
     *
     * Place custom features which are built into the chart at the base level here.
     * Non-base chart features should instead be delegated via the `onUpdateLifeCycle` hook.
     */

    /**
     * Annotations Feature
     *
     * Currently only supports rendering annotations for number data streams
     */
    if (!this.supportString) {
      const numberAnnotations = getNumberAnnotations(this.internalAnnotations);

      renderAnnotations({
        container: this.getThresholdContainer(),
        annotations: numberAnnotations,
        viewport,
        size,
        // TODO: Revisit this.
        // If no data streams are present we will fallback to a resolution of 0, i.e. 'raw' data
        resolution: this.dataStreams[0] ? this.dataStreams[0].resolution : 0,
        onUpdate: this.onUpdate,
        activeViewPort: this.activeViewPort,
        emitUpdatedWidgetConfiguration: this.emitUpdatedWidgetConfiguration,
        draggable: this.draggable,
        startStopDragging: this.startStopDragging,
        inDragState: this.inDragState,
      });
    }

    /**
     * Trend Lines Feature
     *
     * Currently only supports rendering trends for number data streams
     */
    if (!this.supportString) {
      const dataStreamsWithTrends = this.visualizedDataStreams().filter(isNumberDataStream);
      this.trendResults = getAllTrendResults(viewport, dataStreamsWithTrends, this.trends);
      renderTrendLines({
        container: this.getTrendContainer(),
        viewport,
        size,
        dataStreams: this.visualizedDataStreams(),
        trendResults: this.trendResults,
      });
    }

    /**
     * Axis Feature
     */
    this.axisRenderer({
      container: this.getAxisContainer(),
      viewport,
      size,
      axis: this.axis,
    });
  };

  /**
   * Update and register chart scene
   *
   * handles the updating of the chart scene, and handles registering the new
   * chart scene if a new chart scene is returned.
   *
   * A new chart scene will be returned if the new data passed in has
   * more data points that the previous chart scene had room allocated for.
   */
  updateAndRegisterChartScene({
    hasDataChanged,
    hasSizeChanged,
    hasAnnotationChanged,
    shouldRerender,
  }: {
    hasDataChanged: boolean;
    hasSizeChanged: boolean;
    hasAnnotationChanged: boolean;
    shouldRerender: boolean;
  }) {
    if (this.scene) {
      if (hasSizeChanged) {
        this.setChartRenderingPosition();
      }
      const container = this.getDataContainer();
      const updatedScene = this.updateChartScene({
        scene: this.scene,
        chartSize: this.chartSizeConfig(),
        dataStreams: this.visualizedDataStreams(),
        alarms: this.alarms,
        container,
        viewport: this.activeViewPort(),
        minBufferSize: this.minBufferSize,
        bufferFactor: this.bufferFactor,
        onUpdate: this.onUpdate,
        thresholdOptions: this.getThresholdOptions(),
        thresholds: this.thresholds(),
        hasSizeChanged,
        hasDataChanged,
        shouldRerender,
        hasAnnotationChanged,
      });

      // update chart scene will return a new scene if it needed to delete the old one to make
      // the changes necessary and reconstruct a entirely new scene in it's place.
      // in this scenario we need to remove it's old scene from the global chart registry within webGL Renderer.
      const isNewChartScene = updatedScene.id !== this.scene.id;
      if (isNewChartScene) {
        // Must unregister the previous chart scene and register the new one with webgl
        webGLRenderer.removeChartScene(this.scene.id);
        this.scene = updatedScene;
        const { duration } = this.activeViewPort();
        webGLRenderer.addChartScene({ manager: updatedScene, duration, shouldSync: false });
        this.setChartRenderingPosition();
      }

      /** Render to canvas */
      webGLRenderer.render(this.scene);

      if (hasSizeChanged) {
        // if the size has changed, then we need to wait till the next 'frame'
        // until the DOM has updated to it's new position.
        window.setTimeout(() => {
          if (this.scene) {
            webGLRenderer.render(this.scene);
          }
        }, 0);
      }
    }
  }

  /**
   * Set Chart Rendering Position
   *
   * Registers the chart rectangle, which tells webGL where to render the data-vizualization to.
   * This must be called each time after a scene is set.
   *
   */
  setChartRenderingPosition = (): void => {
    if (this.scene) {
      const chartSize = this.chartSizeConfig();
      webGLRenderer.setChartRect(this.scene.id, {
        width: chartSize.width,
        height: chartSize.height,
        x: this.size.x + chartSize.marginLeft,
        y: this.size.y + chartSize.marginTop,
        left: this.size.left + chartSize.marginLeft,
        top: this.size.top + chartSize.marginTop,
        right: this.size.left + chartSize.marginLeft + chartSize.width,
        bottom: this.size.top + chartSize.marginTop + chartSize.height,
        density: window.devicePixelRatio,
      });
    }
  };

  chartSize = (): SizeConfig => {
    const marginLeft = this.size.marginLeft == null ? DEFAULT_CHART_CONFIG.size.marginLeft : this.size.marginLeft;
    const marginRight = this.size.marginRight == null ? DEFAULT_CHART_CONFIG.size.marginRight : this.size.marginRight;
    const marginTop = this.size.marginTop == null ? DEFAULT_CHART_CONFIG.size.marginTop : this.size.marginTop;
    const marginBottom =
      this.size.marginBottom == null ? DEFAULT_CHART_CONFIG.size.marginBottom : this.size.marginBottom;

    const minWidth = marginLeft + marginRight + MIN_WIDTH;
    const minHeight = marginTop + marginBottom + MIN_HEIGHT;

    return {
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      width: Math.max(this.size.width, minWidth),
      height: Math.max(this.size.height, minHeight),
    };
  };

  renderTooltipComponent = (marginLeft: number, marginTop: number, thresholds: Threshold[]) =>
    this.renderTooltip({
      size: this.chartSizeConfig(),
      style: { marginLeft: `${marginLeft}px`, marginTop: `${marginTop}px` },
      dataStreams: this.dataStreams,
      viewport: this.activeViewPort(),
      dataContainer: this.getDataContainer(),
      thresholds,
      trendResults: this.trendResults,
      visualizesAlarms: this.visualizesAlarms,
    });

  renderLegendComponent = ({
    isLoading,
    thresholds,
    showDataStreamColor,
  }: {
    isLoading: boolean;
    thresholds: Threshold[];
    showDataStreamColor: boolean;
  }) =>
    this.renderLegend({
      config: this.legend,
      dataStreams: this.dataStreams,
      visualizesAlarms: this.visualizesAlarms,
      updateDataStreamName: this.updateDataStreamName,
      viewport: this.activeViewPort(),
      isEditing: this.isEditing,
      isLoading,
      thresholds,
      supportString: this.supportString,
      trendResults: this.trendResults,
      showDataStreamColor,
    });

  render() {
    const chartSizeConfig = this.chartSizeConfig();
    const { marginLeft, marginTop, marginRight, marginBottom } = chartSizeConfig;

    const hasError = this.dataStreams.some(({ error }) => error != null);

    const shouldDisplayAsLoading = !hasError && this.visualizedDataStreams().some(({ isLoading }) => isLoading);
    const hasNoDataStreamsPresent = this.visualizedDataStreams().length === 0;

    const hasNoDataPresent = this.visualizedDataStreams().every(stream => {
      const points = getDataPoints(stream, stream.resolution);
      if (points.length === 0) {
        return true;
      }
      // Check the latest datapoint to see if its before the start of viewport
      const isDataOutOfRange = points[points.length - 1].x < this.start.getTime();
      return isDataOutOfRange;
    });

    const thresholds = this.thresholds();

    const showDataStreamColor =
      this.legend != null && this.legend.showDataStreamColor != null
        ? this.legend.showDataStreamColor
        : DEFAULT_SHOW_DATA_STREAM_COLOR;

    return [
      <div class="awsui sc-webgl-base-chart">
        {this.displaysError && <ErrorStatus hasError={hasError} size={chartSizeConfig} />}
        <sc-webgl-axis size={chartSizeConfig} />
        <DataContainer size={chartSizeConfig}>
          <EmptyStatus
            displaysNoDataPresentMsg={this.displaysNoDataPresentMsg != null ? this.displaysNoDataPresentMsg : true}
            messageOverrides={this.messageOverrides || {}}
            isLoading={shouldDisplayAsLoading}
            hasNoDataPresent={hasNoDataPresent}
            hasNoDataStreamsPresent={hasNoDataStreamsPresent}
          />
          <LoadingStatus isLoading={shouldDisplayAsLoading} />
          {this.gestures && (
            <sc-gesture-handler
              onDateRangeChange={this.handleCameraEvent}
              size={chartSizeConfig}
              viewport={this.activeViewPort()}
            />
          )}
        </DataContainer>
        {this.legend && (
          <ChartLegendContainer config={this.legend} legendHeight={LEGEND_HEIGHT} size={chartSizeConfig}>
            {this.renderLegendComponent({ isLoading: shouldDisplayAsLoading, thresholds, showDataStreamColor })}
          </ChartLegendContainer>
        )}
      </div>,
      this.isMounted && this.renderTooltipComponent(marginLeft, marginTop, thresholds),
      <svg
        class="threshold-container"
        width={chartSizeConfig.width + marginRight}
        height={chartSizeConfig.height + marginBottom}
        style={{ marginLeft: `${marginLeft}px`, marginTop: `${marginTop}px` }}
      />,
      <svg
        class="trend-container"
        width={chartSizeConfig.width}
        height={chartSizeConfig.height}
        style={{ marginLeft: `${marginLeft}px`, marginTop: `${marginTop}px` }}
      />,
    ];
  }
}
