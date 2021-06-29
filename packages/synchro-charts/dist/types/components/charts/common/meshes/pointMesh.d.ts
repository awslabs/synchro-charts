import { BufferGeometry, Points, ShaderMaterial } from 'three';
import { WriteableBufferAttribute } from '../../../sc-webgl-context/types';
import { DataStream } from '../../../../utils/dataTypes';
import { Threshold, ThresholdOptions } from '../types';
export declare const POINT_MESH_INDEX = 0;
/**
 * Create Point Mesh
 *
 * The representation of the points on a chart.
 */
export declare const NUM_POSITION_COMPONENTS = 2;
export declare type PointBufferGeometry = BufferGeometry & {
    attributes: {
        position: WriteableBufferAttribute;
        pointColor: WriteableBufferAttribute;
    };
};
declare type PointMaterial = ShaderMaterial & {
    uniforms: {
        pointDiameter: {
            value: number;
        };
        devicePixelRatio: {
            value: number;
        };
    };
};
export declare type PointMesh = Points & {
    geometry: PointBufferGeometry;
    material: PointMaterial;
};
/**
 * Create Point Mesh
 */
export declare const pointMesh: ({ toClipSpace, dataStreams, minBufferSize, bufferFactor, thresholdOptions, thresholds, }: {
    toClipSpace: (time: number) => number;
    dataStreams: DataStream[];
    minBufferSize: number;
    bufferFactor: number;
    thresholdOptions: ThresholdOptions;
    thresholds: Threshold[];
}) => PointMesh;
/**
 * Update Point Mesh
 *
 * Updates the point mesh to match the given data stream info and data streams.
 * Increases size of attribute buffers if necessary.
 */
export declare const updatePointMesh: (dataStreams: DataStream[], points: PointMesh, toClipSpace: (time: number) => number, hasDataChanged?: boolean) => void;
export {};
