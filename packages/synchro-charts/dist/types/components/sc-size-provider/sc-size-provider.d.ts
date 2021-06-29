import { RectScrollFixed } from '../../utils/types';
declare type Size = {
    width: number;
    height: number;
};
/**
 * Widget Sizer
 */
export declare class ScSizeProvider {
    el: HTMLElement;
    renderFunc: (rect: RectScrollFixed) => void;
    /** Size overrides. these will take precident over any auto-calculated sizing */
    size?: Size;
    /** The DOM Elements size as computed by the observer. corrected on resolution changes. */
    computedSize: {
        width: number;
        height: number;
    } | null;
    rect: RectScrollFixed | null;
    private resizer;
    private rectPollingHandler;
    componentWillLoad(): void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    setRect: () => void;
    render(): any;
}
export {};
