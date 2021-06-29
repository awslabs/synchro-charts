import { ScaleContinuousNumeric, ScaleTime } from 'd3-scale';
import { Selection } from 'd3-selection';
import { BaseConfig, DataPoint, DataStream, DataStreamId, MessageOverrides, MinimalViewPortConfig, SizeConfig, ViewPort, ViewPortConfig } from '../../../utils/dataTypes';
import { COMPARISON_OPERATOR, LEGEND_POSITION, ScaleType, StatusIcon } from './constants';
import { StencilCSSProperty } from '../../../utils/types';
import { TrendResult } from './trends/types';
export declare type Scale = ScaleContinuousNumeric<number, number> | ScaleTime<any, any>;
export declare type SVGSelection = Selection<SVGGElement, unknown, null, undefined>;
export declare type AnySelection = Selection<any, any, any, any>;
export interface ScaleConfig {
    xScaleType: ScaleType;
    yScaleType: ScaleType;
    xScaleSide: 'top' | 'bottom';
    yScaleSide: 'left' | 'right';
}
export interface LayoutConfig {
    xTicksVisible: boolean;
    yTicksVisible: boolean;
    xGridVisible: boolean;
    yGridVisible: boolean;
}
export interface LegendConfig {
    position: LEGEND_POSITION;
    width: number;
    showDataStreamColor?: boolean;
}
/**
 * Chart Config needed to be passed in by external users of the chart components
 *
 * Missing fields will be substituted with defaults
 */
export interface ChartConfig extends BaseConfig {
    viewPort: MinimalViewPortConfig;
    movement?: MovementConfig;
    scale?: ScaleConfig;
    layout?: LayoutConfig;
    legend?: LegendConfig;
    annotations?: Annotations;
    axis?: Axis.Options;
    messageOverrides?: MessageOverrides;
}
export declare type WidgetConfigurationUpdate = Partial<ChartConfig> & {
    dataStreams?: (Partial<DataStream> & {
        id: DataStreamId;
    })[];
    widgetId: string;
};
/**
 * Internal Chart Config Used within the chart components
 */
export interface BaseChartConfig extends ChartConfig {
    dataStreams: DataStream[];
    viewPort: ViewPortConfig;
    movement: MovementConfig;
    layout: LayoutConfig;
    scale: ScaleConfig;
    size: SizeConfig;
}
export interface MovementConfig {
    enableXScroll: boolean;
    enableYScroll: boolean;
    zoomMax: number;
    zoomMin: number;
}
/**
 * View model for a data point within the tooltip and legend
 */
export declare type FocusPoint = {
    id: string;
    pos: {
        x: number;
        y: number;
    };
    datum: DataPoint;
    value: number;
    color: string;
    isInterpolated: boolean;
};
declare type AnnotationLabel = {
    text: string;
    show: boolean;
};
export declare type AnnotationValue = number | string | Date;
export declare type ThresholdValue = number | string;
export interface Annotation<T extends AnnotationValue> {
    color: string;
    value: T;
    showValue?: boolean;
    label?: AnnotationLabel;
    icon?: StatusIcon;
    description?: string;
}
/**
 * Annotation becomes a threshold when a comparison operator is added.
 *
 * The comparison operator determines how the data-value is evaluated against the threshold-value
 */
export interface Threshold<T extends ThresholdValue = ThresholdValue> extends Annotation<T> {
    comparisonOperator: COMPARISON_OPERATOR;
    severity?: number;
    dataStreamIds?: DataStreamId[];
}
export declare type XAnnotation = Annotation<Date>;
export declare type YAnnotation = Annotation<number | string> | Threshold;
export interface Annotations {
    show?: boolean;
    x?: XAnnotation[];
    y?: YAnnotation[];
    thresholdOptions?: ThresholdOptions | boolean;
    colorDataAcrossThresholds?: boolean;
}
export interface ThresholdBand {
    upper: number;
    lower: number;
    color: [number, number, number];
}
export interface ThresholdOptions {
    showColor?: boolean;
}
export declare namespace Axis {
    interface Options {
        showY?: boolean;
        showX?: boolean;
        labels?: AxisLabels;
    }
    interface AxisLabels {
        yAxis?: LabelConfig;
    }
    interface LabelConfig {
        content: string;
    }
}
export declare namespace Tooltip {
    interface Props {
        size: SizeConfig;
        style: StencilCSSProperty;
        dataStreams: DataStream[];
        viewPort: ViewPort;
        dataContainer: HTMLElement;
        thresholds: Threshold[];
        trendResults: TrendResult[];
        visualizesAlarms: boolean;
    }
}
export interface ThresholdColorAndIcon {
    color: string | undefined;
    icon: StatusIcon | undefined;
}
export {};
