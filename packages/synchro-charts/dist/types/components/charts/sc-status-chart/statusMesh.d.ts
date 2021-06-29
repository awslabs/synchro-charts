import { BufferGeometry, InstancedMesh, Material } from 'three';
import { DataStream, AlarmsConfig } from '../../../utils/dataTypes';
import { WriteableBufferAttribute, WriteableInstancedBufferAttribute } from '../../sc-webgl-context/types';
import { Threshold, ThresholdOptions } from '../common/types';
declare type StatusBufferGeometry = BufferGeometry & {
    attributes: {
        position: WriteableBufferAttribute;
        status: WriteableInstancedBufferAttribute;
        color: WriteableInstancedBufferAttribute;
    };
};
declare type StatusChartLineMaterial = Material & {
    uniforms: {
        devicePixelRatio: {
            value: number;
        };
    };
};
export declare type StatusChartStatusMesh = InstancedMesh & {
    geometry: StatusBufferGeometry;
    material: StatusChartLineMaterial;
};
export declare const NUM_POSITION_COMPONENTS = 2;
export declare const NUM_STATUS_COMPONENTS = 4;
export declare const statusMesh: ({ alarms, dataStreams, toClipSpace, bufferFactor, minBufferSize, thresholdOptions, thresholds, chartSize, }: {
    alarms?: AlarmsConfig | undefined;
    dataStreams: DataStream[];
    toClipSpace: (time: number) => number;
    bufferFactor: number;
    minBufferSize: number;
    thresholdOptions: ThresholdOptions;
    thresholds: Threshold[];
    chartSize: {
        width: number;
        height: number;
    };
}) => StatusChartStatusMesh;
export declare const updateStatusMesh: ({ alarms, statuses, dataStreams, toClipSpace, thresholdOptions, thresholds, chartSize, hasDataChanged, hasAnnotationChanged, hasSizeChanged, }: {
    alarms?: AlarmsConfig | undefined;
    statuses: StatusChartStatusMesh;
    dataStreams: DataStream[];
    toClipSpace: (time: number) => number;
    thresholdOptions: ThresholdOptions;
    thresholds: Threshold[];
    chartSize: {
        width: number;
        height: number;
    };
    hasDataChanged: boolean;
    hasAnnotationChanged: boolean;
    hasSizeChanged: boolean;
}) => void;
export {};
