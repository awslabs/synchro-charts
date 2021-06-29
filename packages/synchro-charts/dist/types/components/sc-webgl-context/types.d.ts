import { BufferAttribute, InstancedBufferAttribute, OrthographicCamera, Scene } from 'three';
export interface MutableArrayLike<T> {
    readonly length: number;
    [n: number]: T;
}
export interface WriteableBufferAttribute extends BufferAttribute {
    array: MutableArrayLike<number>;
}
export interface WriteableInstancedBufferAttribute extends InstancedBufferAttribute {
    array: MutableArrayLike<number>;
}
export interface ViewPortManager {
    id: string;
    viewPortGroup?: string;
    updateViewPort: (viewPortUpdate: {
        start: Date;
        end: Date;
    }) => void;
    dispose: () => void;
}
export interface ChartScene extends ViewPortManager {
    scene: Scene;
    container: HTMLElement;
    camera: OrthographicCamera;
    toClipSpace: (time: number) => number;
}
/**
 * Represents a camera event. Emitted to alter the view port of
 * one or more camera such as panning.
 *
 * TODO: Expand on the camera event system - most
 *  likely we will want to move to a higher level abstraction,
 *  i.e. have a 'pan', 'brush', 'scale', event
 */
export declare type CameraEvent = {
    dx: number;
    dy: number;
    scale: number;
    sceneId: string;
};
