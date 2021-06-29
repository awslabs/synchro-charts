import { BufferGeometry, InstancedMesh, Material } from 'three';
import { WriteableBufferAttribute, WriteableInstancedBufferAttribute } from '../../sc-webgl-context/types';
import { DataStream } from '../../../utils/dataTypes';
import { Threshold, ThresholdOptions } from '../common/types';
declare type BarBufferGeometry = BufferGeometry & {
    attributes: {
        position: WriteableBufferAttribute;
        bar: WriteableInstancedBufferAttribute;
        color: WriteableInstancedBufferAttribute;
    };
};
declare type BarChartLineMaterial = Material & {
    uniforms: {
        width: {
            value: number;
        };
        devicePixelRatio: {
            value: number;
        };
    };
};
export declare type BarChartBarMesh = InstancedMesh & {
    geometry: BarBufferGeometry;
    material: BarChartLineMaterial;
};
export declare const NUM_POSITION_COMPONENTS = 2;
export declare const barMesh: ({ dataStreams, toClipSpace, bufferFactor, minBufferSize, thresholdOptions, thresholds, }: {
    dataStreams: DataStream[];
    toClipSpace: (time: number) => number;
    bufferFactor: number;
    minBufferSize: number;
    thresholdOptions: ThresholdOptions;
    thresholds: Threshold[];
}) => BarChartBarMesh;
export declare const updateBarMesh: ({ bars, dataStreams, toClipSpace, hasDataChanged, thresholdOptions, thresholds, }: {
    bars: BarChartBarMesh;
    dataStreams: DataStream[];
    toClipSpace: (time: number) => number;
    hasDataChanged: boolean;
    thresholdOptions: ThresholdOptions;
    thresholds: Threshold[];
}) => void;
export {};
