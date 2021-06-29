import { BufferGeometry, InstancedMesh, Material } from 'three';
import { WriteableBufferAttribute, WriteableInstancedBufferAttribute } from '../../sc-webgl-context/types';
import { DataStream, ViewPort } from '../../../utils/dataTypes';
import { Threshold, ThresholdOptions } from '../common/types';
declare type LineBufferGeometry = BufferGeometry & {
    attributes: {
        position: WriteableBufferAttribute;
        currPoint: WriteableInstancedBufferAttribute;
        nextPoint: WriteableInstancedBufferAttribute;
        segmentColor: WriteableInstancedBufferAttribute;
    };
};
declare type LineChartLineMaterial = Material & {
    uniforms: {
        width: {
            value: number;
        };
        xPixelDensity: {
            value: number;
        };
        yPixelDensity: {
            value: number;
        };
    };
};
export declare type LineChartLineMesh = InstancedMesh & {
    geometry: LineBufferGeometry;
    material: LineChartLineMaterial;
};
export declare const LINE_MESH_INDEX = 1;
export declare const lineMesh: ({ viewPort, dataStreams, chartSize, minBufferSize, bufferFactor, toClipSpace, thresholdOptions, thresholds, }: {
    chartSize: {
        width: number;
        height: number;
    };
    dataStreams: DataStream[];
    viewPort: ViewPort;
    minBufferSize: number;
    bufferFactor: number;
    toClipSpace: (time: number) => number;
    thresholdOptions: ThresholdOptions;
    thresholds: Threshold[];
}) => LineChartLineMesh;
export declare const updateLineMesh: ({ chartSize, toClipSpace, lines, dataStreams, viewPort, hasDataChanged, }: {
    chartSize: {
        width: number;
        height: number;
    };
    toClipSpace: (time: number) => number;
    lines: LineChartLineMesh;
    dataStreams: DataStream[];
    viewPort: ViewPort;
    hasDataChanged: boolean;
}) => void;
export {};
