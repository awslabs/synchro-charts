import { Scene } from 'three';
import { ChartScene } from '../../sc-webgl-context/types';
import { DataStream, Primitive, Resolution, ViewPort } from '../../../utils/dataTypes';
export declare const getCSSColorByString: (color: string) => number[];
/**
 * Create Vertices
 *
 * Converts the `DataStream`s model to 2 dimensional vertices in a format consumable by WebGL.
 * Format is as follows,
 * `[[point_1_x, point_1_y, point_1_color_red, point_1_color_blue, point_1_color_green], ...]`
 */
export declare const vertices: <T extends Primitive>(stream: DataStream<T>, resolution: Resolution) => [number, T, number, number, number][];
/**
 * Construct Chart Scene
 *
 * Takes a threejs scene and some chart configuration, and constructs the corresponding chart scene.
 */
export declare const constructChartScene: ({ scene, container, viewPort, toClipSpace, onUpdate, }: {
    scene: Scene;
    container: HTMLElement;
    viewPort: ViewPort;
    toClipSpace: (time: number) => number;
    onUpdate?: (({ start, end }: {
        start: Date;
        end: Date;
    }) => void) | undefined;
}) => ChartScene;
/**
 * Get Number of Data Points
 *
 * Total data points across all data streams
 */
export declare const numDataPoints: <T extends Primitive>(dataStreams: DataStream<T>[]) => number;
