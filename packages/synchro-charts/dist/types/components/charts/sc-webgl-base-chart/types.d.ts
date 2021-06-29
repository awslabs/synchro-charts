import { AlarmsConfig, DataStream, ViewPort } from '../../../utils/dataTypes';
import { ChartScene } from '../../sc-webgl-context/types';
import { Threshold, ThresholdOptions } from '../common/types';
/**
 * Chart Scene Creator
 *
 * Creates a chart scene, which is the scene that threejs utilizes to render
 * the data visualization for a given webgl-based chart.
 */
export declare type ChartSceneCreator = (options: {
    dataStreams: DataStream[];
    alarms?: AlarmsConfig;
    container: HTMLElement;
    chartSize: {
        width: number;
        height: number;
    };
    viewPort: ViewPort;
    minBufferSize: number;
    bufferFactor: number;
    thresholdOptions: ThresholdOptions;
    thresholds: Threshold[];
    onUpdate?: ({ start, end }: {
        start: Date;
        end: Date;
    }) => void;
}) => ChartScene;
/**
 * Chart Scene Updater
 *
 * Updates the buffers, materials, and camera in the chart scene.
 */
export declare type ChartSceneUpdater = (options: {
    scene: ChartScene;
    dataStreams: DataStream[];
    alarms?: AlarmsConfig;
    container: HTMLElement;
    viewPort: ViewPort;
    chartSize: {
        width: number;
        height: number;
    };
    bufferFactor: number;
    minBufferSize: number;
    thresholdOptions: ThresholdOptions;
    thresholds: Threshold[];
    hasDataChanged: boolean;
    hasAnnotationChanged: boolean;
    hasSizeChanged: boolean;
    onUpdate?: ({ start, end }: {
        start: Date;
        end: Date;
    }) => void;
}) => ChartScene;
