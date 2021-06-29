/// <reference types="lodash" />
import { EventEmitter } from '../../../stencil-public-runtime';
import { AlarmsConfig, DataStream, MinimalViewPortConfig, SizeConfig, SizePositionConfig, ViewPort, ViewPortConfig, RequestDataFn, MessageOverrides } from '../../../utils/dataTypes';
import { Annotations, Axis, LegendConfig, WidgetConfigurationUpdate, Threshold, ThresholdOptions, Tooltip } from '../common/types';
import { ChartSceneCreator, ChartSceneUpdater } from './types';
import { Trend, TrendResult } from '../common/trends/types';
export declare class ScWebglBaseChart {
    el: HTMLElement;
    widgetUpdated: EventEmitter<WidgetConfigurationUpdate>;
    /**
     * On view port date range change, this component emits a `dateRangeChange` event.
     * This allows other data visualization components to sync to the same date range.
     */
    dateRangeChange: EventEmitter<[Date, Date, string | undefined]>;
    dataStreams: DataStream[];
    updateChartScene: ChartSceneUpdater;
    createChartScene: ChartSceneCreator;
    viewPort: MinimalViewPortConfig;
    gestures: boolean;
    size: SizePositionConfig;
    isEditing: boolean;
    configId: string;
    bufferFactor: number;
    minBufferSize: number;
    legend: LegendConfig;
    annotations: Annotations;
    trends: Trend[];
    supportString: boolean;
    axis?: Axis.Options;
    tooltip: (props: Tooltip.Props) => HTMLElement;
    visualizesAlarms: boolean;
    displaysError: boolean;
    alarms?: AlarmsConfig;
    /** if false, base chart will not display an empty state message when there is no data present. */
    displaysNoDataPresentMsg?: boolean;
    /** Optionally provided callback to initiate a request for data. Used to ensure gestures emit events for request data. */
    requestData?: RequestDataFn;
    /** Optionally hooks to integrate custom logic into the base chart */
    onUpdateLifeCycle?: (viewPort: ViewPortConfig) => void;
    messageOverrides?: MessageOverrides;
    yRangeStartFromZero: boolean;
    isMounted: boolean;
    /**
     * Active View Port Config
     */
    yMin: number;
    yMax: number;
    start: Date;
    end: Date;
    trendResults: TrendResult[];
    private scene;
    private dataContainer;
    private thresholdContainer;
    private trendContainer;
    private axisContainer;
    private axisRenderer;
    componentDidLoad(): void;
    getAxisContainer: () => SVGElement;
    /**
     * On Widget Updated - Persist `DataStreamInfo`
     *
     * Emits an event which persists the current `NameValue[]` state into the
     * data stream.
     */
    updateDataStreamName: ({ streamId, name }: {
        streamId: string;
        name: string;
    }) => void;
    onDateRangeChange: import("lodash").DebouncedFunc<([start, end, from]: [Date, Date, string | undefined]) => void>;
    /**
     * Visualized Data Streams
     *
     * Returns the data streams we want to directly visualize
     * Depending on if visualizeAlarms is false, this will filter out alarm data.
     */
    visualizedDataStreams(): DataStream[];
    onViewPortChange(newViewPort: ViewPortConfig, oldViewPort: ViewPortConfig): void;
    onSizeChange(newProp: SizeConfig | LegendConfig, oldProp: SizeConfig | LegendConfig): void;
    onDataStreamsChange(): void;
    onAnnotationsChange(newProp: Annotations, oldProp: Annotations): void;
    onTrendsChange(newProp: Trend[], oldProp: Trend[]): void;
    onAxisChange(newProp: Axis.Options, oldProp: Axis.Options): void;
    chartSizeConfig: () => SizeConfig;
    componentDidUnload(): void;
    /**
     * Get Active View Port
     *
     * Returns a view port with the current y range applied.
     * This can differ from the view port passed in, as
     * translations to the y range are only applied locally
     * as opposed to being applied via config changes from above.
     */
    activeViewPort: () => ViewPort;
    handleCameraEvent: ({ start, end }: {
        start: Date;
        end: Date;
    }) => void;
    /**
     * Updates the active view port y range.
     */
    updateYRange: () => void;
    /**
     * Apply Y Range Changes
     *
     * Updates the scene camera to point to the correct location
     */
    applyYRangeChanges: () => void;
    /**
     * Container Helpers
     *
     * Help provide an efficient way to have the correct mount point on the DOM.
     * We want to prevent the DOM from being re-queried for performance concerns.
     */
    getDataContainer: () => HTMLElement;
    getThresholdContainer: () => SVGElement;
    getTrendContainer: () => SVGElement;
    thresholds: () => Threshold[];
    getThresholdOptions: () => ThresholdOptions;
    setupChartScene(): void;
    /**
     * Lifecycle method
     *
     * Called every time the component mounts, or has it's data, viewport, or size changed.
     *
     * Provide no `hasDataChanged` to prevent a re-processing of the chart scenes.
     */
    onUpdate: ({ start, end }: {
        start: Date;
        end: Date;
    }, hasDataChanged?: boolean, hasSizeChanged?: boolean, hasAnnotationChanged?: boolean) => void;
    /**
     * Update and register chart scene
     *
     * handles the updating of the chart scene, and handles registering the new
     * chart scene if a new chart scene is returned.
     *
     * A new chart scene will be returned if the new data passed in has
     * more data points that the previous chart scene had room allocated for.
     */
    updateAndRegisterChartScene({ hasDataChanged, hasSizeChanged, hasAnnotationChanged, }: {
        hasDataChanged: boolean;
        hasSizeChanged: boolean;
        hasAnnotationChanged: boolean;
    }): void;
    /**
     * Set Chart Rendering Position
     *
     * Registers the chart rectangle, which tells webGL where to render the data-vizualization to.
     * This must be called each time after a scene is set.
     *
     */
    setChartRenderingPosition: () => void;
    chartSize: () => SizeConfig;
    renderTooltip: (marginLeft: number, marginTop: number, thresholds: Threshold[]) => HTMLElement;
    render(): any[];
}
